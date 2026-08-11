import { apiClient } from './apiClient';

export interface CreateOrderResponse {
  order: {
    id: string;
    amount: number;
    currency: string;
  };
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  booking?: any;
}

export interface BookingsListResponse {
  bookings: any[];
}

export const paymentService = {
  createOrder: (amount: number) => 
    apiClient.post<CreateOrderResponse>('/api/payment/create-order', { amount }),
    
  verifyPayment: (verificationData: any) => 
    apiClient.post<VerifyPaymentResponse>('/api/payment/verify', verificationData),
    
  createBooking: (bookingPayload: any) => 
    apiClient.post<BookingResponse>('/api/bookings', bookingPayload),
    
  getBookings: () =>
    apiClient.get<BookingsListResponse>('/api/bookings'),
};
