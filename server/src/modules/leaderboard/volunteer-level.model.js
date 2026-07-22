const mongoose = require('mongoose');

const volunteerLevelSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      required: [true, 'Level is required'],
      unique: true,
      trim: true,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Legend'],
    },
    title: {
      type: String,
      required: [true, 'Level title is required'],
      trim: true,
    },
    minImpact: {
      type: Number,
      default: 0,
      min: [0, 'Min impact cannot be negative'],
    },
    minProgramsCompleted: {
      type: Number,
      default: 0,
      min: [0, 'Min programs completed cannot be negative'],
    },
    minVolunteerHours: {
      type: Number,
      default: 0,
      min: [0, 'Min volunteer hours cannot be negative'],
    },
    bonusMultiplier: {
      type: Number,
      default: 1,
      min: [1, 'Bonus multiplier must be at least 1'],
    },
    icon: {
      type: String,
      trim: true,
      default: '',
    },
    color: {
      type: String,
      trim: true,
      default: '#CD7F32',
    },
    order: {
      type: Number,
      required: true,
      min: [0, 'Order cannot be negative'],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

volunteerLevelSchema.index({ level: 1 });
volunteerLevelSchema.index({ order: 1 });

volunteerLevelSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const VolunteerLevel = mongoose.model('VolunteerLevel', volunteerLevelSchema);

module.exports = VolunteerLevel;
