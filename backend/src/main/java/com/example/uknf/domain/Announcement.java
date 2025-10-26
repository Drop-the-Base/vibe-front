package com.example.uknf.domain;

import com.example.uknf.domain.enums.AnnouncementPriority;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "announcements")
public class Announcement extends BaseEntity {

    @Column(name = "title", nullable = false, length = 400)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 16)
    private AnnouncementPriority priority = AnnouncementPriority.MEDIUM;

    @Column(name = "target", length = 100)
    private String target;

    @Column(name = "published_at")
    private OffsetDateTime publishedAt;

    @Column(name = "expires_at")
    private OffsetDateTime expiresAt;

    @Column(name = "requires_ack")
    private boolean requiresAcknowledgement;

    @ElementCollection(fetch = FetchType.EAGER)
    @Column(name = "recipient", length = 200)
    private Set<String> recipients = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @Column(name = "read_by", length = 200)
    private Set<String> readBy = new HashSet<>();

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public AnnouncementPriority getPriority() {
        return priority;
    }

    public void setPriority(AnnouncementPriority priority) {
        this.priority = priority;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public OffsetDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(OffsetDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    public OffsetDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(OffsetDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public boolean isRequiresAcknowledgement() {
        return requiresAcknowledgement;
    }

    public void setRequiresAcknowledgement(boolean requiresAcknowledgement) {
        this.requiresAcknowledgement = requiresAcknowledgement;
    }

    public Set<String> getRecipients() {
        return recipients;
    }

    public void setRecipients(Set<String> recipients) {
        this.recipients = recipients;
    }

    public Set<String> getReadBy() {
        return readBy;
    }

    public void setReadBy(Set<String> readBy) {
        this.readBy = readBy;
    }
}
