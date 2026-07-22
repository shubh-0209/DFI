import api from './api';

export const getForecastDashboard = async () => {
  return api.get('/forecast/dashboard');
};

export const getVolunteerForecast = async () => {
  return api.get('/forecast/volunteers');
};

export const getProgramForecast = async () => {
  return api.get('/forecast/programs');
};

export const getAttendanceForecast = async () => {
  return api.get('/forecast/attendance');
};

export const getRewardForecast = async () => {
  return api.get('/forecast/rewards');
};
