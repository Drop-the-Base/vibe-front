package com.example.uknf.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.uknf.entities.TestEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepository extends JpaRepository<TestEntity, Integer> {
    boolean existsByName(String name);
}
