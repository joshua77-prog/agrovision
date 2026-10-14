import api from './api';
import { MOCK_DISEASES, MOCK_CROPS } from '../utils/mockData';

const USE_MOCK = true;
const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

/**
 * Get all diseases, optionally filtered
 * GET /api/diseases
 */
export async function getAllDiseases(filters = {}) {
  if (USE_MOCK) {
    await delay();
    let results = [...MOCK_DISEASES];

    if (filters.crop) {
      results = results.filter(
        (d) => d.crop.toLowerCase() === filters.crop.toLowerCase()
      );
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.crop.toLowerCase().includes(q) ||
          d.shortDescription.toLowerCase().includes(q)
      );
    }

    return results;
  }

  const response = await api.get('/diseases', { params: filters });
  return response.data;
}

/**
 * Get a single disease by ID
 * GET /api/diseases/:id
 */
export async function getDiseaseById(id) {
  if (USE_MOCK) {
    await delay();
    return MOCK_DISEASES.find((d) => d.id === id) || null;
  }

  const response = await api.get(`/diseases/${id}`);
  return response.data;
}

/**
 * Get all available crops
 * GET /api/crops
 */
export async function getCrops() {
  if (USE_MOCK) {
    await delay(300);
    return MOCK_CROPS;
  }

  const response = await api.get('/crops');
  return response.data;
}
