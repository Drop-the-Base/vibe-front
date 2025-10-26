package com.example.uknf.domain;

import com.example.uknf.domain.enums.ReportStatus;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "reports")
public class Report extends BaseEntity {

    @Column(name = "report_code", nullable = false, unique = true, length = 100)
    private String reportCode;

    @Column(name = "title", nullable = false, length = 400)
    private String title;

    @Column(name = "report_type", length = 150)
    private String type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 32)
    private ReportStatus status = ReportStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private SupervisedEntity entity;

    @Column(name = "submission_date")
    private OffsetDateTime submissionDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "assigned_to", length = 150)
    private String assignedTo;

    @Column(name = "file_name", length = 500)
    private String fileName;

    @Column(name = "file_path", length = 1000)
    private String filePath;

    @Column(name = "validation_report_path", length = 1000)
    private String validationReportPath;

    @Column(name = "validation_summary", length = 2000)
    private String validationSummary;

    @ElementCollection(fetch = FetchType.EAGER)
    @Column(name = "validation_error")
    private Set<String> validationErrors = new HashSet<>();

    public String getReportCode() {
        return reportCode;
    }

    public void setReportCode(String reportCode) {
        this.reportCode = reportCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public SupervisedEntity getEntity() {
        return entity;
    }

    public void setEntity(SupervisedEntity entity) {
        this.entity = entity;
    }

    public OffsetDateTime getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(OffsetDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getValidationReportPath() {
        return validationReportPath;
    }

    public void setValidationReportPath(String validationReportPath) {
        this.validationReportPath = validationReportPath;
    }

    public String getValidationSummary() {
        return validationSummary;
    }

    public void setValidationSummary(String validationSummary) {
        this.validationSummary = validationSummary;
    }

    public Set<String> getValidationErrors() {
        return validationErrors;
    }

    public void setValidationErrors(Set<String> validationErrors) {
        this.validationErrors = validationErrors;
    }
}
