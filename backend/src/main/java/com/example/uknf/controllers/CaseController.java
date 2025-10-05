package com.example.uknf.controllers;

import com.example.uknf.dtos.cases.CaseCreateRequest;
import com.example.uknf.dtos.cases.CaseResponse;
import com.example.uknf.dtos.cases.CaseStatusUpdateRequest;
import com.example.uknf.dtos.cases.CaseUpdateRequest;
import com.example.uknf.services.CaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cases")
public class CaseController {

    private final CaseService service;

    public CaseController(CaseService service) {
        this.service = service;
    }

    @GetMapping
    public List<CaseResponse> list() {
        return service.findAll().stream().map(CaseResponse::from).toList();
    }

    @GetMapping("/{id}")
    public CaseResponse get(@PathVariable Long id) {
        return CaseResponse.from(service.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CaseResponse create(@RequestBody @Valid CaseCreateRequest request) {
        return CaseResponse.from(service.create(request));
    }

    @PatchMapping("/{id}")
    public CaseResponse update(@PathVariable Long id, @RequestBody @Valid CaseUpdateRequest request) {
        return CaseResponse.from(service.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public CaseResponse updateStatus(@PathVariable Long id, @RequestBody @Valid CaseStatusUpdateRequest request) {
        return CaseResponse.from(service.updateStatus(id, request));
    }
}
