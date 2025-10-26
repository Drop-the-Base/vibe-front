package com.example.uknf.web;

import com.example.uknf.repository.SupervisedEntityRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/entities")
public class EntityController {

    private final SupervisedEntityRepository entityRepository;

    public EntityController(SupervisedEntityRepository entityRepository) {
        this.entityRepository = entityRepository;
    }

    public record EntityDto(
        Long id,
        String name,
        String nip,
        String type,
        String status,
        String contactPerson,
        String email,
        String phone,
        String uknfCode,
        String city,
        String postalCode
    ) {
    }

    @GetMapping
    public List<EntityDto> findAll() {
        return entityRepository.findAll().stream()
            .map(entity -> new EntityDto(
                entity.getId(),
                entity.getName(),
                entity.getNip(),
                entity.getType(),
                entity.getStatus(),
                entity.getContactPerson(),
                entity.getEmail(),
                entity.getPhone(),
                entity.getUknfCode(),
                entity.getCity(),
                entity.getPostalCode()
            ))
            .toList();
    }
}
