package com.example.uknf.model;

import com.example.uknf.model.enums.ReportStatus;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class ReportRecord extends BaseEntity {
    private String entityId;
    private String entityName;
    private String title;
    private String period;
    private String category;
    private ReportStatus status = ReportStatus.DRAFT;
    private Instant dueDate;
    private Instant submittedAt;
    private String validationReportPath;
    private List<String> corrections = new ArrayList<>();

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

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public Instant getDueDate() {
        return dueDate;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Instant submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getValidationReportPath() {
        return validationReportPath;
    }

    public void setValidationReportPath(String validationReportPath) {
        this.validationReportPath = validationReportPath;
    }

    public List<String> getCorrections() {
        return corrections;
    }

    public void setCorrections(List<String> corrections) {
        this.corrections = corrections;
    }
}
