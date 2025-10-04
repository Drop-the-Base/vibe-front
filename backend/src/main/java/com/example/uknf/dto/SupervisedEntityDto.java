package com.example.uknf.dto;

import java.time.Instant;

public record SupervisedEntityDto(
        String id,
        String type,
        String code,
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
        boolean crossBorder,
        Instant createdAt,
        Instant updatedAt
) {
}
