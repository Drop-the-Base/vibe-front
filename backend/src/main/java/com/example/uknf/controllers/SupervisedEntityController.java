package com.example.uknf.controllers;

import com.example.uknf.entities.SupervisedEntity;
import com.example.uknf.services.SupervisedEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
