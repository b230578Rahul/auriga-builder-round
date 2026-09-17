import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckInRequest, CheckOutRequest, PageResponse, TicketResponse } from '../models/models';

const API_BASE = 'https://humble-chainsaw-6v59j7v5gp4w2r574-8080.app.github.dev/api/tickets';

@Injectable({ providedIn: 'root' })
export class TicketService {

  constructor(private http: HttpClient) {}

  checkIn(request: CheckInRequest): Observable<TicketResponse> {
    return this.http.post<TicketResponse>(`${API_BASE}/check-in`, request);
  }

  checkOut(request: CheckOutRequest): Observable<TicketResponse> {
    return this.http.post<TicketResponse>(`${API_BASE}/check-out`, request);
  }

  findByPlate(plate: string): Observable<TicketResponse> {
    return this.http.get<TicketResponse>(`${API_BASE}/search-plate/${plate}`);
  }

  search(
    plate: string | null,
    page: number,
    size: number,
    sortBy: string,
    direction: 'ASC' | 'DESC'
  ): Observable<PageResponse<TicketResponse>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy)
      .set('direction', direction);

    if (plate) {
      params = params.set('plate', plate);
    }

    return this.http.get<PageResponse<TicketResponse>>(API_BASE, { params });
  }
}
