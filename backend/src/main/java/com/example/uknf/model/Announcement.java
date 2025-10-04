package com.example.uknf.model;

import com.example.uknf.model.enums.AnnouncementPriority;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

public class Announcement extends BaseEntity {
    private String title;
    private String content;
    private AnnouncementPriority priority = AnnouncementPriority.MEDIUM;
    private Instant publishedAt = Instant.now();
    private Instant expiresAt;
    private Set<String> targetGroups = new HashSet<>();
    private Set<String> acknowledgedBy = new HashSet<>();
    private boolean confirmationRequired;

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

    public Instant getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(Instant publishedAt) {
        this.publishedAt = publishedAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Set<String> getTargetGroups() {
        return targetGroups;
    }

    public void setTargetGroups(Set<String> targetGroups) {
        this.targetGroups = targetGroups;
    }

    public Set<String> getAcknowledgedBy() {
        return acknowledgedBy;
    }

    public void setAcknowledgedBy(Set<String> acknowledgedBy) {
        this.acknowledgedBy = acknowledgedBy;
    }

    public boolean isConfirmationRequired() {
        return confirmationRequired;
    }

    public void setConfirmationRequired(boolean confirmationRequired) {
        this.confirmationRequired = confirmationRequired;
    }
}
