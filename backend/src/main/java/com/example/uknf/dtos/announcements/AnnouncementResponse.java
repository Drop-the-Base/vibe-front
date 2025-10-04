package com.example.uknf.dtos.announcements;

import com.example.uknf.entities.Announcement;

import java.util.List;

public record AnnouncementResponse(
        Long id,
        String title,
        String content,
        String priority,
        String targetType,
        boolean requiresAcknowledgement,
        String publishedAt,
        String expiresAt,
        Integer totalRecipients,
        List<String> targetGroups,
        List<AnnouncementReaderResponse> readers
) {
    public static AnnouncementResponse from(Announcement announcement) {
        return new AnnouncementResponse(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getContent(),
                announcement.getPriority() != null ? announcement.getPriority().toDisplay() : null,
                announcement.getTargetType() != null ? announcement.getTargetType().toDisplay() : null,
                announcement.isRequiresAcknowledgement(),
                announcement.getPublishedAt() != null ? announcement.getPublishedAt().toString() : null,
                announcement.getExpiresAt() != null ? announcement.getExpiresAt().toString() : null,
                announcement.getTotalRecipients(),
                List.copyOf(announcement.getTargetGroups()),
                announcement.getReaders().stream().map(AnnouncementReaderResponse::from).toList()
        );
    }
}
