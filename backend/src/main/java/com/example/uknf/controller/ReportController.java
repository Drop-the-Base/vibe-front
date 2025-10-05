package com.example.uknf.controller;

import com.example.uknf.dto.CreateReportRequest;
import com.example.uknf.dto.ReportDto;
import com.example.uknf.dto.UpdateReportStatusRequest;
import com.example.uknf.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public List<ReportDto> listReports() {
        return reportService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportDto> getReport(@PathVariable String id) {
        return reportService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ReportDto> createReport(@Valid @RequestBody CreateReportRequest request) {
        return ResponseEntity.ok(reportService.create(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ReportDto> updateStatus(@PathVariable String id, @RequestBody UpdateReportStatusRequest request) {
        return reportService.updateStatus(id, request).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
