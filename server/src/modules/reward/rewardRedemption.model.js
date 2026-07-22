const mongoose = require('mongoose');

const rewardRedemptionSchema = new mongoose.Schema(
  {
    redemptionId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RewardCatalog',
      required: [true, 'Reward reference is required'],
    },
    rewardSnapshot: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      coinCost: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        required: true,
        trim: true,
      },
      image: {
        type: String,
        trim: true,
        default: '',
      },
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalCoinsDeducted: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    redeemedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
    trackingNumber: {
      type: String,
      trim: true,
      default: '',
    },
    // Physical reward delivery address (collected at redemption time)
    deliveryAddress: {
      fullName:  { type: String, trim: true, default: '' },
      line1:     { type: String, trim: true, default: '' },
      city:      { type: String, trim: true, default: '' },
      state:     { type: String, trim: true, default: '' },
      pincode:   { type: String, trim: true, default: '' },
      phone:     { type: String, trim: true, default: '' },
    },
    // Whether this reward needs physical shipping or is delivered digitally
    rewardType: {
      type: String,
      enum: ['physical', 'digital'],
      default: 'physical',
    },
  },
  {
    timestamps: true,
  }
);

rewardRedemptionSchema.index({ user: 1, createdAt: -1 });
rewardRedemptionSchema.index({ status: 1 });
rewardRedemptionSchema.index({ reward: 1 });

rewardRedemptionSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const RewardRedemption = mongoose.model('RewardRedemption', rewardRedemptionSchema);

module.exports = RewardRedemption;
