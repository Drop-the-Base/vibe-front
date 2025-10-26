package com.example.uknf.repository;

import com.example.uknf.domain.SupervisedEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupervisedEntityRepository extends JpaRepository<SupervisedEntity, Long> {
}
