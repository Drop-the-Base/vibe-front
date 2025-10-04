package com.example.uknf.services;

import com.example.uknf.dtos.cases.CaseCreateRequest;
import com.example.uknf.dtos.cases.CaseStatusUpdateRequest;
import com.example.uknf.dtos.cases.CaseUpdateRequest;
import com.example.uknf.entities.CasePriority;
import com.example.uknf.entities.CaseRecord;
import com.example.uknf.entities.CaseStatus;
import com.example.uknf.entities.SupervisedEntity;
import com.example.uknf.exceptions.NotFoundException;
import com.example.uknf.repositories.CaseRepository;
import com.example.uknf.repositories.SupervisedEntityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CaseService {

    private final CaseRepository caseRepository;
    private final SupervisedEntityRepository entityRepository;

    public CaseService(CaseRepository caseRepository, SupervisedEntityRepository entityRepository) {
        this.caseRepository = caseRepository;
        this.entityRepository = entityRepository;
    }

    @Transactional(readOnly = true)
    public List<CaseRecord> findAll() {
        return caseRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public CaseRecord findById(Long id) {
        return caseRepository.findById(id).orElseThrow(() -> new NotFoundException(id));
    }

    public CaseRecord create(CaseCreateRequest request) {
        SupervisedEntity entity = entityRepository.findById(request.entityId())
                .orElseThrow(() -> new NotFoundException(request.entityId()));

        CaseRecord record = new CaseRecord();
        record.setCaseNumber(generateCaseNumber());
        record.setTitle(request.title());
        record.setCategory(request.category());
        record.setEntity(entity);
        CasePriority priority = resolvePriority(request.priority());
        CaseStatus status = resolveStatus(request.status());

        record.setPriority(priority);
        record.setStatus(status);
        record.setAssignedTo(request.assignedTo());
        record.setDescription(request.description());
        record.setDueAt(request.dueAt());

        return caseRepository.save(record);
    }

    public CaseRecord update(Long id, CaseUpdateRequest request) {
        CaseRecord record = findById(id);

        if (request.title() != null) {
            record.setTitle(request.title());
        }
        if (request.category() != null) {
            record.setCategory(request.category());
        }
        if (request.priority() != null) {
            record.setPriority(resolvePriority(request.priority()));
        }
        if (request.status() != null) {
            record.setStatus(resolveStatus(request.status()));
        }
        if (request.assignedTo() != null) {
            record.setAssignedTo(request.assignedTo());
        }
        if (request.description() != null) {
            record.setDescription(request.description());
        }
        if (request.dueAt() != null || Boolean.TRUE.equals(request.clearDueAt())) {
            record.setDueAt(Boolean.TRUE.equals(request.clearDueAt()) ? null : request.dueAt());
        }

        if (request.entityId() != null) {
            SupervisedEntity entity = entityRepository.findById(request.entityId())
                    .orElseThrow(() -> new NotFoundException(request.entityId()));
            record.setEntity(entity);
        }

        return record;
    }

    public CaseRecord updateStatus(Long id, CaseStatusUpdateRequest request) {
        CaseRecord record = findById(id);
        record.setStatus(resolveStatus(request.status()));
        if (request.description() != null) {
            record.setDescription(request.description());
        }
        if (request.assignedTo() != null) {
            record.setAssignedTo(request.assignedTo());
        }
        return record;
    }

    private String generateCaseNumber() {
        return "CASE-" + OffsetDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private CasePriority resolvePriority(String value) {
        if (value == null || value.isBlank()) {
            return CasePriority.MEDIUM;
        }
        try {
            return CasePriority.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unsupported case priority: " + value);
        }
    }

    private CaseStatus resolveStatus(String value) {
        if (value == null || value.isBlank()) {
            return CaseStatus.NEW;
        }
        try {
            return CaseStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unsupported case status: " + value);
        }
    }
}
