package com.example.uknf.controllers;

import com.example.uknf.dtos.announcements.AnnouncementAcknowledgeRequest;
import com.example.uknf.dtos.announcements.AnnouncementCreateRequest;
import com.example.uknf.dtos.announcements.AnnouncementResponse;
import com.example.uknf.dtos.announcements.AnnouncementUpdateRequest;
import com.example.uknf.services.AnnouncementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/announcements")
public class AnnouncementController {

    private final AnnouncementService service;

    public AnnouncementController(AnnouncementService service) {
        this.service = service;
    }

    @GetMapping
    public List<AnnouncementResponse> list() {
        return service.findAll().stream().map(AnnouncementResponse::from).toList();
    }

    @GetMapping("/{id}")
    public AnnouncementResponse get(@PathVariable Long id) {
        return AnnouncementResponse.from(service.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AnnouncementResponse create(@RequestBody @Valid AnnouncementCreateRequest request) {
        return AnnouncementResponse.from(service.create(request));
    }

    @PatchMapping("/{id}")
    public AnnouncementResponse update(@PathVariable Long id, @RequestBody @Valid AnnouncementUpdateRequest request) {
        return AnnouncementResponse.from(service.update(id, request));
    }

    @PostMapping("/{id}/acknowledgements")
    public AnnouncementResponse acknowledge(@PathVariable Long id, @RequestBody @Valid AnnouncementAcknowledgeRequest request) {
        return AnnouncementResponse.from(service.acknowledge(id, request));
    }
}
