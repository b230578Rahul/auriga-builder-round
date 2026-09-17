package com.parking.garage.dto;

public class SpotResponse {
    private Long id;
    private String spotNumber;
    private Integer floor;
    private String spotType;
    private boolean occupied;
    private String occupiedByPlate;

    public SpotResponse() {}

    public SpotResponse(Long id, String spotNumber, Integer floor, String spotType, boolean occupied, String occupiedByPlate) {
        this.id = id;
        this.spotNumber = spotNumber;
        this.floor = floor;
        this.spotType = spotType;
        this.occupied = occupied;
        this.occupiedByPlate = occupiedByPlate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSpotNumber() { return spotNumber; }
    public void setSpotNumber(String spotNumber) { this.spotNumber = spotNumber; }

    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }

    public String getSpotType() { return spotType; }
    public void setSpotType(String spotType) { this.spotType = spotType; }

    public boolean isOccupied() { return occupied; }
    public void setOccupied(boolean occupied) { this.occupied = occupied; }

    public String getOccupiedByPlate() { return occupiedByPlate; }
    public void setOccupiedByPlate(String occupiedByPlate) { this.occupiedByPlate = occupiedByPlate; }
}
