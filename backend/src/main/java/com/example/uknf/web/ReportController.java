package com.example.uknf.web;

import com.example.uknf.domain.Report;
import com.example.uknf.domain.enums.ReportStatus;
import com.example.uknf.repository.ReportRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportRepository reportRepository;

    public ReportController(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public record ReportDto(
        Long id,
        String reportCode,
        String title,
        String entityName,
        String type,
        String status,
        String submittedDate,
        String dueDate,
        String assignedTo,
        List<String> validationErrors,
        String validationSummary
    ) {
    }

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
    private static final DateTimeFormatter LOCAL_DATE_FORMAT = DateTimeFormatter.ISO_DATE;

    @GetMapping
    public List<ReportDto> listReports() {
        return reportRepository.findAll().stream()
            .map(report -> new ReportDto(
                report.getId(),
                report.getReportCode(),
                report.getTitle(),
                report.getEntity().getName(),
                report.getType(),
                mapStatus(report.getStatus()),
                report.getSubmissionDate() != null ? report.getSubmissionDate().format(DATE_FORMAT) : null,
                report.getDueDate() != null ? report.getDueDate().format(LOCAL_DATE_FORMAT) : null,
                report.getAssignedTo(),
                report.getValidationErrors().stream().sorted().toList(),
                report.getValidationSummary()
            ))
            .toList();
    }

    private String mapStatus(ReportStatus status) {
        return switch (status) {
            case DRAFT -> "draft";
            case SUBMITTED -> "submitted";
            case IN_VALIDATION -> "in_validation";
            case VALIDATION_SUCCESS -> "accepted";
            case VALIDATION_ERRORS -> "rejected";
            case TECHNICAL_ERROR -> "technical_error";
            case TIMEOUT -> "timeout";
            case CHALLENGED -> "challenged";
        };
    }
}
