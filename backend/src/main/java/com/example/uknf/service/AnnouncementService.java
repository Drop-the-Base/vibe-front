package com.example.uknf.service;

import com.example.uknf.dto.AnnouncementDto;
import com.example.uknf.dto.CreateAnnouncementRequest;
import com.example.uknf.dto.UpdateAnnouncementRequest;
import com.example.uknf.model.Announcement;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AnnouncementService {
    private final InMemoryDatabase db;
    private final IdService idService;

    public AnnouncementService(InMemoryDatabase db, IdService idService) {
        this.db = db;
        this.idService = idService;
    }

    public List<AnnouncementDto> findAll() {
        return db.announcements().values().stream().map(this::toDto).toList();
    }

    public Optional<AnnouncementDto> findById(String id) {
        return Optional.ofNullable(db.announcements().get(id)).map(this::toDto);
    }

    public AnnouncementDto create(CreateAnnouncementRequest request, String authorId) {
        Announcement announcement = new Announcement();
        announcement.setId(idService.nextId("ANN"));
        announcement.setTitle(request.title());
        announcement.setContent(request.content());
        announcement.setPriority(request.priority());
        announcement.setPublishedAt(Instant.now());
        announcement.setExpiresAt(request.expiresAt());
        announcement.setTargetGroups(request.targetGroups() != null ? request.targetGroups() : Set.of());
        announcement.setConfirmationRequired(request.confirmationRequired());
        db.announcements().put(announcement.getId(), announcement);
        acknowledge(announcement.getId(), authorId); // mark creator as acknowledged
        return toDto(announcement);
    }

    public Optional<AnnouncementDto> update(String id, UpdateAnnouncementRequest request) {
        Announcement announcement = db.announcements().get(id);
        if (announcement == null) {
            return Optional.empty();
        }
        if (request.title() != null) announcement.setTitle(request.title());
        if (request.content() != null) announcement.setContent(request.content());
        if (request.priority() != null) announcement.setPriority(request.priority());
        if (request.expiresAt() != null) announcement.setExpiresAt(request.expiresAt());
        if (request.targetGroups() != null) announcement.setTargetGroups(request.targetGroups());
        if (request.confirmationRequired() != null) announcement.setConfirmationRequired(request.confirmationRequired());
        announcement.setUpdatedAt(Instant.now());
        return Optional.of(toDto(announcement));
    }

    public Optional<AnnouncementDto> acknowledge(String id, String userId) {
        Announcement announcement = db.announcements().get(id);
        if (announcement == null) {
            return Optional.empty();
        }
        if (userId != null) {
            announcement.getAcknowledgedBy().add(userId);
        }
        return Optional.of(toDto(announcement));
    }

    private AnnouncementDto toDto(Announcement announcement) {
        return new AnnouncementDto(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getContent(),
                announcement.getPriority(),
                announcement.getPublishedAt(),
                announcement.getExpiresAt(),
                Set.copyOf(announcement.getTargetGroups()),
                Set.copyOf(announcement.getAcknowledgedBy()),
                announcement.isConfirmationRequired()
        );
    }
}
