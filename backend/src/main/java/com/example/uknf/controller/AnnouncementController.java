package com.example.uknf.controller;

import com.example.uknf.dto.AnnouncementDto;
import com.example.uknf.dto.CreateAnnouncementRequest;
import com.example.uknf.dto.UpdateAnnouncementRequest;
import com.example.uknf.service.AnnouncementService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {
    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public List<AnnouncementDto> listAnnouncements() {
        return announcementService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDto> getAnnouncement(@PathVariable String id) {
        return announcementService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AnnouncementDto> createAnnouncement(@Valid @RequestBody CreateAnnouncementRequest request) {
        return ResponseEntity.ok(announcementService.create(request, "api"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementDto> updateAnnouncement(@PathVariable String id, @RequestBody UpdateAnnouncementRequest request) {
        return announcementService.update(id, request).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/ack")
    public ResponseEntity<AnnouncementDto> acknowledge(@PathVariable String id, @RequestParam String userId) {
        return announcementService.acknowledge(id, userId).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
