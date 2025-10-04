package com.example.uknf.repositories;

import com.example.uknf.entities.SupervisedEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "entities", collectionResourceRel = "entities")
public interface SupervisedEntityRepository extends JpaRepository<SupervisedEntity, Integer> { }