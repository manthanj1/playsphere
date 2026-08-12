import { apiClient } from './apiClient';

export interface TurfItem {
  id: number;
  name: string;
  city: string;
  location: string;
  sport: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  availability: string;
  description?: string;
  amenities?: string[];
  latitude?: number;
  longitude?: number;
}

export interface TurfsResponse {
  turfs: TurfItem[];
}

export interface NetData {
  id: string;
  name: string;
  areaType: "INDOOR" | "OUTDOOR";
  bookedSlots: string[];
}

export interface NetsApiResponse {
  nets: NetData[];
  isRainy: boolean;
  weatherCode: number | null;
  temperature: number | null;
}

export interface TurfResponse {
  turf: TurfItem;
}

export const turfService = {
  getAllTurfs: () => apiClient.getPublic<TurfsResponse>('/api/turfs'),
  getTurfById: (id: string | number) => apiClient.getPublic<TurfResponse>(`/api/turfs/${id}`),
  getTurfNets: (id: string | number, date?: string) => 
    apiClient.getPublic<NetsApiResponse>(`/api/turfs/${id}/nets${date ? `?date=${encodeURIComponent(date)}` : ""}`),
};
