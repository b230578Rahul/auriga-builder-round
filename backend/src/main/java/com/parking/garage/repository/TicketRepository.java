package com.parking.garage.repository;

import com.parking.garage.entity.Ticket;
import com.parking.garage.enums.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Optional<Ticket> findByVehicle_LicensePlateIgnoreCaseAndStatus(String licensePlate, TicketStatus status);

    // Search across plate number (log table search box) - paginated + sortable via Pageable
    Page<Ticket> findByVehicle_LicensePlateContainingIgnoreCase(String plate, Pageable pageable);

    Page<Ticket> findAll(Pageable pageable);
}
