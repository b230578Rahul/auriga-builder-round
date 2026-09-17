import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container" style="max-width:420px; margin-top:60px;">
      <div class="card card-stat p-4">
        <h4 class="mb-3 text-center">Attendant Login</h4>
        <div *ngIf="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label">Username</label>
            <input class="form-control" [(ngModel)]="username" name="username" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input class="form-control" type="password" [(ngModel)]="password" name="password" required>
          </div>
          <button class="btn btn-brand w-100" type="submit" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Login' }}
          </button>
        </form>
        <p class="text-center mt-3 mb-0 small">
          No account? <a routerLink="/register">Register here</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMsg = '';
    this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/dashboard']); },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message ?? 'Login failed. Check your credentials.';
      }
    });
  }
}
