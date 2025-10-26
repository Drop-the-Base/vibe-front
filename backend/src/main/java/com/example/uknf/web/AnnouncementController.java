package com.example.uknf.web;

import com.example.uknf.domain.Announcement;
import com.example.uknf.domain.enums.AnnouncementPriority;
import com.example.uknf.repository.AnnouncementRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementController(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    public record AnnouncementDto(
        Long id,
        String title,
        String content,
        String priority,
        String target,
        String publishedDate,
        String expiryDate,
        boolean requiresAcknowledgement,
        List<String> recipients,
        List<String> readBy
    ) {
    }

    public record AcknowledgeRequest(@Email @NotBlank String userEmail) {
    }

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    @GetMapping
    public List<AnnouncementDto> listAnnouncements() {
        return announcementRepository.findAll().stream()
            .sorted((a, b) -> b.getPublishedAt().compareTo(a.getPublishedAt()))
            .map(this::toDto)
            .toList();
    }

    @PostMapping("/{id}/acknowledge")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void acknowledge(@PathVariable Long id, @Valid @RequestBody AcknowledgeRequest request) {
        Announcement announcement = announcementRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono komunikatu"));
        announcement.getReadBy().add(request.userEmail().toLowerCase());
    }

    private AnnouncementDto toDto(Announcement announcement) {
        return new AnnouncementDto(
            announcement.getId(),
            announcement.getTitle(),
            announcement.getContent(),
            mapPriority(announcement.getPriority()),
            announcement.getTarget(),
            formatDate(announcement.getPublishedAt()),
            formatDate(announcement.getExpiresAt()),
            announcement.isRequiresAcknowledgement(),
            announcement.getRecipients().stream().sorted().toList(),
            announcement.getReadBy().stream().sorted().toList()
        );
    }

    private String formatDate(OffsetDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATE_FORMAT) : null;
    }

    private String mapPriority(AnnouncementPriority priority) {
        return priority.name().toLowerCase();
    }
}
