import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpotAvailabilityResponse, SpotResponse } from '../models/models';

const API_BASE = 'https://humble-chainsaw-6v59j7v5gp4w2r574-8080.app.github.dev/api/spots';

@Injectable({ providedIn: 'root' })
export class SpotService {

  constructor(private http: HttpClient) {}

  getAvailabilitySummary(): Observable<SpotAvailabilityResponse[]> {
    return this.http.get<SpotAvailabilityResponse[]>(`${API_BASE}/availability`);
  }

  isEvFree(): Observable<{ evSpotFree: boolean }> {
    return this.http.get<{ evSpotFree: boolean }>(`${API_BASE}/ev-free`);
  }

  getAllSpots(): Observable<SpotResponse[]> {
    return this.http.get<SpotResponse[]>(API_BASE);
  }
}
