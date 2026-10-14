import api from './api';
import { MOCK_USER } from '../utils/mockData';

// Toggle this to use real API instead of mock data
const USE_MOCK = true;

// Simulates async API delay
const delay = (ms = 800) => new Promise((res) => setTimeout(res, ms));

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(data) {
  if (USE_MOCK) {
    await delay();
    const user = { ...MOCK_USER, name: data.fullName, email: data.email, location: data.location };
    const token = 'mock_token_' + Date.now();
    localStorage.setItem('agrovision_token', token);
    localStorage.setItem('agrovision_user', JSON.stringify(user));
    return { user, token };
  }
  const response = await api.post('/auth/register', data);
  const { user, token } = response.data;
  localStorage.setItem('agrovision_token', token);
  localStorage.setItem('agrovision_user', JSON.stringify(user));
  return { user, token };
}

/**
 * Login an existing user
 * POST /api/auth/login
 */
export async function login(credentials) {
  if (USE_MOCK) {
    await delay();
    if (credentials.email && credentials.password) {
      const user = { ...MOCK_USER, email: credentials.email };
      const token = 'mock_token_' + Date.now();
      localStorage.setItem('agrovision_token', token);
      localStorage.setItem('agrovision_user', JSON.stringify(user));
      return { user, token };
    }
    throw new Error('Invalid credentials');
  }
  const response = await api.post('/auth/login', credentials);
  const { user, token } = response.data;
  localStorage.setItem('agrovision_token', token);
  localStorage.setItem('agrovision_user', JSON.stringify(user));
  return { user, token };
}

/**
 * Logout the current user
 */
export function logout() {
  localStorage.removeItem('agrovision_token');
  localStorage.removeItem('agrovision_user');
}

/**
 * Get current authenticated user from local storage
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('agrovision_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!localStorage.getItem('agrovision_token');
}

/**
 * Update user profile
 * PUT /api/auth/profile
 */
export async function updateProfile(data) {
  if (USE_MOCK) {
    await delay();
    const user = { ...getCurrentUser(), ...data };
    localStorage.setItem('agrovision_user', JSON.stringify(user));
    return user;
  }
  const response = await api.put('/auth/profile', data);
  localStorage.setItem('agrovision_user', JSON.stringify(response.data));
  return response.data;
}

/**
 * Change password
 * PUT /api/auth/change-password
 */
export async function changePassword(data) {
  if (USE_MOCK) {
    await delay();
    return { success: true };
  }
  const response = await api.put('/auth/change-password', data);
  return response.data;
}
