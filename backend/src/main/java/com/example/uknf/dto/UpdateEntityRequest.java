package com.example.uknf.dto;

public record UpdateEntityRequest(
        String type,
        String name,
        String lei,
        String nip,
        String krs,
        String street,
        String buildingNumber,
        String apartmentNumber,
        String postalCode,
        String city,
        String phone,
        String email,
        String registryNumber,
        String status,
        String category,
        String sector,
        String subsector,
        Boolean crossBorder
) {
}
