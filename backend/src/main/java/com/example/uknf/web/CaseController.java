package com.example.uknf.web;

import com.example.uknf.domain.CaseRecord;
import com.example.uknf.domain.enums.CasePriority;
import com.example.uknf.domain.enums.CaseStatus;
import com.example.uknf.repository.CaseRecordRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/cases")
public class CaseController {

    private final CaseRecordRepository caseRepository;

    public CaseController(CaseRecordRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    public record CaseDto(
        Long id,
        String caseNumber,
        String title,
        String entityName,
        String status,
        String priority,
        String assignedTo,
        String createdDate,
        String updatedDate,
        String description
    ) {
    }

    private static final DateTimeFormatter DATE_TIME_FORMAT = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    @GetMapping
    public List<CaseDto> listCases() {
        return caseRepository.findAll().stream()
            .map(this::toDto)
            .toList();
    }

    private CaseDto toDto(CaseRecord record) {
        return new CaseDto(
            record.getId(),
            record.getCaseNumber(),
            record.getTitle(),
            record.getEntity().getName(),
            mapStatus(record.getStatus()),
            mapPriority(record.getPriority()),
            record.getAssignedTo(),
            record.getCreatedAt() != null ? record.getCreatedAt().format(DATE_TIME_FORMAT) : null,
            record.getLastUpdated() != null ? record.getLastUpdated().format(DATE_TIME_FORMAT) : null,
            record.getDescription()
        );
    }

    private String mapStatus(CaseStatus status) {
        return switch (status) {
            case DRAFT -> "draft";
            case NEW -> "new";
            case IN_PROGRESS -> "in_progress";
            case NEEDS_COMPLETION -> "pending";
            case CLOSED -> "closed";
            case CANCELLED -> "cancelled";
        };
    }

    private String mapPriority(CasePriority priority) {
        return priority.name().toLowerCase();
    }
}
