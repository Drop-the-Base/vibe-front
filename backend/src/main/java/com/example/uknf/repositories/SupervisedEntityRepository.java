package com.example.uknf.repositories;

import com.example.uknf.entities.SupervisedEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupervisedEntityRepository extends JpaRepository<SupervisedEntity, Integer> { }