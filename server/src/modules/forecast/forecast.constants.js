const FORECAST_TYPES = {
  VOLUNTEERS: 'volunteers',
  PROGRAMS: 'programs',
  ATTENDANCE: 'attendance',
  CERTIFICATES: 'certificates',
  REWARDS: 'rewards',
  COINS: 'coins',
};

const FORECAST_HORIZONS = {
  ONE_MONTH: 1,
  THREE_MONTHS: 3,
  SIX_MONTHS: 6,
};

const TREND_DIRECTION = {
  UP: 'up',
  DOWN: 'down',
  STABLE: 'stable',
  VOLATILE: 'volatile',
};

const CONFIDENCE_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

const RECOMMENDATIONS = {
  VOLUNTEER_GROWTH: {
    up: 'Volunteer growth is accelerating. Increase onboarding capacity and training resources to sustain momentum.',
    down: 'Volunteer recruitment is declining. Review onboarding experience, incentives, and outreach channels.',
    stable: 'Volunteer numbers are stable. Maintain current engagement strategies and consider expanding reach.',
    volatile: 'Volunteer numbers fluctuate significantly. Investigate seasonal or program-specific causes and stabilise recruitment.',
  },
  PROGRAM_DEMAND: {
    up: 'Program demand is rising. Launch more sessions or increase capacity to meet volunteer interest.',
    down: 'Program demand is declining. Review program offerings, update content, or refresh marketing.',
    stable: 'Program demand is steady. Continue current offerings and monitor for emerging interest areas.',
    volatile: 'Program demand is unpredictable. Diversify program types to reduce dependency on popular categories.',
  },
  ATTENDANCE_TRENDS: {
    up: 'Attendance rates are improving. Introduce advanced programs to challenge more experienced volunteers.',
    down: 'Attendance is dropping. Review session scheduling, provide reminders, and re-engage inactive volunteers.',
    stable: 'Attendance is consistent. Maintain current scheduling and explore optional skill-building sessions.',
    volatile: 'Attendance fluctuates. Standardise session times and improve communication to build routine.',
  },
  CERTIFICATE_GROWTH: {
    up: 'Certificate issuance is growing. Ensure quality and timely delivery to maintain volunteer satisfaction.',
    down: 'Certificate completion is declining. Review program completion requirements and support processes.',
    stable: 'Certificate growth is stable. Continue current completion support and look for improvement opportunities.',
    volatile: 'Certificate issuance varies. Identify programs with irregular completion rates and provide targeted support.',
  },
  REWARD_REDEMPTION: {
    up: 'Reward redemption is increasing. Expand reward catalogue and ensure adequate stock levels.',
    down: 'Redemption is declining. Review reward variety, value perception, and redemption process.',
    stable: 'Redemption is steady. Maintain reward offerings and consider introducing limited-time promotions.',
    volatile: 'Redemption is inconsistent. Standardise reward tiers and launch consistent promotions.',
  },
  COIN_DISTRIBUTION: {
    up: 'Coin distribution is rising. Monitor inflation and adjust earning rates to maintain reward value.',
    down: 'Coin distribution is dropping. Review incentive structures and re-engage volunteers with targeted rewards.',
    stable: 'Coin distribution is stable. Continue current incentive structure and monitor volunteer satisfaction.',
    volatile: 'Coin distribution fluctuates. Review attendance and completion bonus structures for consistency.',
  },
  ACTIVE_VOLUNTEERS: {
    up: 'Active volunteer engagement is growing. Introduce leadership roles and advanced projects.',
    down: 'Active engagement is declining. Implement re-engagement campaigns and check-in mechanisms.',
    stable: 'Engagement is stable. Introduce new activities to sustain and grow involvement.',
    volatile: 'Engagement fluctuates. Identify peak and low periods and plan retention activities accordingly.',
  },
  NGO_PARTICIPATION: {
    up: 'NGO participation is increasing. Strengthen partnerships and explore collaboration opportunities.',
    down: 'NGO participation is declining. Review partnership value and restart outreach to inactive organisations.',
    stable: 'NGO participation is steady. Deepen existing relationships and look for expansion opportunities.',
    volatile: 'NGO participation fluctuates. Diversify partnership models to reduce dependency on individual organisations.',
  },
};

const MIN_DATA_POINTS = 3;
const DEFAULT_FORECAST_MONTHS = 3;
const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.7,
  MEDIUM: 0.4,
};

const MESSAGES = {
  FORECAST_DASHBOARD_FETCHED: 'Forecast dashboard data fetched successfully',
  FORECAST_VOLUNTEERS_FETCHED: 'Volunteer forecast fetched successfully',
  FORECAST_PROGRAMS_FETCHED: 'Program forecast fetched successfully',
  FORECAST_ATTENDANCE_FETCHED: 'Attendance forecast fetched successfully',
  FORECAST_REWARDS_FETCHED: 'Reward forecast fetched successfully',
  FORECAST_GENERATED: 'Forecast generated successfully',
};

module.exports = {
  FORECAST_TYPES,
  FORECAST_HORIZONS,
  TREND_DIRECTION,
  CONFIDENCE_LEVELS,
  RECOMMENDATIONS,
  MIN_DATA_POINTS,
  DEFAULT_FORECAST_MONTHS,
  CONFIDENCE_THRESHOLDS,
  MESSAGES,
};
