/**
 * Simple helper to persist a JWT or session token in localStorage.
 * Used as a fallback when the server does not set an HttpOnly cookie.
 */

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};
