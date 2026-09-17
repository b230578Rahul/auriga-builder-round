import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse } from '../models/models';

const API_BASE = 'http://localhost:8080/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/login`, { username, password })
      .pipe(tap(res => this.setSession(res)));
  }

  register(username: string, password: string, fullName: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/register`, { username, password, fullName })
      .pipe(tap(res => this.setSession(res)));
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem('jwt_token', res.token);
    localStorage.setItem('username', res.username);
    localStorage.setItem('fullName', res.fullName);
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getFullName(): string | null {
    return localStorage.getItem('fullName');
  }
}
