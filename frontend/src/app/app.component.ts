import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color:#1e3a5f;">
      <div class="container">
        <a class="navbar-brand" routerLink="/">🅿️ CityPark</a>
        <div class="d-flex align-items-center gap-3">
          <ng-container *ngIf="auth.isLoggedIn(); else guestLinks">
            <span class="text-white-50 small">Hi, {{ auth.getFullName() }}</span>
            <a class="btn btn-sm btn-outline-light" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <button class="btn btn-sm btn-warning" (click)="logout()">Logout</button>
          </ng-container>
          <ng-template #guestLinks>
            <a class="btn btn-sm btn-outline-light" routerLink="/login">Attendant Login</a>
            <a class="btn btn-sm btn-warning" routerLink="/register">Register</a>
          </ng-template>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet>
    <footer class="text-center text-muted small py-4">
      &copy; 2026 CityPark Garage Management System — Built for the timed full-stack round.
    </footer>
  `
})
export class AppComponent {
  constructor(public auth: AuthService) {}

  logout(): void {
    this.auth.logout();
  }
}
