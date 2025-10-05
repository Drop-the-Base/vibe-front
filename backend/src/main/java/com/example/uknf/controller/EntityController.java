package com.example.uknf.controller;

import com.example.uknf.dto.CreateEntityRequest;
import com.example.uknf.dto.EntityHistoryDto;
import com.example.uknf.dto.SupervisedEntityDto;
import com.example.uknf.dto.UpdateEntityRequest;
import com.example.uknf.service.EntityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entities")
public class EntityController {
    private final EntityService entityService;

    public EntityController(EntityService entityService) {
        this.entityService = entityService;
    }

    @GetMapping
    public List<SupervisedEntityDto> listEntities() {
        return entityService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupervisedEntityDto> getEntity(@PathVariable String id) {
        return entityService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SupervisedEntityDto> createEntity(@Valid @RequestBody CreateEntityRequest request) {
        return ResponseEntity.ok(entityService.create(request, "api"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupervisedEntityDto> updateEntity(@PathVariable String id, @RequestBody UpdateEntityRequest request) {
        return entityService.update(id, request, "api").map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/history")
    public List<EntityHistoryDto> history(@PathVariable String id) {
        return entityService.history(id);
    }
}
