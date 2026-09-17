import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { VehicleType, TicketResponse } from '../../models/models';

@Component({
  selector: 'app-checkin-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card card-stat p-4 mb-4">
      <ul class="nav nav-pills mb-3">
        <li class="nav-item">
          <button class="nav-link" [class.active]="mode === 'IN'" (click)="mode = 'IN'">Check-In</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="mode === 'OUT'" (click)="mode = 'OUT'">Check-Out</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="mode === 'FIND'" (click)="mode = 'FIND'">Find by Plate</button>
        </li>
      </ul>

      <div *ngIf="successMsg" class="alert alert-success py-2">{{ successMsg }}</div>
      <div *ngIf="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>

      <!-- CHECK IN -->
      <form *ngIf="mode === 'IN'" (ngSubmit)="submitCheckIn()">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">License Plate</label>
            <input class="form-control text-uppercase" [(ngModel)]="plate" name="plate" required placeholder="e.g. RJ14AB1234">
          </div>
          <div class="col-md-4">
            <label class="form-label">Vehicle Type</label>
            <select class="form-select" [(ngModel)]="vehicleType" name="vehicleType" required>
              <option value="COMPACT">Compact</option>
              <option value="STANDARD">Standard</option>
              <option value="EV">EV (needs charger)</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Owner Name (optional)</label>
            <input class="form-control" [(ngModel)]="ownerName" name="ownerName">
          </div>
        </div>
        <button class="btn btn-brand mt-3" type="submit" [disabled]="loading">
          {{ loading ? 'Checking in...' : 'Check In Vehicle' }}
        </button>
      </form>

      <!-- CHECK OUT -->
      <form *ngIf="mode === 'OUT'" (ngSubmit)="submitCheckOut()">
        <div class="row g-3 align-items-end">
          <div class="col-md-6">
            <label class="form-label">License Plate</label>
            <input class="form-control text-uppercase" [(ngModel)]="plate" name="plateOut" required>
          </div>
          <div class="col-md-3">
            <button class="btn btn-brand" type="submit" [disabled]="loading">
              {{ loading ? 'Processing...' : 'Check Out & Charge' }}
            </button>
          </div>
        </div>
      </form>

      <!-- FIND -->
      <form *ngIf="mode === 'FIND'" (ngSubmit)="submitFind()">
        <div class="row g-3 align-items-end">
          <div class="col-md-6">
            <label class="form-label">License Plate</label>
            <input class="form-control text-uppercase" [(ngModel)]="plate" name="plateFind" required>
          </div>
          <div class="col-md-3">
            <button class="btn btn-brand" type="submit" [disabled]="loading">Search</button>
          </div>
        </div>
      </form>

      <!-- RESULT TICKET -->
      <div *ngIf="resultTicket" class="mt-4 p-3 rounded-3 border">
        <div class="row">
          <div class="col-md-3"><strong>Plate:</strong> {{ resultTicket.licensePlate }}</div>
          <div class="col-md-3"><strong>Spot:</strong> {{ resultTicket.spotNumber }} (Floor {{ resultTicket.floor }})</div>
          <div class="col-md-3"><strong>Status:</strong> {{ resultTicket.status }}</div>
          <div class="col-md-3"><strong>Duration:</strong> {{ resultTicket.durationDisplay }}</div>
        </div>
        <div class="row mt-2">
          <div class="col-md-6"><strong>Check-in:</strong> {{ resultTicket.checkInTime | date:'medium' }}</div>
          <div class="col-md-6" *ngIf="resultTicket.checkOutTime">
            <strong>Check-out:</strong> {{ resultTicket.checkOutTime | date:'medium' }}
          </div>
        </div>
        <div class="mt-2" *ngIf="resultTicket.feeCharged !== null">
          <strong>Fee Charged:</strong> <span class="fs-5 text-success">\${{ resultTicket.feeCharged }}</span>
        </div>
      </div>
    </div>
  `
})
export class CheckinCheckoutComponent {
  @Output() transactionComplete = new EventEmitter<void>();

  mode: 'IN' | 'OUT' | 'FIND' = 'IN';
  plate = '';
  vehicleType: VehicleType = 'STANDARD';
  ownerName = '';

  loading = false;
  successMsg = '';
  errorMsg = '';
  resultTicket: TicketResponse | null = null;

  constructor(private ticketService: TicketService) {}

  private reset(): void {
    this.successMsg = '';
    this.errorMsg = '';
    this.loading = true;
  }

  submitCheckIn(): void {
    this.reset();
    this.ticketService.checkIn({ licensePlate: this.plate, vehicleType: this.vehicleType, ownerName: this.ownerName })
      .subscribe({
        next: (ticket) => {
          this.loading = false;
          this.resultTicket = ticket;
          this.successMsg = `Checked in — assigned spot ${ticket.spotNumber}.`;
          this.transactionComplete.emit();
        },
        error: (err) => { this.loading = false; this.errorMsg = err?.error?.message ?? 'Check-in failed.'; }
      });
  }

  submitCheckOut(): void {
    this.reset();
    this.ticketService.checkOut({ licensePlate: this.plate })
      .subscribe({
        next: (ticket) => {
          this.loading = false;
          this.resultTicket = ticket;
          this.successMsg = `Checked out — fee charged: $${ticket.feeCharged}`;
          this.transactionComplete.emit();
        },
        error: (err) => { this.loading = false; this.errorMsg = err?.error?.message ?? 'Check-out failed.'; }
      });
  }

  submitFind(): void {
    this.reset();
    this.ticketService.findByPlate(this.plate)
      .subscribe({
        next: (ticket) => { this.loading = false; this.resultTicket = ticket; this.successMsg = 'Active ticket found.'; },
        error: (err) => { this.loading = false; this.errorMsg = err?.error?.message ?? 'No active ticket found.'; this.resultTicket = null; }
      });
  }
}
