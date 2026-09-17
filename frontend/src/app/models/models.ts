export type VehicleType = 'COMPACT' | 'STANDARD' | 'EV';
export type SpotType = 'COMPACT' | 'STANDARD' | 'EV';
export type TicketStatus = 'ACTIVE' | 'CLOSED';

export interface AuthResponse {
  token: string;
  username: string;
  fullName: string;
  role: string;
}

export interface CheckInRequest {
  licensePlate: string;
  vehicleType: VehicleType;
  ownerName?: string;
  phoneNumber?: string;
}

export interface CheckOutRequest {
  licensePlate: string;
}

export interface TicketResponse {
  ticketId: number;
  licensePlate: string;
  vehicleType: VehicleType;
  spotNumber: string;
  floor: number;
  spotType: SpotType;
  checkInTime: string;
  checkOutTime: string | null;
  feeCharged: number | null;
  durationDisplay: string;
  status: TicketStatus;
  attendantUsername: string;
}

export interface SpotAvailabilityResponse {
  spotType: SpotType;
  totalSpots: number;
  freeSpots: number;
  occupiedSpots: number;
}

export interface SpotResponse {
  id: number;
  spotNumber: string;
  floor: number;
  spotType: SpotType;
  occupied: boolean;
  occupiedByPlate: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
