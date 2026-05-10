import axios from 'axios';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export const tryOnAPI = {
  uploadAndTryOn: async (userPhotoUri: string, clothingUri: string, style: string = 'casual') => {
    const formData = new FormData();
    formData.append('userPhoto', {
      uri: userPhotoUri,
      type: 'image/jpeg',
      name: 'user_photo.jpg',
    } as any);
    formData.append('clothingImage', {
      uri: clothingUri,
      type: 'image/jpeg',
      name: 'clothing.jpg',
    } as any);
    formData.append('style', style);

    const response = await api.post('/api/tryon/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getResult: async (jobId: string) => {
    const response = await api.get(`/api/tryon/result/${jobId}`);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/api/tryon/history');
    return response.data;
  },
};

export const stylistAPI = {
  chat: async (message: string, context?: object) => {
    const response = await api.post('/api/stylist/chat', { message, context });
    return response.data;
  },

  getOutfitSuggestions: async (bodyType: string, preferences: string[]) => {
    const response = await api.post('/api/stylist/suggestions', { bodyType, preferences });
    return response.data;
  },
};

export const outfitAPI = {
  generate: async (prompt: string, style: string) => {
    const response = await api.post('/api/outfit/generate', { prompt, style });
    return response.data;
  },

  getBackground: async (style: string) => {
    const response = await api.post('/api/outfit/background', { style });
    return response.data;
  },
};

export const socialAPI = {
  getFeed: async (page: number = 1) => {
    const response = await api.get(`/api/social/feed?page=${page}`);
    return response.data;
  },

  likePost: async (postId: string) => {
    const response = await api.post(`/api/social/posts/${postId}/like`);
    return response.data;
  },

  savePost: async (postId: string) => {
    const response = await api.post(`/api/social/posts/${postId}/save`);
    return response.data;
  },

  createPost: async (imageUri: string, caption: string, tags: string[]) => {
    const response = await api.post('/api/social/posts', { imageUri, caption, tags });
    return response.data;
  },
};

export default api;
