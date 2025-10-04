package com.example.uknf.dtos.supervisedEntities;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SupervisedEntityCreateRequest {
    @Size(max = 50)
    private String uknfCode;

    @NotBlank
    @Size(max = 200)
    private String name;

    @Size(max = 20)
    private String nip;

    @Size(max = 20)
    private String krs;

    @Size(max = 50)
    private String lei;

    @Size(max = 150)
    private String street;

    @Size(max = 20)
    private String buildingNumber;

    @Size(max = 20)
    private String apartmentNumber;

    @Size(max = 10)
    private String postalCode;

    @Size(max = 100)
    private String city;

    @Size(max = 50)
    private String phone;

    @Email
    @Size(max = 150)
    private String email;

    @Size(max = 50)
    private String registryNumber;

    @Size(max = 50)
    private String status;         // domyślnie ustawimy "active" jeśli null/puste

    @Size(max = 150)
    private String category;

    private Boolean crossBorder;   // domyślnie ustawimy false jeśli null

    @Size(max = 100)
    private String type;
}
