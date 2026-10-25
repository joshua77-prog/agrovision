import api from './api';

import {
  MOCK_DETECTION_HISTORY,
  MOCK_DETECTION_RESULT,
  MOCK_DISEASES
} from '../utils/mockData';

// ------------------------------------------------------------
// Mock data is still used for history / stats for now.
// Disease detection itself ALWAYS uses the real ML API.
// ------------------------------------------------------------
const USE_MOCK_OTHER_SERVICES = true;

const delay = (ms = 1500) =>
  new Promise((resolve) => setTimeout(resolve, ms));


// ============================================================
// REAL ML DISEASE DETECTION
// ============================================================

/**
 * Send crop image to FastAPI + EfficientNetV2-B0
 *
 * @param {File} imageFile - Uploaded crop image
 * @param {string} crop - Selected crop type
 */
export async function analyzeImage(imageFile, crop) {

  if (!imageFile || !(imageFile instanceof File)) {
    throw new Error('Please select a valid image file.');
  }

  if (!crop) {
    throw new Error('Please select a crop.');
  }

  const formData = new FormData();

  // IMPORTANT:
  // FastAPI expects these exact field names.
  formData.append('file', imageFile);
  formData.append('crop', crop);

  try {

    const response = await fetch(
      'http://127.0.0.1:8001/predict',
      {
        method: 'POST',
        body: formData,
      }
    );

    // Read response even when status is 400/422/etc.
    const result = await response.json();

    // API-level error
    if (!response.ok || !result.success) {

      throw new Error(
        result.error ||
        'Unable to detect disease from this image.'
      );
    }

    // --------------------------------------------------------
    // Return real ML result in the format expected by frontend
    // --------------------------------------------------------

    return {
      ...result,

      // Crop selected by user
      crop,

      // Detection ID
      id: result.id || `det_${Date.now()}`,

      // Detection date
      date: result.date || new Date().toISOString(),

      // Backend explicitly tells us if healthy
      status: result.is_healthy
        ? 'Healthy'
        : 'Diseased',

      // Keep a friendly display name if backend provides it
      disease: result.display_disease || result.disease,
    };

  } catch (error) {

    console.error(
      'AgroVision ML API error:',
      error
    );

    throw error;
  }
}


// ============================================================
// DETECTION HISTORY
// ============================================================

export async function getDetectionHistory(filters = {}) {

  if (USE_MOCK_OTHER_SERVICES) {

    await delay(600);

    let results = [...MOCK_DETECTION_HISTORY];

    if (filters.crop) {
      results = results.filter(
        (d) =>
          d.crop?.toLowerCase() ===
          filters.crop.toLowerCase()
      );
    }

    if (filters.status) {
      results = results.filter(
        (d) =>
          d.status?.toLowerCase() ===
          filters.status.toLowerCase()
      );
    }

    if (filters.search) {

      const q = filters.search.toLowerCase();

      results = results.filter(
        (d) =>
          d.crop?.toLowerCase().includes(q) ||
          d.disease?.toLowerCase().includes(q)
      );
    }

    return results;
  }

  const response = await api.get(
    '/detection/history',
    {
      params: filters
    }
  );

  return response.data;
}


// ============================================================
// GET SINGLE DETECTION
// ============================================================

export async function getDetectionById(id) {

  if (USE_MOCK_OTHER_SERVICES) {

    await delay(500);

    const found =
      MOCK_DETECTION_HISTORY.find(
        (d) => d.id === id
      );

    if (found) {

      const diseaseInfo = found.diseaseId
        ? MOCK_DISEASES.find(
          (disease) =>
            disease.id === found.diseaseId
        )
        : null;

      return {
        ...MOCK_DETECTION_RESULT,
        ...found,
        diseaseInfo
      };
    }

    return MOCK_DETECTION_RESULT;
  }

  const response = await api.get(
    `/detection/${id}`
  );

  return response.data;
}


// ============================================================
// SAVE DETECTION
// ============================================================

export async function saveDetection(
  detectionData
) {

  if (USE_MOCK_OTHER_SERVICES) {

    await delay(600);

    return {
      success: true,
      id: `det_${Date.now()}`
    };
  }

  const response = await api.post(
    '/detection/save',
    detectionData
  );

  return response.data;
}


// ============================================================
// DASHBOARD STATISTICS
// ============================================================

export async function getDetectionStats() {

  if (USE_MOCK_OTHER_SERVICES) {

    await delay(500);

    return {
      totalDetections:
        MOCK_DETECTION_HISTORY.length,

      healthyCrops:
        MOCK_DETECTION_HISTORY.filter(
          (d) => d.status === 'Healthy'
        ).length,

      diseasedCrops:
        MOCK_DETECTION_HISTORY.filter(
          (d) => d.status === 'Diseased'
        ).length,
    };
  }

  const response = await api.get(
    '/detection/stats'
  );

  return response.data;
}
