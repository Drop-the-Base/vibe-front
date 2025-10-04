package com.example.uknf.services;

import com.example.uknf.dtos.announcements.AnnouncementAcknowledgeRequest;
import com.example.uknf.dtos.announcements.AnnouncementCreateRequest;
import com.example.uknf.dtos.announcements.AnnouncementUpdateRequest;
import com.example.uknf.entities.Announcement;
import com.example.uknf.entities.AnnouncementPriority;
import com.example.uknf.entities.AnnouncementReader;
import com.example.uknf.entities.AnnouncementTargetType;
import com.example.uknf.exceptions.NotFoundException;
import com.example.uknf.repositories.AnnouncementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@Transactional
public class AnnouncementService {

    private final AnnouncementRepository repository;

    public AnnouncementService(AnnouncementRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Announcement> findAll() {
        return repository.findAllByOrderByPublishedAtDesc();
    }

    @Transactional(readOnly = true)
    public Announcement findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException(id));
    }

    public Announcement create(AnnouncementCreateRequest request) {
        Announcement announcement = new Announcement();
        announcement.setTitle(request.title());
        announcement.setContent(request.content());
        announcement.setPriority(resolvePriority(request.priority()));
        announcement.setTargetType(resolveTargetType(request.targetType()));
        announcement.setRequiresAcknowledgement(request.requiresAcknowledgement());
        announcement.setExpiresAt(request.expiresAt());
        announcement.setPublishedAt(request.publishedAt() != null ? request.publishedAt() : OffsetDateTime.now());
        announcement.setTotalRecipients(request.totalRecipients());
        if (request.targetGroups() != null) {
            announcement.getTargetGroups().addAll(request.targetGroups());
        }

        return repository.save(announcement);
    }

    public Announcement update(Long id, AnnouncementUpdateRequest request) {
        Announcement announcement = findById(id);
        if (request.title() != null) {
            announcement.setTitle(request.title());
        }
        if (request.content() != null) {
            announcement.setContent(request.content());
        }
        if (request.priority() != null) {
            announcement.setPriority(resolvePriority(request.priority()));
        }
        if (request.targetType() != null) {
            announcement.setTargetType(resolveTargetType(request.targetType()));
        }
        if (request.requiresAcknowledgement() != null) {
            announcement.setRequiresAcknowledgement(request.requiresAcknowledgement());
        }
        if (request.expiresAt() != null || Boolean.TRUE.equals(request.clearExpiry())) {
            announcement.setExpiresAt(Boolean.TRUE.equals(request.clearExpiry()) ? null : request.expiresAt());
        }
        if (request.totalRecipients() != null) {
            announcement.setTotalRecipients(request.totalRecipients());
        }
        if (request.targetGroups() != null) {
            announcement.getTargetGroups().clear();
            announcement.getTargetGroups().addAll(request.targetGroups());
        }
        return announcement;
    }

    public Announcement acknowledge(Long id, AnnouncementAcknowledgeRequest request) {
        Announcement announcement = findById(id);
        boolean alreadyAcknowledged = announcement.getReaders().stream()
                .anyMatch(reader -> reader.matches(request.readerId(), request.readerEntity()));

        if (!alreadyAcknowledged) {
            announcement.getReaders().add(new AnnouncementReader(
                    request.readerId(),
                    request.readerName(),
                    request.readerEntity(),
                    OffsetDateTime.now()
            ));
        }

        return announcement;
    }

    private AnnouncementPriority resolvePriority(String value) {
        if (value == null || value.isBlank()) {
            return AnnouncementPriority.MEDIUM;
        }
        try {
            return AnnouncementPriority.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unsupported announcement priority: " + value);
        }
    }

    private AnnouncementTargetType resolveTargetType(String value) {
        if (value == null || value.isBlank()) {
            return AnnouncementTargetType.ALL;
        }
        try {
            return AnnouncementTargetType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unsupported announcement target type: " + value);
        }
    }
}
