package com.parking.garage.controller;

import com.parking.garage.dto.*;
import com.parking.garage.service.ParkingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final ParkingService parkingService;

    public TicketController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }

    @PostMapping("/check-in")
    public ResponseEntity<TicketResponse> checkIn(@Valid @RequestBody CheckInRequest request,
                                                    Authentication authentication) {
        return ResponseEntity.ok(parkingService.checkIn(request, authentication.getName()));
    }

    @PostMapping("/check-out")
    public ResponseEntity<TicketResponse> checkOut(@Valid @RequestBody CheckOutRequest request) {
        return ResponseEntity.ok(parkingService.checkOut(request));
    }

    /** Find a car by license plate (attendant lookup) - returns its currently ACTIVE ticket. */
    @GetMapping("/search-plate/{plate}")
    public ResponseEntity<TicketResponse> findByPlate(@PathVariable String plate) {
        return ResponseEntity.ok(parkingService.findActiveByPlate(plate));
    }

    /**
     * Paginated + sortable + searchable log of all check-in/out tickets.
     * Example: GET /api/tickets?page=0&size=10&sortBy=checkInTime&direction=DESC&plate=DL01
     */
    @GetMapping
    public ResponseEntity<Page<TicketResponse>> search(
            @RequestParam(required = false) String plate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "checkInTime") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(parkingService.searchTickets(plate, pageable));
    }
}
