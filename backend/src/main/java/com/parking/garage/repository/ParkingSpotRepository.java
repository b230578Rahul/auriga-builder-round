package com.parking.garage.repository;

import com.parking.garage.entity.ParkingSpot;
import com.parking.garage.enums.SpotType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {

    List<ParkingSpot> findBySpotTypeAndOccupiedFalse(SpotType spotType);

    Optional<ParkingSpot> findFirstBySpotTypeAndOccupiedFalse(SpotType spotType);

    List<ParkingSpot> findBySpotType(SpotType spotType);

    long countBySpotTypeAndOccupiedFalse(SpotType spotType);
}
