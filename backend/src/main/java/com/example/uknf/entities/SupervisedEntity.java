package com.example.uknf.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(name = "entities")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class SupervisedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "entity_id")
    private Integer id;

    @Column(name = "uknf_code", length = 50)
    private String uknfCode;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "nip", length = 20, unique = true)
    private String nip;

    @Column(name = "krs", length = 20)
    private String krs;

    @Column(name = "lei", length = 50)
    private String lei;

    @Column(name = "street", length = 150)
    private String street;

    @Column(name = "building_number", length = 20)
    private String buildingNumber;

    @Column(name = "apartment_number", length = 20)
    private String apartmentNumber;

    @Column(name = "postal_code", length = 10)
    private String postalCode;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "registry_number", length = 50)
    private String registryNumber;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "category", length = 150)
    private String category;

    @Column(name = "cross_border")
    private Boolean crossBorder; // BIT → Boolean

    @Column(name = "type", length = 100)
    private String type;

    @Column(name = "created_at", columnDefinition = "datetime2", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    // (opcjonalnie) relacja do reports – ukryta w JSON, aby GET /entities był lekki
    @OneToMany(mappedBy = "entity", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Report> reports;
}
