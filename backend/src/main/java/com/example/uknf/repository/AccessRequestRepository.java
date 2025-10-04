package com.example.uknf.repository;

import com.example.uknf.domain.AccessRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessRequestRepository extends JpaRepository<AccessRequest, Long> {
}
