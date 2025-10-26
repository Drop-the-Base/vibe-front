package com.example.uknf.domain;

import com.example.uknf.domain.enums.AccessRequestStatus;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "access_requests")
public class AccessRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id")
    private SupervisedEntity entity;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private AccessRequestStatus status = AccessRequestStatus.DRAFT;

    @ElementCollection(fetch = FetchType.EAGER)
    @Column(name = "requested_permission")
    private Set<String> requestedPermissions = new HashSet<>();

    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt;

    @Column(name = "reviewed_by", length = 200)
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private OffsetDateTime reviewedAt;

    public AppUser getUser() {
        return user;
    }

    public void setUser(AppUser user) {
        this.user = user;
    }

    public SupervisedEntity getEntity() {
        return entity;
    }

    public void setEntity(SupervisedEntity entity) {
        this.entity = entity;
    }

    public AccessRequestStatus getStatus() {
        return status;
    }

    public void setStatus(AccessRequestStatus status) {
        this.status = status;
    }

    public Set<String> getRequestedPermissions() {
        return requestedPermissions;
    }

    public void setRequestedPermissions(Set<String> requestedPermissions) {
        this.requestedPermissions = requestedPermissions;
    }

    public OffsetDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(OffsetDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public OffsetDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(OffsetDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
}
