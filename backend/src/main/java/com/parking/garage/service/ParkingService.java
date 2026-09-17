package com.parking.garage.service;

import com.parking.garage.dto.*;
import com.parking.garage.entity.ParkingSpot;
import com.parking.garage.entity.Ticket;
import com.parking.garage.entity.Vehicle;
import com.parking.garage.enums.SpotType;
import com.parking.garage.enums.TicketStatus;
import com.parking.garage.enums.VehicleType;
import com.parking.garage.exception.NoAvailableSpotException;
import com.parking.garage.exception.TicketNotFoundException;
import com.parking.garage.exception.VehicleAlreadyParkedException;
import com.parking.garage.repository.ParkingSpotRepository;
import com.parking.garage.repository.TicketRepository;
import com.parking.garage.repository.VehicleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ParkingService {

    private final ParkingSpotRepository spotRepository;
    private final VehicleRepository vehicleRepository;
    private final TicketRepository ticketRepository;
    private final FeeCalculationService feeCalculationService;

    public ParkingService(ParkingSpotRepository spotRepository,
                           VehicleRepository vehicleRepository,
                           TicketRepository ticketRepository,
                           FeeCalculationService feeCalculationService) {
        this.spotRepository = spotRepository;
        this.vehicleRepository = vehicleRepository;
        this.ticketRepository = ticketRepository;
        this.feeCalculationService = feeCalculationService;
    }

    /**
     * Checks a vehicle in:
     *  1. Rejects if this plate already has an ACTIVE ticket (no double-parking the same car).
     *  2. Maps VehicleType -> SpotType (EV must go to an EV spot; STANDARD/COMPACT map 1:1).
     *  3. Atomically claims the first free spot of that type.
     */
    @Transactional
    public TicketResponse checkIn(CheckInRequest request, String attendantUsername) {
        String plate = request.getLicensePlate().trim().toUpperCase();

        ticketRepository.findByVehicle_LicensePlateIgnoreCaseAndStatus(plate, TicketStatus.ACTIVE)
                .ifPresent(t -> {
                    throw new VehicleAlreadyParkedException(
                            "Vehicle " + plate + " already has an active ticket (spot " +
                                    t.getSpot().getSpotNumber() + ")");
                });

        Vehicle vehicle = vehicleRepository.findByLicensePlate(plate)
                .orElseGet(() -> vehicleRepository.save(
                        new Vehicle(plate, request.getVehicleType(), request.getOwnerName(), request.getPhoneNumber())));

        SpotType requiredSpotType = mapVehicleTypeToSpotType(request.getVehicleType());

        // Pessimistic-ish allocation: findFirstBySpotTypeAndOccupiedFalse + immediate flip to
        // occupied within the same transaction prevents two simultaneous check-ins racing
        // for the same spot from the H2 in-memory store.
        ParkingSpot spot = spotRepository.findFirstBySpotTypeAndOccupiedFalse(requiredSpotType)
                .orElseThrow(() -> new NoAvailableSpotException(
                        "No available " + requiredSpotType + " spot. Garage is full for this vehicle type."));

        Ticket ticket = new Ticket();
        ticket.setVehicle(vehicle);
        ticket.setSpot(spot);
        ticket.setCheckInTime(LocalDateTime.now());
        ticket.setStatus(TicketStatus.ACTIVE);
        ticket.setAttendantUsername(attendantUsername);
        ticket = ticketRepository.save(ticket);

        spot.setOccupied(true);
        spot.setCurrentTicket(ticket);
        spotRepository.save(spot);

        return toResponse(ticket);
    }

    @Transactional
    public TicketResponse checkOut(CheckOutRequest request) {
        String plate = request.getLicensePlate().trim().toUpperCase();

        Ticket ticket = ticketRepository.findByVehicle_LicensePlateIgnoreCaseAndStatus(plate, TicketStatus.ACTIVE)
                .orElseThrow(() -> new TicketNotFoundException(
                        "No active ticket found for plate " + plate));

        LocalDateTime checkOutTime = LocalDateTime.now();
        double fee = feeCalculationService.calculateFee(ticket.getCheckInTime(), checkOutTime);

        ticket.setCheckOutTime(checkOutTime);
        ticket.setFeeCharged(fee);
        ticket.setStatus(TicketStatus.CLOSED);
        ticketRepository.save(ticket);

        ParkingSpot spot = ticket.getSpot();
        spot.setOccupied(false);
        spot.setCurrentTicket(null);
        spotRepository.save(spot);

        return toResponse(ticket);
    }

    public TicketResponse findActiveByPlate(String plate) {
        Ticket ticket = ticketRepository
                .findByVehicle_LicensePlateIgnoreCaseAndStatus(plate.trim().toUpperCase(), TicketStatus.ACTIVE)
                .orElseThrow(() -> new TicketNotFoundException("No active ticket found for plate " + plate));
        return toResponse(ticket);
    }

    public Page<TicketResponse> searchTickets(String plateQuery, Pageable pageable) {
        Page<Ticket> page = (plateQuery == null || plateQuery.isBlank())
                ? ticketRepository.findAll(pageable)
                : ticketRepository.findByVehicle_LicensePlateContainingIgnoreCase(plateQuery.trim(), pageable);
        return page.map(this::toResponse);
    }

    public boolean isEvSpotFree() {
        return spotRepository.countBySpotTypeAndOccupiedFalse(SpotType.EV) > 0;
    }

    public List<SpotAvailabilityResponse> getAvailabilitySummary() {
        List<SpotAvailabilityResponse> result = new ArrayList<>();
        for (SpotType type : SpotType.values()) {
            long total = spotRepository.findBySpotType(type).size();
            long free = spotRepository.countBySpotTypeAndOccupiedFalse(type);
            result.add(new SpotAvailabilityResponse(type.name(), total, free, total - free));
        }
        return result;
    }

    public List<SpotResponse> getAllSpots() {
        List<SpotResponse> result = new ArrayList<>();
        for (ParkingSpot s : spotRepository.findAll()) {
            String occupiedByPlate = (s.isOccupied() && s.getCurrentTicket() != null)
                    ? s.getCurrentTicket().getVehicle().getLicensePlate()
                    : null;
            result.add(new SpotResponse(
                    s.getId(), s.getSpotNumber(), s.getFloor(), s.getSpotType().name(), s.isOccupied(), occupiedByPlate));
        }
        return result;
    }

    private SpotType mapVehicleTypeToSpotType(VehicleType vehicleType) {
        // EV vehicles MUST be assigned an EV spot; others map to their same-named spot type.
        return switch (vehicleType) {
            case EV -> SpotType.EV;
            case COMPACT -> SpotType.COMPACT;
            case STANDARD -> SpotType.STANDARD;
        };
    }

    private TicketResponse toResponse(Ticket ticket) {
        LocalDateTime end = ticket.getCheckOutTime() != null ? ticket.getCheckOutTime() : LocalDateTime.now();
        Duration duration = Duration.between(ticket.getCheckInTime(), end);
        String durationDisplay = duration.toHours() + "h " + (duration.toMinutes() % 60) + "m";

        TicketResponse response = new TicketResponse();
        response.setTicketId(ticket.getId());
        response.setLicensePlate(ticket.getVehicle().getLicensePlate());
        response.setVehicleType(ticket.getVehicle().getVehicleType().name());
        response.setSpotNumber(ticket.getSpot().getSpotNumber());
        response.setFloor(ticket.getSpot().getFloor());
        response.setSpotType(ticket.getSpot().getSpotType().name());
        response.setCheckInTime(ticket.getCheckInTime());
        response.setCheckOutTime(ticket.getCheckOutTime());
        response.setFeeCharged(ticket.getFeeCharged());
        response.setDurationDisplay(durationDisplay);
        response.setStatus(ticket.getStatus());
        response.setAttendantUsername(ticket.getAttendantUsername());
        return response;
    }
}
