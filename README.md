# auriga-builder-round
# CityPark – Smart Parking Garage Management System

A full-stack multi-level parking garage management system with vehicle check-in/check-out, real-time spot availability, tiered fee calculation, and JWT-based authentication.

## Tech Stack
- **Backend:** Spring Boot 3.3.4, Spring Security (JWT), Spring Data JPA, H2 (in-memory)
- **Frontend:** Angular 18 (standalone components), Bootstrap 5

## Setup & Run

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Runs on `http://localhost:8080`. H2 console available at `/h2-console`
(JDBC URL: `jdbc:h2:mem:garagedb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE`, user `sa`, blank password).

### Frontend
```bash
cd frontend
npm install
npx ng serve --host 0.0.0.0
```
Runs on `http://localhost:4200`.

> In Codespaces: forward ports 8080 and 4200 as Public, and update `app.cors.allowed-origin` in `application.properties` (backend) and `API_BASE` in `src/app/services/*.service.ts` (frontend) to match the forwarded URLs.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/tickets/check-in` | Check in a vehicle |
| POST | `/api/tickets/check-out` | Check out a vehicle |
| GET | `/api/tickets/search-plate/{plate}` | Find active ticket by plate |
| GET | `/api/tickets` | Paginated/sortable ticket log |
| GET | `/api/spots` | Full spot grid |
| GET | `/api/spots/availability` | Availability summary by type/floor |
| GET | `/api/spots/ev-free` | Check if an EV spot is free |

## Business Rules
- 60 spots seeded on boot (3 floors × EV/COMPACT/STANDARD)
- Fee: $5 base (1st hour), $3/hr after, $25/day cap, billed in 24h blocks, part-hour rounds up
- EV vehicles are strictly allocated to EV spots