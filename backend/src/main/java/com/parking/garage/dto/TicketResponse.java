package com.parking.garage.dto;

import com.parking.garage.enums.TicketStatus;

import java.time.LocalDateTime;

public class TicketResponse {
    private Long ticketId;
    private String licensePlate;
    private String vehicleType;
    private String spotNumber;
    private Integer floor;
    private String spotType;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private Double feeCharged;
    private String durationDisplay;
    private TicketStatus status;
    private String attendantUsername;

    public TicketResponse() {}

    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getSpotNumber() { return spotNumber; }
    public void setSpotNumber(String spotNumber) { this.spotNumber = spotNumber; }

    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }

    public String getSpotType() { return spotType; }
    public void setSpotType(String spotType) { this.spotType = spotType; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }

    public Double getFeeCharged() { return feeCharged; }
    public void setFeeCharged(Double feeCharged) { this.feeCharged = feeCharged; }

    public String getDurationDisplay() { return durationDisplay; }
    public void setDurationDisplay(String durationDisplay) { this.durationDisplay = durationDisplay; }

    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }

    public String getAttendantUsername() { return attendantUsername; }
    public void setAttendantUsername(String attendantUsername) { this.attendantUsername = attendantUsername; }
}
