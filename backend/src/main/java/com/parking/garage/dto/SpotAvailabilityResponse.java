package com.parking.garage.dto;

public class SpotAvailabilityResponse {
    private String spotType;
    private long totalSpots;
    private long freeSpots;
    private long occupiedSpots;

    public SpotAvailabilityResponse() {}

    public SpotAvailabilityResponse(String spotType, long totalSpots, long freeSpots, long occupiedSpots) {
        this.spotType = spotType;
        this.totalSpots = totalSpots;
        this.freeSpots = freeSpots;
        this.occupiedSpots = occupiedSpots;
    }

    public String getSpotType() { return spotType; }
    public void setSpotType(String spotType) { this.spotType = spotType; }

    public long getTotalSpots() { return totalSpots; }
    public void setTotalSpots(long totalSpots) { this.totalSpots = totalSpots; }

    public long getFreeSpots() { return freeSpots; }
    public void setFreeSpots(long freeSpots) { this.freeSpots = freeSpots; }

    public long getOccupiedSpots() { return occupiedSpots; }
    public void setOccupiedSpots(long occupiedSpots) { this.occupiedSpots = occupiedSpots; }
}
