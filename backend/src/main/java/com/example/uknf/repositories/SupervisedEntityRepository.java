package com.example.uknf.repositories;

import com.example.uknf.entities.SupervisedEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupervisedEntityRepository extends JpaRepository<SupervisedEntity, Integer> {
}
