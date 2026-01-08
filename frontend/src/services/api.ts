import axios from 'axios';
import { AnalysisResult, AnalysisRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Convert File or base64 string to FormData
const prepareImageData = async (image: File | string): Promise<FormData> => {
  const formData = new FormData();

  if (typeof image === 'string') {
    // Base64 string from webcam
    const blob = await fetch(image).then(r => r.blob());
    formData.append('image', blob, 'webcam-capture.jpg');
  } else {
    // File object
    formData.append('image', image);
  }

  return formData;
};

export const analyzeImage = async (image: File | string): Promise<AnalysisResult> => {
  try {
    const formData = await prepareImageData(image);

    const response = await api.post<AnalysisResult>('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error
        throw new Error(error.response.data.error || 'Analysis failed');
      } else if (error.request) {
        // No response received
        throw new Error('No response from server. Please check your connection.');
      }
    }
    throw new Error('An unexpected error occurred');
  }
};

export const getAnalysisHistory = async (): Promise<AnalysisResult[]> => {
  try {
    const response = await api.get<AnalysisResult[]>('/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

export const deleteAnalysis = async (id: string): Promise<void> => {
  await api.delete(`/analysis/${id}`);
};

export const exportAnalysisPDF = async (id: string): Promise<Blob> => {
  const response = await api.get(`/analysis/${id}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
};

export default api;
