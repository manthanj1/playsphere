import { apiClient } from './apiClient';

export interface User {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  phone: string;
  profilePhotoUrl?: string | null;
  imageUrl?: string | null;
  role: string;
  bookingsCount?: number;
  tournamentsCount?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
  imageUrl?: string;
}

export interface GenericResponse {
  message: string;
}

export const authService = {
  login: (credentials: any) => 
    apiClient.postPublic<AuthResponse>('/api/auth/login', credentials),
    
  register: (userData: any) => 
    apiClient.postPublic<AuthResponse>('/api/auth/register', userData),
    
  forgotPassword: (email: string) => 
    apiClient.postPublic<GenericResponse>('/api/auth/forgot-password', { email }),
    
  resetPassword: (data: any) => 
    apiClient.postPublic<GenericResponse>('/api/auth/reset-password', data),
    
  updateProfilePhoto: (formData: FormData) => 
    apiClient.post<AuthResponse>('/api/auth/profile-photo', formData),
    
  sync: () => 
    apiClient.post<AuthResponse>('/api/auth/sync'),
    
  getMe: () => 
    apiClient.get<AuthResponse>('/api/auth/me'),
    
  updateProfile: (profileData: any) =>
    apiClient.post<AuthResponse>('/api/auth/sync', profileData),
};
