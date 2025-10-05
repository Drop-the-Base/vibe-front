package com.example.uknf.model;

import com.example.uknf.model.enums.CaseStatus;
import com.example.uknf.model.enums.PriorityLevel;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class CaseRecord extends BaseEntity {
    private String entityId;
    private String entityName;
    private String title;
    private String category;
    private CaseStatus status = CaseStatus.DRAFT;
    private PriorityLevel priority = PriorityLevel.MEDIUM;
    private String assignedTo;
    private String createdBy;
    private Instant openedAt = Instant.now();
    private Instant lastUpdatedAt = Instant.now();
    private List<CaseTimelineEntry> timeline = new ArrayList<>();

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public CaseStatus getStatus() {
        return status;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
    }

    public PriorityLevel getPriority() {
        return priority;
    }

    public void setPriority(PriorityLevel priority) {
        this.priority = priority;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getOpenedAt() {
        return openedAt;
    }

    public void setOpenedAt(Instant openedAt) {
        this.openedAt = openedAt;
    }

    public Instant getLastUpdatedAt() {
        return lastUpdatedAt;
    }

    public void setLastUpdatedAt(Instant lastUpdatedAt) {
        this.lastUpdatedAt = lastUpdatedAt;
    }

    public List<CaseTimelineEntry> getTimeline() {
        return timeline;
    }

    public void setTimeline(List<CaseTimelineEntry> timeline) {
        this.timeline = timeline;
    }
}
