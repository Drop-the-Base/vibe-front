package com.example.uknf.service;

import com.example.uknf.dto.CreateReportRequest;
import com.example.uknf.dto.ReportDto;
import com.example.uknf.dto.UpdateReportStatusRequest;
import com.example.uknf.model.ReportRecord;
import com.example.uknf.model.enums.ReportStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {
    private final InMemoryDatabase db;
    private final IdService idService;

    public ReportService(InMemoryDatabase db, IdService idService) {
        this.db = db;
        this.idService = idService;
    }

    public List<ReportDto> findAll() {
        return db.reports().values().stream().map(this::toDto).toList();
    }

    public Optional<ReportDto> findById(String id) {
        return Optional.ofNullable(db.reports().get(id)).map(this::toDto);
    }

    public ReportDto create(CreateReportRequest request) {
        ReportRecord record = new ReportRecord();
        record.setId(idService.nextId("RPT"));
        record.setEntityId(request.entityId());
        record.setEntityName(request.entityName());
        record.setTitle(request.title());
        record.setPeriod(request.period());
        record.setCategory(request.category());
        record.setDueDate(request.dueDate());
        record.setCreatedAt(Instant.now());
        record.setUpdatedAt(Instant.now());
        db.reports().put(record.getId(), record);
        return toDto(record);
    }

    public Optional<ReportDto> updateStatus(String id, UpdateReportStatusRequest request) {
        ReportRecord record = db.reports().get(id);
        if (record == null) {
            return Optional.empty();
        }
        if (request.status() != null) {
            record.setStatus(request.status());
        }
        if (request.submittedAt() != null) {
            record.setSubmittedAt(request.submittedAt());
        }
        if (request.validationReportPath() != null) {
            record.setValidationReportPath(request.validationReportPath());
        }
        if (request.correctionId() != null) {
            record.getCorrections().add(request.correctionId());
        }
        record.setUpdatedAt(Instant.now());
        return Optional.of(toDto(record));
    }

    public Optional<ReportDto> markSubmitted(String id, String validationReportPath) {
        UpdateReportStatusRequest request = new UpdateReportStatusRequest(
                ReportStatus.SUBMITTED,
                Instant.now(),
                validationReportPath,
                null
        );
        return updateStatus(id, request);
    }

    private ReportDto toDto(ReportRecord record) {
        return new ReportDto(
                record.getId(),
                record.getEntityId(),
                record.getEntityName(),
                record.getTitle(),
                record.getPeriod(),
                record.getCategory(),
                record.getStatus(),
                record.getDueDate(),
                record.getSubmittedAt(),
                record.getValidationReportPath(),
                List.copyOf(record.getCorrections()),
                record.getCreatedAt(),
                record.getUpdatedAt()
        );
    }
}
