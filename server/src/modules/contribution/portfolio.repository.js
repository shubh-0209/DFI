const Portfolio = require('./portfolio.model');

class PortfolioRepository {
  async create(portfolioData) {
    return Portfolio.create(portfolioData);
  }

  async findByUser(userId, options = {}) {
    const { page = 1, limit = 10, featured } = options;
    const skip = (page - 1) * limit;

    const query = { userId, isDeleted: false };
    if (featured !== undefined) {
      query.featured = featured;
    }

    const [entries, total] = await Promise.all([
      Portfolio.find(query)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Portfolio.countDocuments(query),
    ]);

    return { entries, total, page, limit };
  }

  async findByContribution(contributionId) {
    return Portfolio.findOne({ contributionId, isDeleted: false });
  }

  async updateFeatured(contributionId, featured) {
    return Portfolio.findOneAndUpdate(
      { contributionId, isDeleted: false },
      { featured },
      { new: true }
    );
  }
}

module.exports = new PortfolioRepository();
