package com.example.uknf.services;

import com.example.uknf.entities.SupervisedEntity;
import com.example.uknf.repositories.SupervisedEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupervisedEntityService {

    private final SupervisedEntityRepository repository;

    public List<SupervisedEntity> getAll() {
        return repository.findAll();
    }
}
