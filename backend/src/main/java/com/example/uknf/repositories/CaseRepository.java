package com.example.uknf.repositories;

import com.example.uknf.entities.CaseRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CaseRepository extends JpaRepository<CaseRecord, Long> {
    List<CaseRecord> findAllByOrderByCreatedAtDesc();
}
