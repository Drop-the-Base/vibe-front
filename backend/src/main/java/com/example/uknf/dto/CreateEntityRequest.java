package com.example.uknf.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateEntityRequest(
        @NotBlank String type,
        @NotBlank String code,
        @NotBlank String name,
        String lei,
        String nip,
        String krs,
        String street,
        String buildingNumber,
        String apartmentNumber,
        String postalCode,
        String city,
        String phone,
        @Email String email,
        String registryNumber,
        String status,
        String category,
        String sector,
        String subsector,
        boolean crossBorder
) {
}
