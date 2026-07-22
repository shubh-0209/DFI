const forecastRepository = require('./forecast.repository');
const {
  FORECAST_TYPES,
  TREND_DIRECTION,
  CONFIDENCE_LEVELS,
  RECOMMENDATIONS,
  MIN_DATA_POINTS,
  DEFAULT_FORECAST_MONTHS,
  CONFIDENCE_THRESHOLDS,
} = require('./forecast.constants');

class ForecastService {
  _linearRegression(series) {
    const n = series.length;
    if (n === 0) return null;

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (let i = 0; i < n; i++) {
      const x = i + 1;
      const y = series[i];
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }

    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) return null;

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    let ssTot = 0;
    let ssRes = 0;
    const meanY = sumY / n;

    for (let i = 0; i < n; i++) {
      const y = series[i];
      const predicted = slope * (i + 1) + intercept;
      ssTot += (y - meanY) ** 2;
      ssRes += (y - predicted) ** 2;
    }

    const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

    return { slope, intercept, r2 };
  }

  _forecastNextMonths(series, months) {
    if (!series || series.length === 0) return [];

    const model = this._linearRegression(series);
    if (!model) return [];

    const predictions = [];
    const n = series.length;

    for (let i = 0; i < months; i++) {
      const nextIndex = n + i + 1;
      const predicted = model.slope * nextIndex + model.intercept;
      predictions.push(Math.round(Math.max(0, predicted) * 100) / 100);
    }

    return predictions;
  }

  _determineTrend(series) {
    if (!series || series.length < 2) return TREND_DIRECTION.STABLE;

    const model = this._linearRegression(series);
    if (!model) return TREND_DIRECTION.STABLE;

    const absSlope = Math.abs(model.slope);
    const meanValue = series.reduce((a, b) => a + b, 0) / series.length;
    const relativeSlope = meanValue === 0 ? absSlope : absSlope / meanValue;

    const positiveChanges = [];
    for (let i = 1; i < series.length; i++) {
      if (series[i - 1] !== 0) {
        positiveChanges.push(Math.abs(series[i] - series[i - 1]) / series[i - 1]);
      }
    }
    const avgChange = positiveChanges.length > 0
      ? positiveChanges.reduce((a, b) => a + b, 0) / positiveChanges.length
      : 0;

    if (avgChange > 0.8 || relativeSlope > 0.8) return TREND_DIRECTION.VOLATILE;
    if (model.slope > 0) return TREND_DIRECTION.UP;
    if (model.slope < 0) return TREND_DIRECTION.DOWN;
    return TREND_DIRECTION.STABLE;
  }

  _calculateConfidence(series) {
    if (!series || series.length < MIN_DATA_POINTS) {
      return { level: CONFIDENCE_LEVELS.LOW, score: 0.3 };
    }

    const model = this._linearRegression(series);
    if (!model) {
      return { level: CONFIDENCE_LEVELS.LOW, score: 0.3 };
    }

    const r2 = model.r2;
    const dataPointBonus = Math.min((series.length - MIN_DATA_POINTS) * 0.05, 0.2);

    let score = r2 * 0.8 + dataPointBonus;
    score = Math.min(Math.max(score, 0.1), 0.99);

    let level;
    if (score >= CONFIDENCE_THRESHOLDS.HIGH) {
      level = CONFIDENCE_LEVELS.HIGH;
    } else if (score >= CONFIDENCE_THRESHOLDS.MEDIUM) {
      level = CONFIDENCE_LEVELS.MEDIUM;
    } else {
      level = CONFIDENCE_LEVELS.LOW;
    }

    return { level, score: Math.round(score * 100) / 100 };
  }

  _buildSeries(history) {
    if (!history || history.length === 0) return [];
    return history.map(h => h.count ?? h.total ?? h.active ?? h.redemptions ?? h.hours ?? 0);
  }

  async getDashboardForecast() {
    const [dashboard, currentValues, volunteerHistory, programHistory, attendanceHistory, certificateHistory, rewardHistory] = await Promise.all([
      forecastRepository.getDashboardData(),
      forecastRepository.getCurrentValues(),
      forecastRepository.getVolunteerHistory(),
      forecastRepository.getProgramHistory(),
      forecastRepository.getAttendanceHistory(),
      forecastRepository.getCertificateHistory(),
      forecastRepository.getRewardHistory(),
    ]);

    const volunteerSeries = volunteerHistory.map(h => h.total);
    const programSeries = programHistory.map(h => h.count);
    const attendanceSeries = attendanceHistory.map(h => h.count);
    const certificateSeries = certificateHistory.map(h => h.count);
    const rewardSeries = rewardHistory.map(h => h.redemptions);

    const volunteerForecast = this._forecast(volunteerSeries, currentValues.volunteers.current);
    const programForecast = this._forecast(programSeries, currentValues.programs.current);
    const attendanceForecast = this._forecast(attendanceSeries, currentValues.attendance.current);
    const certificateForecast = this._forecast(certificateSeries, currentValues.certificates.current);
    const rewardForecast = this._forecast(rewardSeries, currentValues.rewards.current);

    return {
      overview: dashboard,
      forecasts: {
        volunteers: volunteerForecast,
        programs: programForecast,
        attendance: attendanceForecast,
        certificates: certificateForecast,
        rewards: rewardForecast,
      },
    };
  }

  _forecast(series, currentValue) {
    const predictions = this._forecastNextMonths(series, DEFAULT_FORECAST_MONTHS);
    const trend = this._determineTrend(series);
    const confidence = this._calculateConfidence(series);
    const forecastValue = predictions.length > 0 ? predictions[0] : currentValue;
    const growth = currentValue === 0 ? 0 : ((forecastValue - currentValue) / currentValue) * 100;

    let recommendation = '';
    const key = trend;
    const typeRecs = RECOMMENDATIONS;
    recommendation = typeRecs?.[key] || 'Continue monitoring this metric.';

    return {
      currentValue: Math.round(currentValue * 100) / 100,
      forecastValue: Math.round(forecastValue * 100) / 100,
      growth: Math.round(growth * 100) / 100,
      trend,
      confidence: confidence.level,
      confidenceScore: confidence.score,
      recommendation,
      predictions: predictions.map((v, i) => ({
        period: `+${i + 1} month${i > 0 ? 's' : ''}`,
        value: Math.round(v * 100) / 100,
      })),
    };
  }

  async getVolunteerForecast() {
    const currentValues = await forecastRepository.getCurrentValues();
    const history = await forecastRepository.getVolunteerHistory();
    const series = history.map(h => h.total);
    const activeSeries = history.map(h => h.active);

    const volunteerForecast = this._forecast(series, currentValues.volunteers.current);
    const activeForecast = this._forecast(activeSeries, currentValues.activeVolunteers);
    const growthTrend = this._determineTrend(series);
    const recommendation = RECOMMENDATIONS.VOLUNTEER_GROWTH[growthTrend] || 'Continue current volunteer engagement strategies.';

    return {
      type: FORECAST_TYPES.VOLUNTEERS,
      currentValue: volunteerForecast.currentValue,
      forecastValue: volunteerForecast.forecastValue,
      growth: volunteerForecast.growth,
      trend: volunteerForecast.trend,
      confidence: volunteerForecast.confidence,
      confidenceScore: volunteerForecast.confidenceScore,
      recommendation,
      activeVolunteers: {
        currentValue: activeForecast.currentValue,
        forecastValue: activeForecast.forecastValue,
        growth: activeForecast.growth,
        trend: activeForecast.trend,
        confidence: activeForecast.confidence,
        confidenceScore: activeForecast.confidenceScore,
      },
      predictions: volunteerForecast.predictions,
      historicalData: history.slice(-6),
    };
  }

  async getProgramForecast() {
    const currentValues = await forecastRepository.getCurrentValues();
    const history = await forecastRepository.getProgramHistory();
    const series = history.map(h => h.count);
    const forecast = this._forecast(series, currentValues.programs.current);
    const trend = this._determineTrend(series);
    const recommendation = RECOMMENDATIONS.PROGRAM_DEMAND[trend] || 'Monitor program demand closely.';

    return {
      type: FORECAST_TYPES.PROGRAMS,
      currentValue: forecast.currentValue,
      forecastValue: forecast.forecastValue,
      growth: forecast.growth,
      trend: forecast.trend,
      confidence: forecast.confidence,
      confidenceScore: forecast.confidenceScore,
      recommendation,
      predictions: forecast.predictions,
      historicalData: history.slice(-6),
    };
  }

  async getAttendanceForecast() {
    const currentValues = await forecastRepository.getCurrentValues();
    const history = await forecastRepository.getAttendanceHistory();
    const countSeries = history.map(h => h.count);
    const hoursSeries = history.map(h => h.hours);
    const countForecast = this._forecast(countSeries, currentValues.attendance.current);
    const hoursForecast = this._forecast(hoursSeries, hoursSeries[hoursSeries.length - 1] || 0);
    const trend = this._determineTrend(countSeries);
    const recommendation = RECOMMENDATIONS.ATTENDANCE_TRENDS[trend] || 'Monitor attendance patterns.';

    return {
      type: FORECAST_TYPES.ATTENDANCE,
      currentValue: countForecast.currentValue,
      forecastValue: countForecast.forecastValue,
      growth: countForecast.growth,
      trend: countForecast.trend,
      confidence: countForecast.confidence,
      confidenceScore: countForecast.confidenceScore,
      recommendation,
      hoursForecast: {
        currentValue: hoursForecast.currentValue,
        forecastValue: hoursForecast.forecastValue,
        growth: hoursForecast.growth,
        trend: hoursForecast.trend,
      },
      predictions: countForecast.predictions,
      historicalData: history.slice(-6),
    };
  }

  async getRewardForecast() {
    const currentValues = await forecastRepository.getCurrentValues();
    const [rewardHistory, coinHistory] = await Promise.all([
      forecastRepository.getRewardHistory(),
      forecastRepository.getCoinDistributionHistory(),
    ]);

    const redemptionSeries = rewardHistory.map(h => h.redemptions);
    const coinSeries = coinHistory.map(h => h.coins);

    const redemptionForecast = this._forecast(redemptionSeries, currentValues.rewards.current);
    const coinForecast = this._forecast(coinSeries, currentValues.coins.current);

    const redemptionTrend = this._determineTrend(redemptionSeries);
    const coinTrend = this._determineTrend(coinSeries);

    const redemptionRec = RECOMMENDATIONS.REWARD_REDEMPTION[redemptionTrend] || 'Monitor reward activity.';
    const coinRec = RECOMMENDATIONS.COIN_DISTRIBUTION[coinTrend] || 'Monitor coin distribution.';

    return {
      type: FORECAST_TYPES.REWARDS,
      redemption: {
        currentValue: redemptionForecast.currentValue,
        forecastValue: redemptionForecast.forecastValue,
        growth: redemptionForecast.growth,
        trend: redemptionForecast.trend,
        confidence: redemptionForecast.confidence,
        confidenceScore: redemptionForecast.confidenceScore,
        recommendation: redemptionRec,
        predictions: redemptionForecast.predictions,
        historicalData: rewardHistory.slice(-6),
      },
      coinDistribution: {
        currentValue: coinForecast.currentValue,
        forecastValue: coinForecast.forecastValue,
        growth: coinForecast.growth,
        trend: coinForecast.trend,
        confidence: coinForecast.confidence,
        confidenceScore: coinForecast.confidenceScore,
        recommendation: coinRec,
        predictions: coinForecast.predictions,
        historicalData: coinHistory.slice(-6),
      },
      activeVolunteers: {
        currentValue: currentValues.activeVolunteers,
        forecastValue: currentValues.activeVolunteers,
        trend: 'stable',
        confidence: 'medium',
        confidenceScore: 0.5,
      },
      ngoParticipation: {
        currentValue: currentValues.ngoParticipation,
        forecastValue: currentValues.ngoParticipation,
        trend: 'stable',
        confidence: 'low',
        confidenceScore: 0.3,
      },
    };
  }
}

module.exports = new ForecastService();
