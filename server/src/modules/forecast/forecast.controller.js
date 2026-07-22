const forecastService = require('./forecast.service');
const { MESSAGES } = require('./forecast.constants');
const { successResponse } = require('../../utils/response');

class ForecastController {
  getDashboard = async (req, res, next) => {
    try {
      const result = await forecastService.getDashboardForecast();
      return successResponse(res, 200, MESSAGES.FORECAST_DASHBOARD_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getVolunteers = async (req, res, next) => {
    try {
      const result = await forecastService.getVolunteerForecast();
      return successResponse(res, 200, MESSAGES.FORECAST_VOLUNTEERS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getPrograms = async (req, res, next) => {
    try {
      const result = await forecastService.getProgramForecast();
      return successResponse(res, 200, MESSAGES.FORECAST_PROGRAMS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getAttendance = async (req, res, next) => {
    try {
      const result = await forecastService.getAttendanceForecast();
      return successResponse(res, 200, MESSAGES.FORECAST_ATTENDANCE_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getRewards = async (req, res, next) => {
    try {
      const result = await forecastService.getRewardForecast();
      return successResponse(res, 200, MESSAGES.FORECAST_REWARDS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new ForecastController();
