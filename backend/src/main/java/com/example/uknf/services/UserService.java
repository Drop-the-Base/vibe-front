package com.example.uknf.services;

import com.example.uknf.entities.TestEntity;
import com.example.uknf.exceptions.NotFoundException;
import com.example.uknf.repositories.TestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {
    private final TestRepository repo;

    public UserService(TestRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<TestEntity> findAll() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public TestEntity findById(Integer id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException(id));
    }

    public TestEntity create(String name) {
        var e = new TestEntity(name);
        return repo.save(e);
    }

    public TestEntity update(Integer id, String name) {
        var e = findById(id);
        e.setName(name);
        return repo.save(e);
    }

    public void delete(Integer id) {
        if (!repo.existsById(id)) throw new NotFoundException(id);
        repo.deleteById(id);
    }
}