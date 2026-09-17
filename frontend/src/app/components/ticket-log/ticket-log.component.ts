import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { TicketResponse } from '../../models/models';

@Component({
  selector: 'app-ticket-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card card-stat p-4">
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 class="fw-bold mb-0">Check-In / Check-Out Log</h5>
        <input class="form-control" style="max-width:260px;" placeholder="Search by plate..."
               [(ngModel)]="plateQuery" (ngModelChange)="onSearchChange()">
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th role="button" (click)="sortBy('vehicle.licensePlate')">Plate <i class="bi bi-arrow-down-up"></i></th>
              <th>Type</th>
              <th>Spot</th>
              <th role="button" (click)="sortBy('checkInTime')">Check-In <i class="bi bi-arrow-down-up"></i></th>
              <th role="button" (click)="sortBy('checkOutTime')">Check-Out <i class="bi bi-arrow-down-up"></i></th>
              <th>Duration</th>
              <th role="button" (click)="sortBy('feeCharged')">Fee <i class="bi bi-arrow-down-up"></i></th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of tickets">
              <td class="fw-bold">{{ t.licensePlate }}</td>
              <td>{{ t.vehicleType }}</td>
              <td>{{ t.spotNumber }} (F{{ t.floor }})</td>
              <td>{{ t.checkInTime | date:'short' }}</td>
              <td>{{ t.checkOutTime ? (t.checkOutTime | date:'short') : '—' }}</td>
              <td>{{ t.durationDisplay }}</td>
              <td>{{ t.feeCharged !== null ? '$' + t.feeCharged : '—' }}</td>
              <td>
                <span class="badge" [ngClass]="t.status === 'ACTIVE' ? 'bg-primary' : 'bg-secondary'">
                  {{ t.status }}
                </span>
              </td>
            </tr>
            <tr *ngIf="tickets.length === 0">
              <td colspan="8" class="text-center text-muted py-4">No tickets found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-2">
        <span class="small text-muted">Page {{ page + 1 }} of {{ totalPages || 1 }} ({{ totalElements }} total)</span>
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-secondary" [disabled]="page === 0" (click)="changePage(page - 1)">Prev</button>
          <button class="btn btn-sm btn-outline-secondary" [disabled]="page + 1 >= totalPages" (click)="changePage(page + 1)">Next</button>
        </div>
      </div>
    </div>
  `
})
export class TicketLogComponent implements OnChanges {
  @Input() refreshTrigger: number = 0;

  tickets: TicketResponse[] = [];
  plateQuery = '';
  page = 0;
  size = 5;
  totalPages = 0;
  totalElements = 0;
  sortField = 'checkInTime';
  sortDirection: 'ASC' | 'DESC' = 'DESC';

  private searchDebounce: ReturnType<typeof setTimeout> | undefined;

  constructor(private ticketService: TicketService) {
    this.load();
  }

  ngOnChanges(): void {
    this.load();
  }

  load(): void {
    this.ticketService.search(this.plateQuery, this.page, this.size, this.sortField, this.sortDirection)
      .subscribe(res => {
        this.tickets = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
      });
  }

  onSearchChange(): void {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => { this.page = 0; this.load(); }, 350);
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortField = field;
      this.sortDirection = 'ASC';
    }
    this.load();
  }

  changePage(newPage: number): void {
    if (newPage < 0 || newPage >= this.totalPages) return;
    this.page = newPage;
    this.load();
  }
}
