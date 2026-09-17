package com.parking.garage.controller;

import com.parking.garage.dto.SpotAvailabilityResponse;
import com.parking.garage.dto.SpotResponse;
import com.parking.garage.service.ParkingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/spots")
public class SpotController {

    private final ParkingService parkingService;

    public SpotController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }

    /** Live availability summary grouped by spot type - drives the dashboard indicator. */
    @GetMapping("/availability")
    public ResponseEntity<List<SpotAvailabilityResponse>> availability() {
        return ResponseEntity.ok(parkingService.getAvailabilitySummary());
    }

    /** Quick boolean check specifically for EV spot availability. */
    @GetMapping("/ev-free")
    public ResponseEntity<Map<String, Boolean>> isEvFree() {
        return ResponseEntity.ok(Map.of("evSpotFree", parkingService.isEvSpotFree()));
    }

    /** Full list of every spot (used by the live spot grid view). */
    @GetMapping
    public ResponseEntity<List<SpotResponse>> allSpots() {
        return ResponseEntity.ok(parkingService.getAllSpots());
    }
}
