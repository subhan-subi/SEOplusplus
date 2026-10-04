import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').trim().replace(/\/+$/, '');

/**
 * Normalizes input domain on the client before submission
 */
export function sanitizeClientDomain(input) {
  if (!input) return '';
  let trimmed = input.trim();
  if (!trimmed) return '';
  // Strip protocol if entered
  trimmed = trimmed.replace(/^https?:\/\//i, '');
  // Strip trailing slashes, paths, and ports
  trimmed = trimmed.split('/')[0].split('?')[0].split('#')[0].split(':')[0];
  return trimmed.toLowerCase();
}

/**
 * Validates domain input format on the client
 */
export function validateClientDomain(domain) {
  if (!domain || !domain.trim()) {
    return 'Please enter a website domain (e.g. example.com).';
  }
  const clean = sanitizeClientDomain(domain);
  const prohibited = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
  if (prohibited.includes(clean) || clean.endsWith('.local') || clean.endsWith('.localhost') || clean.endsWith('.internal')) {
    return 'Local and private network addresses cannot be checked.';
  }
  if (!clean.includes('.') || clean.length < 3) {
    return 'Please enter a valid domain name with an extension (e.g. example.com).';
  }
  return null;
}

/**
 * Requests Domain Rating check from the backend API
 */
export async function checkDomainRating(domain) {
  try {
    const cleanDomain = sanitizeClientDomain(domain);
    const response = await axios.post(`${API_BASE}/dr/check`, { domain: cleanDomain }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 25000
    });

    if (response.data && response.data.success) {
      return response.data;
    }

    throw new Error(response.data?.error || 'Failed to check Domain Rating.');
  } catch (err) {
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      throw new Error('Domain Rating check timed out. Please try again in a few moments.');
    }
    throw new Error(err.message || 'Unable to retrieve Domain Rating. Please verify the domain and try again.');
  }
}
