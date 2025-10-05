package com.example.uknf.service;

import com.example.uknf.dto.CreateRoleRequest;
import com.example.uknf.dto.RoleDto;
import com.example.uknf.dto.UpdateRoleRequest;
import com.example.uknf.model.RoleDefinition;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class RoleService {
    private final InMemoryDatabase db;
    private final IdService idService;

    public RoleService(InMemoryDatabase db, IdService idService) {
        this.db = db;
        this.idService = idService;
    }

    public List<RoleDto> findAll() {
        return db.roles().values().stream().map(this::toDto).toList();
    }

    public Optional<RoleDto> findById(String id) {
        return Optional.ofNullable(db.roles().get(id)).map(this::toDto);
    }

    public RoleDto create(CreateRoleRequest request) {
        RoleDefinition role = new RoleDefinition();
        role.setId(idService.nextId("ROL"));
        role.setName(request.name());
        role.setDescription(request.description());
        role.setPermissions(request.permissions() != null ? Set.copyOf(request.permissions()) : Set.of());
        role.setSystemRole(request.systemRole());
        role.setCreatedAt(Instant.now());
        role.setUpdatedAt(Instant.now());
        db.roles().put(role.getId(), role);
        return toDto(role);
    }

    public Optional<RoleDto> update(String id, UpdateRoleRequest request) {
        RoleDefinition role = db.roles().get(id);
        if (role == null) {
            return Optional.empty();
        }
        if (request.name() != null) role.setName(request.name());
        if (request.description() != null) role.setDescription(request.description());
        if (request.permissions() != null) role.setPermissions(Set.copyOf(request.permissions()));
        if (request.systemRole() != null) role.setSystemRole(request.systemRole());
        role.setUpdatedAt(Instant.now());
        return Optional.of(toDto(role));
    }

    public boolean delete(String id) {
        return db.roles().remove(id) != null;
    }

    private RoleDto toDto(RoleDefinition role) {
        return new RoleDto(
                role.getId(),
                role.getName(),
                role.getDescription(),
                Set.copyOf(role.getPermissions()),
                role.isSystemRole(),
                role.getCreatedAt(),
                role.getUpdatedAt()
        );
    }
}
