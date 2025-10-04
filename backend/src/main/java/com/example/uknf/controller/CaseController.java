package com.example.uknf.controller;

import com.example.uknf.dto.CaseDto;
import com.example.uknf.dto.CaseNoteRequest;
import com.example.uknf.dto.CreateCaseRequest;
import com.example.uknf.dto.UpdateCaseRequest;
import com.example.uknf.service.CaseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
public class CaseController {
    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    @GetMapping
    public List<CaseDto> listCases() {
        return caseService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CaseDto> getCase(@PathVariable String id) {
        return caseService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CaseDto> createCase(@Valid @RequestBody CreateCaseRequest request) {
        return ResponseEntity.ok(caseService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CaseDto> updateCase(@PathVariable String id, @RequestBody UpdateCaseRequest request) {
        return caseService.update(id, request).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<CaseDto> addNote(@PathVariable String id, @RequestBody CaseNoteRequest request) {
        return caseService.addNote(id, request).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
