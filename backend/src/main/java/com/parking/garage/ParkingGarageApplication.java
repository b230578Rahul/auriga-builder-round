package com.parking.garage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.parking.garage.entity.ParkingSpot;
import com.parking.garage.enums.SpotType;
import com.parking.garage.repository.ParkingSpotRepository;

@SpringBootApplication
public class ParkingGarageApplication {

    public static void main(String[] args) {
        SpringApplication.run(ParkingGarageApplication.class, args);
    }

    /**
     * Seeds the garage with a fixed set of spots across 3 floors on startup
     * so the frontend has real data to display immediately.
     */
    @Bean
    CommandLineRunner seedSpots(ParkingSpotRepository spotRepository) {
        return args -> {
            if (spotRepository.count() > 0) return;

            int spotCounter = 1;
            for (int floor = 1; floor <= 3; floor++) {
                for (int i = 0; i < 4; i++) {
                    spotRepository.save(newSpot(spotCounter++, floor, SpotType.EV));
                }
                for (int i = 0; i < 6; i++) {
                    spotRepository.save(newSpot(spotCounter++, floor, SpotType.COMPACT));
                }
                for (int i = 0; i < 10; i++) {
                    spotRepository.save(newSpot(spotCounter++, floor, SpotType.STANDARD));
                }
            }
        };
    }

    private ParkingSpot newSpot(int number, int floor, SpotType type) {
        ParkingSpot spot = new ParkingSpot();
        spot.setSpotNumber("F" + floor + "-" + type.name().charAt(0) + number);
        spot.setFloor(floor);
        spot.setSpotType(type);
        spot.setOccupied(false);
        return spot;
    }
}
