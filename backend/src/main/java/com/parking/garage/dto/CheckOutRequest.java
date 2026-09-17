package com.parking.garage.dto;

import jakarta.validation.constraints.NotBlank;

public class CheckOutRequest {
    @NotBlank
    private String licensePlate;

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
}
