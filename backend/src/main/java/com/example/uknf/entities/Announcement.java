package com.example.uknf.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "announcements")
@Getter
@Setter
@NoArgsConstructor
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "announcement_id")
    private Long id;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "nvarchar(max)")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 20)
    private AnnouncementPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false, length = 20)
    private AnnouncementTargetType targetType;

    @Column(name = "requires_acknowledgement", nullable = false)
    private boolean requiresAcknowledgement;

    @Column(name = "published_at", nullable = false, columnDefinition = "datetime2")
    private OffsetDateTime publishedAt;

    @Column(name = "expires_at", columnDefinition = "datetime2")
    private OffsetDateTime expiresAt;

    @Column(name = "total_recipients")
    private Integer totalRecipients;

    @ElementCollection
    @CollectionTable(name = "announcement_target_groups", joinColumns = @JoinColumn(name = "announcement_id"))
    @Column(name = "group_name", length = 200)
    private List<String> targetGroups = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "announcement_readers", joinColumns = @JoinColumn(name = "announcement_id"))
    private List<AnnouncementReader> readers = new ArrayList<>();

    @PrePersist
    void onCreate() {
        if (publishedAt == null) {
            publishedAt = OffsetDateTime.now();
        }
        if (priority == null) {
            priority = AnnouncementPriority.MEDIUM;
        }
        if (targetType == null) {
            targetType = AnnouncementTargetType.ALL;
        }
    }
}
