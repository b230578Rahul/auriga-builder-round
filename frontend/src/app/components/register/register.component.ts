import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container" style="max-width:420px; margin-top:60px;">
      <div class="card card-stat p-4">
        <h4 class="mb-3 text-center">Attendant Registration</h4>
        <div *ngIf="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label">Full Name</label>
            <input class="form-control" [(ngModel)]="fullName" name="fullName" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Username</label>
            <input class="form-control" [(ngModel)]="username" name="username" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Password (min 6 chars)</label>
            <input class="form-control" type="password" [(ngModel)]="password" name="password" required minlength="6">
          </div>
          <button class="btn btn-brand w-100" type="submit" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Register' }}
          </button>
        </form>
        <p class="text-center mt-3 mb-0 small">
          Already have an account? <a routerLink="/login">Login</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  fullName = '';
  username = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMsg = '';
    this.loading = true;
    this.auth.register(this.username, this.password, this.fullName).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/dashboard']); },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message ?? 'Registration failed.';
      }
    });
  }
}
