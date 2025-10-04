package com.example.uknf.controllers;

import com.example.uknf.dtos.supervisedEntities.SupervisedEntityCreateRequest;
import com.example.uknf.entities.SupervisedEntity;
import com.example.uknf.services.SupervisedEntityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/entities")
public class SupervisedEntityController {

    private final SupervisedEntityService service;

    @GetMapping(produces = "application/json")
    public ResponseEntity<List<SupervisedEntity>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> create(@Valid @RequestBody SupervisedEntityCreateRequest req) {
        service.create(req);
        return ResponseEntity.ok().build();
    }
}
