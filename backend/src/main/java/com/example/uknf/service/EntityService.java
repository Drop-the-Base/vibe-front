package com.example.uknf.service;

import com.example.uknf.dto.CreateEntityRequest;
import com.example.uknf.dto.EntityHistoryDto;
import com.example.uknf.dto.SupervisedEntityDto;
import com.example.uknf.dto.UpdateEntityRequest;
import com.example.uknf.model.EntityChangeLog;
import com.example.uknf.model.SupervisedEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EntityService {
    private final InMemoryDatabase db;
    private final IdService idService;

    public EntityService(InMemoryDatabase db, IdService idService) {
        this.db = db;
        this.idService = idService;
    }

    public List<SupervisedEntityDto> findAll() {
        return db.entities().values().stream().map(this::toDto).toList();
    }

    public Optional<SupervisedEntityDto> findById(String id) {
        return Optional.ofNullable(db.entities().get(id)).map(this::toDto);
    }

    public SupervisedEntityDto create(CreateEntityRequest request, String actor) {
        SupervisedEntity entity = new SupervisedEntity();
        entity.setId(idService.nextId("ENT"));
        entity.setType(request.type());
        entity.setCode(request.code());
        entity.setName(request.name());
        entity.setLei(request.lei());
        entity.setNip(request.nip());
        entity.setKrs(request.krs());
        entity.setStreet(request.street());
        entity.setBuildingNumber(request.buildingNumber());
        entity.setApartmentNumber(request.apartmentNumber());
        entity.setPostalCode(request.postalCode());
        entity.setCity(request.city());
        entity.setPhone(request.phone());
        entity.setEmail(request.email());
        entity.setRegistryNumber(request.registryNumber());
        entity.setStatus(request.status());
        entity.setCategory(request.category());
        entity.setSector(request.sector());
        entity.setSubsector(request.subsector());
        entity.setCrossBorder(request.crossBorder());
        entity.setCreatedAt(Instant.now());
        entity.setUpdatedAt(Instant.now());
        db.entities().put(entity.getId(), entity);
        recordChange(entity.getId(), actor, Map.of("action", "create", "name", entity.getName()));
        return toDto(entity);
    }

    public Optional<SupervisedEntityDto> update(String id, UpdateEntityRequest request, String actor) {
        SupervisedEntity entity = db.entities().get(id);
        if (entity == null) {
            return Optional.empty();
        }
        Map<String, Object> changes = new LinkedHashMap<>();
        if (request.type() != null) {
            entity.setType(request.type());
            changes.put("type", request.type());
        }
        if (request.name() != null) {
            entity.setName(request.name());
            changes.put("name", request.name());
        }
        if (request.lei() != null) {
            entity.setLei(request.lei());
            changes.put("lei", request.lei());
        }
        if (request.nip() != null) {
            entity.setNip(request.nip());
            changes.put("nip", request.nip());
        }
        if (request.krs() != null) {
            entity.setKrs(request.krs());
            changes.put("krs", request.krs());
        }
        if (request.street() != null) {
            entity.setStreet(request.street());
            changes.put("street", request.street());
        }
        if (request.buildingNumber() != null) {
            entity.setBuildingNumber(request.buildingNumber());
            changes.put("buildingNumber", request.buildingNumber());
        }
        if (request.apartmentNumber() != null) {
            entity.setApartmentNumber(request.apartmentNumber());
            changes.put("apartmentNumber", request.apartmentNumber());
        }
        if (request.postalCode() != null) {
            entity.setPostalCode(request.postalCode());
            changes.put("postalCode", request.postalCode());
        }
        if (request.city() != null) {
            entity.setCity(request.city());
            changes.put("city", request.city());
        }
        if (request.phone() != null) {
            entity.setPhone(request.phone());
            changes.put("phone", request.phone());
        }
        if (request.email() != null) {
            entity.setEmail(request.email());
            changes.put("email", request.email());
        }
        if (request.registryNumber() != null) {
            entity.setRegistryNumber(request.registryNumber());
            changes.put("registryNumber", request.registryNumber());
        }
        if (request.status() != null) {
            entity.setStatus(request.status());
            changes.put("status", request.status());
        }
        if (request.category() != null) {
            entity.setCategory(request.category());
            changes.put("category", request.category());
        }
        if (request.sector() != null) {
            entity.setSector(request.sector());
            changes.put("sector", request.sector());
        }
        if (request.subsector() != null) {
            entity.setSubsector(request.subsector());
            changes.put("subsector", request.subsector());
        }
        if (request.crossBorder() != null) {
            entity.setCrossBorder(request.crossBorder());
            changes.put("crossBorder", request.crossBorder());
        }
        entity.setUpdatedAt(Instant.now());
        if (!changes.isEmpty()) {
            recordChange(id, actor, changes);
        }
        return Optional.of(toDto(entity));
    }

    public boolean delete(String id) {
        return db.entities().remove(id) != null;
    }

    public List<EntityHistoryDto> history(String entityId) {
        return db.historyForEntity(entityId).stream()
                .map(entry -> new EntityHistoryDto(entry.getTimestamp(), entry.getUser(), entry.getChanges()))
                .toList();
    }

    private void recordChange(String entityId, String actor, Map<String, Object> changes) {
        EntityChangeLog log = new EntityChangeLog(Instant.now(), actor, changes);
        db.historyForEntity(entityId).add(log);
    }

    private SupervisedEntityDto toDto(SupervisedEntity entity) {
        return new SupervisedEntityDto(
                entity.getId(),
                entity.getType(),
                entity.getCode(),
                entity.getName(),
                entity.getLei(),
                entity.getNip(),
                entity.getKrs(),
                entity.getStreet(),
                entity.getBuildingNumber(),
                entity.getApartmentNumber(),
                entity.getPostalCode(),
                entity.getCity(),
                entity.getPhone(),
                entity.getEmail(),
                entity.getRegistryNumber(),
                entity.getStatus(),
                entity.getCategory(),
                entity.getSector(),
                entity.getSubsector(),
                entity.isCrossBorder(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
