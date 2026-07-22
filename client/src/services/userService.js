import api from './api';

/** Get the currently logged‑in user's profile */
export const getProfile = async () => await api.get('/users/me');

/** Update the currently logged‑in user's profile */
export const updateProfile = async (data) => await api.put('/users/me', data);

export default { getProfile, updateProfile };
