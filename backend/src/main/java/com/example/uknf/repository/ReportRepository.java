package com.example.uknf.repository;

import com.example.uknf.domain.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
    boolean existsByReportCode(String reportCode);
}
