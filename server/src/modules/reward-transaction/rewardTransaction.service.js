const rewardTransactionRepository = require('./rewardTransaction.repository');
const { generateTransactionId } = require('./rewardTransaction.utils');
const { TRANSACTION_TYPE } = require('./rewardTransaction.constants');
const ValidationError = require('../../utils/errors/ValidationError');

class RewardTransactionService {
  async createTransaction(userId, txnData) {
    const { program, certificate, application, attendance, type, reason, coins, points, impact } = txnData;

    if (!Object.values(TRANSACTION_TYPE).includes(type)) {
      throw new ValidationError('Invalid transaction type');
    }

    if (!reason || typeof reason !== 'string' || reason.trim() === '') {
      throw new ValidationError('Reason is required for transaction');
    }

    const transactionId = generateTransactionId();
    const session = await require('mongoose').startSession();
    session.startTransaction();
    try {
      const transaction = await rewardTransactionRepository.create(
        {
          transactionId,
          user: userId,
          program: program || null,
          certificate: certificate || null,
          application: application || null,
          attendance: attendance || null,
          type,
          reason,
          coins: coins || 0,
          points: points || 0,
          impact: impact || 0,
        },
        { session }
      );

      // Increment user's coin balance atomically
      const User = require('../user/user.model');
      await User.updateOne({ _id: userId }, { $inc: { coins: coins || 0 } }, { session });

      // Emit notification event
      const notificationEngine = require('../notification/notificationEngine');
      notificationEngine.emit('rewardEarned', {
        userId,
        transactionId,
        coins: coins || 0,
        type,
        reason,
      });

      await session.commitTransaction();
      session.endSession();
      return transaction;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  getHistory(userId, queryParams) {
    const { page, limit } = queryParams;
    return rewardTransactionRepository.findByUser(userId, {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
  }
}

module.exports = new RewardTransactionService();
