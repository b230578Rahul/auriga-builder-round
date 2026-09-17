package com.parking.garage.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Tiered parking fee calculation.
 *
 * Rules:
 *  - First hour (or any part of it)  -> flat baseFee (e.g. $5)
 *  - Every hour after that (or part) -> hourlyRate (e.g. $3/hr)
 *  - Total fee is capped at dailyCap (e.g. $25) PER 24-HOUR PERIOD.
 *    A stay spanning multiple days is billed per-day, each day capped independently,
 *    then summed - so a 3-day stay costs at most 3 x dailyCap.
 *  - Any fractional hour rounds UP to the next full hour (1h 5m => billed as 2h).
 */
@Service
public class FeeCalculationService {

    @Value("${app.parking.base-fee}")
    private double baseFee;

    @Value("${app.parking.hourly-rate}")
    private double hourlyRate;

    @Value("${app.parking.daily-cap}")
    private double dailyCap;

    public double calculateFee(LocalDateTime checkIn, LocalDateTime checkOut) {
        if (checkOut.isBefore(checkIn)) {
            throw new IllegalArgumentException("Check-out time cannot be before check-in time");
        }

        long totalMinutes = Duration.between(checkIn, checkOut).toMinutes();
        if (totalMinutes <= 0) {
            totalMinutes = 1; // minimum billable duration - avoid free parking on instant checkout
        }

        long totalHoursRoundedUp = (totalMinutes + 59) / 60; // part-hour rounds up

        double totalFee = 0.0;
        long remainingHours = totalHoursRoundedUp;

        // Bill in 24-hour chunks, each chunk capped independently at dailyCap
        while (remainingHours > 0) {
            long hoursThisDay = Math.min(remainingHours, 24);
            totalFee += feeForSingleDayBlock(hoursThisDay);
            remainingHours -= hoursThisDay;
        }

        return round2(totalFee);
    }

    /** Fee for up to 24 hours of continuous parking within one billing block. */
    private double feeForSingleDayBlock(long hours) {
        if (hours <= 0) return 0.0;

        double fee;
        if (hours == 1) {
            fee = baseFee;
        } else {
            fee = baseFee + (hours - 1) * hourlyRate;
        }

        return Math.min(fee, dailyCap);
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    // Exposed for the frontend / dry-run displays if needed
    public double getBaseFee() { return baseFee; }
    public double getHourlyRate() { return hourlyRate; }
    public double getDailyCap() { return dailyCap; }
}
