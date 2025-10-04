package com.example.uknf.controller;

import com.example.uknf.dto.AccessRequestDto;
import com.example.uknf.dto.UpdateAccessRequestStatusRequest;
import com.example.uknf.service.AccessRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/access-requests")
public class AccessRequestController {
    private final AccessRequestService accessRequestService;

    public AccessRequestController(AccessRequestService accessRequestService) {
        this.accessRequestService = accessRequestService;
    }

    @GetMapping
    public List<AccessRequestDto> listRequests() {
        return accessRequestService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccessRequestDto> getRequest(@PathVariable String id) {
        return accessRequestService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AccessRequestDto> updateStatus(@PathVariable String id, @RequestBody UpdateAccessRequestStatusRequest request) {
        return accessRequestService.updateStatus(id, request).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
