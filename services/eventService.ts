import { apiClient } from './apiClient';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  spots: number;
  image: string;
  level: string;
  organizer: string;
  description?: string;
}

export interface EventsResponse {
  events: EventItem[];
}

export interface EventResponse {
  event: EventItem;
}

export const eventService = {
  getAllEvents: () => apiClient.getPublic<EventsResponse>('/api/events'),
  getEventById: (id: string | number) => apiClient.getPublic<EventResponse>(`/api/events/${id}`),
};
