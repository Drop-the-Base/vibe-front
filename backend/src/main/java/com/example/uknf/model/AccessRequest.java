package com.example.uknf.model;

import com.example.uknf.model.enums.AccessRequestStatus;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

public class AccessRequest extends BaseEntity {
    private String userId;
    private String userName;
    private String email;
    private String peselMasked;
    private String phone;
    private Set<String> entityIds = new HashSet<>();
    private Set<String> requestedPermissions = new HashSet<>();
    private AccessRequestStatus status = AccessRequestStatus.DRAFT;
    private Instant submittedAt;
    private Instant decidedAt;
    private String decidedBy;
    private String comment;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPeselMasked() {
        return peselMasked;
    }

    public void setPeselMasked(String peselMasked) {
        this.peselMasked = peselMasked;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Set<String> getEntityIds() {
        return entityIds;
    }

    public void setEntityIds(Set<String> entityIds) {
        this.entityIds = entityIds;
    }

    public Set<String> getRequestedPermissions() {
        return requestedPermissions;
    }

    public void setRequestedPermissions(Set<String> requestedPermissions) {
        this.requestedPermissions = requestedPermissions;
    }

    public AccessRequestStatus getStatus() {
        return status;
    }

    public void setStatus(AccessRequestStatus status) {
        this.status = status;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Instant submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Instant getDecidedAt() {
        return decidedAt;
    }

    public void setDecidedAt(Instant decidedAt) {
        this.decidedAt = decidedAt;
    }

    public String getDecidedBy() {
        return decidedBy;
    }

    public void setDecidedBy(String decidedBy) {
        this.decidedBy = decidedBy;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
