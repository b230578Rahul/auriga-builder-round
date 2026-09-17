import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotService } from '../../services/spot.service';
import { SpotAvailabilityResponse, SpotResponse } from '../../models/models';

@Component({
  selector: 'app-spot-availability',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card card-stat p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">Live Spot Availability</h5>
        <button class="btn btn-sm btn-outline-secondary" (click)="refresh()">
          <i class="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-4" *ngFor="let s of summary">
          <div class="p-3 rounded-3" [ngClass]="s.spotType === 'EV' ? 'spot-ev' : ''"
               style="background:#f8f9fb;">
            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-bold">
                {{ s.spotType === 'EV' ? '⚡ EV' : s.spotType }}
              </span>
              <span class="badge" [ngClass]="s.freeSpots > 0 ? 'bg-success' : 'bg-danger'">
                {{ s.freeSpots > 0 ? 'Available' : 'Full' }}
              </span>
            </div>
            <div class="small text-muted mt-1">
              {{ s.freeSpots }} free / {{ s.totalSpots }} total ({{ s.occupiedSpots }} occupied)
            </div>
          </div>
        </div>
      </div>

      <h6 class="fw-bold mb-2">Spot Grid (by floor)</h6>
      <div *ngFor="let floor of floors" class="mb-3">
        <div class="text-muted small mb-1">Floor {{ floor }}</div>
        <div class="row g-2">
          <div class="col-2" *ngFor="let sp of spotsByFloor(floor)">
            <div class="spot-badge" [ngClass]="sp.occupied ? 'spot-occupied' : 'spot-free'" [title]="sp.occupiedByPlate ?? ''">
              {{ sp.spotNumber }}<span *ngIf="sp.spotType === 'EV'"> ⚡</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SpotAvailabilityComponent implements OnChanges {
  @Input() refreshTrigger: number = 0;

  summary: SpotAvailabilityResponse[] = [];
  allSpots: SpotResponse[] = [];
  floors: number[] = [];

  constructor(private spotService: SpotService) {
    this.refresh();
  }

  ngOnChanges(): void {
    this.refresh();
  }

  refresh(): void {
    this.spotService.getAvailabilitySummary().subscribe(res => this.summary = res);
    this.spotService.getAllSpots().subscribe(res => {
      this.allSpots = res;
      this.floors = [...new Set(res.map(s => s.floor))].sort();
    });
  }

  spotsByFloor(floor: number): SpotResponse[] {
    return this.allSpots.filter(s => s.floor === floor);
  }
}
