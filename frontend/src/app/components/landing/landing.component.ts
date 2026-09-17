import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- HERO -->
    <section class="hero-gradient py-5">
      <div class="container py-5 text-center">
        <h1 class="display-5 fw-bold">CityPark — Smart Multi-Level Garage Management</h1>
        <p class="lead col-lg-8 mx-auto mt-3">
          A fast, reliable attendant console for busy city-centre parking garages — check cars in and out,
          calculate fees automatically, and keep every spot (including EV chargers) accounted for in real time.
        </p>
        <div class="mt-4">
          <a routerLink="/login" class="btn btn-warning btn-lg me-2">Attendant Login</a>
          <a routerLink="/register" class="btn btn-outline-light btn-lg">Create an Account</a>
        </div>
      </div>
    </section>

    <!-- KEY FEATURES -->
    <section class="container py-5">
      <h2 class="text-center mb-5 fw-bold">Key Features</h2>
      <div class="row g-4">
        <div class="col-md-4" *ngFor="let f of features">
          <div class="card card-stat h-100 p-4 text-center">
            <div class="fs-1 mb-2">{{ f.icon }}</div>
            <h5 class="fw-bold">{{ f.title }}</h5>
            <p class="text-muted mb-0">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TARGET AUDIENCE -->
    <section class="py-5" style="background:#eef2f7;">
      <div class="container">
        <h2 class="text-center mb-5 fw-bold">Who It's For</h2>
        <div class="row g-4">
          <div class="col-md-4" *ngFor="let a of audience">
            <div class="card card-stat h-100 p-4">
              <h6 class="fw-bold">{{ a.title }}</h6>
              <p class="text-muted mb-0 small">{{ a.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BENEFITS -->
    <section class="container py-5">
      <h2 class="text-center mb-5 fw-bold">Benefits</h2>
      <div class="row g-3">
        <div class="col-md-6" *ngFor="let b of benefits">
          <div class="d-flex align-items-start gap-3 p-3">
            <span class="fs-4">✅</span>
            <div>
              <h6 class="fw-bold mb-1">{{ b.title }}</h6>
              <p class="text-muted mb-0 small">{{ b.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FUTURE ROADMAP -->
    <section class="py-5" style="background:#1e3a5f;" class="text-white">
      <div class="container py-3">
        <h2 class="text-center mb-5 fw-bold text-white">What's Next</h2>
        <div class="row g-4">
          <div class="col-md-4" *ngFor="let r of roadmap">
            <div class="card card-stat h-100 p-4" style="background:#28405c; color:#fff;">
              <h6 class="fw-bold">{{ r.title }}</h6>
              <p class="mb-0 small" style="color:#c9d6e3;">{{ r.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class LandingComponent {
  features = [
    { icon: '⏱️', title: 'Tiered Fee Engine', desc: 'First-hour base rate, cheaper hourly rate after, with a daily cap so long stays never get overcharged. Fractional hours round up automatically.' },
    { icon: '🅿️', title: 'Smart Spot Allocation', desc: 'Compact, Standard, and EV spot types with strict rules — EV vehicles are always routed to an EV charging spot, with zero double-booking.' },
    { icon: '🔍', title: 'Instant Plate Lookup', desc: 'Attendants can search any active ticket by license plate or check live EV spot availability in a single click.' },
    { icon: '🔐', title: 'Secure Attendant Login', desc: 'Spring Security + JWT authentication keeps check-in/out actions tied to a verified, logged-in attendant.' },
    { icon: '📊', title: 'Live Occupancy Dashboard', desc: 'Real-time floor-by-floor spot grid with color-coded free/occupied indicators, refreshed after every transaction.' },
    { icon: '📋', title: 'Searchable Ticket Log', desc: 'Full check-in/out history with server-side search, sorting, and pagination — built to stay fast even with thousands of tickets.' },
  ];

  audience = [
    { title: 'City-Centre Garage Operators', desc: 'Multi-level garages with heavy daily turnover that need a single, reliable console for every shift.' },
    { title: 'Parking Attendants', desc: 'Front-line staff who need a fast, error-proof way to check cars in/out without manual fee math.' },
    { title: 'Facility Managers', desc: 'Ops leads who need visibility into occupancy trends, EV spot demand, and revenue per ticket.' },
  ];

  benefits = [
    { title: 'No overcharging on long stays', desc: 'The daily cap protects customers automatically, every time.' },
    { title: 'No double-parking', desc: 'Spot allocation is atomic — a spot can never be assigned to two cars.' },
    { title: 'Faster attendant onboarding', desc: 'A clean, guided UI means new attendants are productive in minutes.' },
    { title: 'Accurate, auditable billing', desc: 'Every ticket records exactly who checked a car in and what fee logic produced the charge.' },
  ];

  roadmap = [
    { title: 'License Plate Recognition (LPR)', desc: 'Camera-based auto check-in/out using computer vision, removing manual plate entry entirely.' },
    { title: 'Online Pre-Booking & Payments', desc: 'Let drivers reserve a spot (including EV chargers) and pay in-app ahead of arrival.' },
    { title: 'Analytics & Revenue Dashboard', desc: 'Occupancy heatmaps, peak-hour trends, and per-floor revenue reporting for facility managers.' },
  ];
}
