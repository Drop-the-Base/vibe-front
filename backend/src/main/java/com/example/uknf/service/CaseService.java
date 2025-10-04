package com.example.uknf.service;

import com.example.uknf.dto.CaseDto;
import com.example.uknf.dto.CaseNoteRequest;
import com.example.uknf.dto.CreateCaseRequest;
import com.example.uknf.dto.UpdateCaseRequest;
import com.example.uknf.model.CaseRecord;
import com.example.uknf.model.CaseTimelineEntry;
import com.example.uknf.model.enums.CaseStatus;
import com.example.uknf.model.enums.PriorityLevel;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class CaseService {
    private final InMemoryDatabase db;
    private final IdService idService;

    public CaseService(InMemoryDatabase db, IdService idService) {
        this.db = db;
        this.idService = idService;
    }

    public List<CaseDto> findAll() {
        return db.cases().values().stream().map(this::toDto).toList();
    }

    public Optional<CaseDto> findById(String id) {
        return Optional.ofNullable(db.cases().get(id)).map(this::toDto);
    }

    public CaseDto create(CreateCaseRequest request) {
        CaseRecord record = new CaseRecord();
        record.setId(idService.nextId("CAS"));
        record.setEntityId(request.entityId());
        record.setEntityName(request.entityName());
        record.setTitle(request.title());
        record.setCategory(request.category());
        record.setPriority(request.priority() != null ? request.priority() : PriorityLevel.MEDIUM);
        record.setStatus(CaseStatus.NEW);
        record.setCreatedAt(Instant.now());
        record.setUpdatedAt(Instant.now());
        record.setOpenedAt(Instant.now());
        record.setCreatedBy(request.createdBy());
        if (request.description() != null && !request.description().isBlank()) {
            record.getTimeline().add(new CaseTimelineEntry(Instant.now(), request.createdBy(), request.description(), "note"));
        }
        db.cases().put(record.getId(), record);
        return toDto(record);
    }

    public Optional<CaseDto> update(String id, UpdateCaseRequest request) {
        CaseRecord record = db.cases().get(id);
        if (record == null) {
            return Optional.empty();
        }
        if (request.title() != null) record.setTitle(request.title());
        if (request.category() != null) record.setCategory(request.category());
        if (request.status() != null) record.setStatus(request.status());
        if (request.priority() != null) record.setPriority(request.priority());
        if (request.assignedTo() != null) record.setAssignedTo(request.assignedTo());
        record.setLastUpdatedAt(Instant.now());
        record.setUpdatedAt(Instant.now());
        return Optional.of(toDto(record));
    }

    public Optional<CaseDto> addNote(String caseId, CaseNoteRequest request) {
        CaseRecord record = db.cases().get(caseId);
        if (record == null) {
            return Optional.empty();
        }
        record.getTimeline().add(new CaseTimelineEntry(Instant.now(), request.author(), request.message(), request.type()));
        record.setLastUpdatedAt(Instant.now());
        record.setUpdatedAt(Instant.now());
        return Optional.of(toDto(record));
    }

    private CaseDto toDto(CaseRecord record) {
        return new CaseDto(
                record.getId(),
                record.getEntityId(),
                record.getEntityName(),
                record.getTitle(),
                record.getCategory(),
                record.getStatus(),
                record.getPriority(),
                record.getAssignedTo(),
                record.getCreatedBy(),
                record.getOpenedAt(),
                record.getLastUpdatedAt(),
                List.copyOf(record.getTimeline())
        );
    }
}
