import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinCheckoutComponent } from '../checkin-checkout/checkin-checkout.component';
import { SpotAvailabilityComponent } from '../spot-availability/spot-availability.component';
import { TicketLogComponent } from '../ticket-log/ticket-log.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CheckinCheckoutComponent, SpotAvailabilityComponent, TicketLogComponent],
  template: `
    <div class="container py-4">
      <h3 class="fw-bold mb-4">Attendant Dashboard</h3>

      <app-checkin-checkout (transactionComplete)="bumpRefresh()"></app-checkin-checkout>
      <app-spot-availability [refreshTrigger]="refreshCounter"></app-spot-availability>
      <app-ticket-log [refreshTrigger]="refreshCounter"></app-ticket-log>
    </div>
  `
})
export class DashboardComponent {
  refreshCounter = 0;

  bumpRefresh(): void {
    this.refreshCounter++;
  }
}
