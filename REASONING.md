# Reasoning & Approach

## Architecture Decisions
- Layered Spring Boot structure: controller → service → repository, with DTOs to decouple API contracts from JPA entities.
- JWT-based stateless auth (JwtUtil, JwtAuthFilter, SecurityConfig) instead of session-based auth, since the frontend is a separate SPA.
- H2 in-memory DB for fast setup and zero external dependencies during evaluation; spots auto-seeded on boot via a CommandLineRunner.
- `@Transactional` on check-in/check-out service methods to prevent race conditions/double-booking on a spot.

## Fee Calculation
Tiered model: $5 flat for the first hour, $3/hr after, capped at $25/day, computed in 24-hour blocks so multi-day stays are charged correctly per day rather than as one long duration. Partial hours round up.

## Issues Found & Fixed During Testing
1. **Lombok annotations not resolving in the Codespace's Maven build** (`cannot find symbol: builder()/getX()/setX()` across ~70 compile errors). Root cause: the container's `javac` wasn't invoking Lombok's annotation processor. Fix: rewrote all entities, DTOs, and services with explicit constructors/getters/setters instead of Lombok annotations, removing the dependency entirely for environment portability.
2. **Angular `NG0908: Zone.js` runtime error** on load — `zone.js` wasn't imported in `main.ts`. Fixed by adding `import 'zone.js';` as the first line.
3. **CORS / connection-refused errors** when running in GitHub Codespaces — frontend and backend forwarded URLs differ from `localhost`, so `app.cors.allowed-origin` (backend) and hardcoded `API_BASE` constants (frontend services) were updated to the Codespace's public forwarded URLs instead of `localhost:4200`/`localhost:8080`.
4. Verified data persistence and seeded spots via the H2 console (`jdbc:h2:mem:garagedb`) and via direct REST calls to `/api/spots`.

## Testing Approach
- Manual end-to-end testing: register → login → check-in a vehicle → verify spot marked occupied → check-out → verify fee calculation and spot freed.
- Verified seeded data via H2 console query on `parking_spots` table.
- Verified CORS fix by testing register/login from the deployed Codespace forwarded URL rather than localhost.