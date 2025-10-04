package com.example.uknf.services;

import com.example.uknf.dtos.supervisedEntities.SupervisedEntityCreateRequest;
import com.example.uknf.entities.SupervisedEntity;
import com.example.uknf.repositories.SupervisedEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SupervisedEntityService {

    private final SupervisedEntityRepository repository;

    public List<SupervisedEntity> getAll() {
        return repository.findAll();
    }

    @Transactional
    public void create(SupervisedEntityCreateRequest r) {
        SupervisedEntity e = new SupervisedEntity();
        e.setUknfCode(r.getUknfCode());
        e.setName(r.getName());
        e.setNip(r.getNip());
        e.setKrs(r.getKrs());
        e.setLei(r.getLei());
        e.setStreet(r.getStreet());
        e.setBuildingNumber(r.getBuildingNumber());
        e.setApartmentNumber(r.getApartmentNumber());
        e.setPostalCode(r.getPostalCode());
        e.setCity(r.getCity());
        e.setPhone(r.getPhone());
        e.setEmail(r.getEmail());
        e.setRegistryNumber(r.getRegistryNumber());
        e.setStatus(Optional.ofNullable(r.getStatus()).filter(s -> !s.isBlank()).orElse("active"));
        e.setCategory(r.getCategory());
        e.setCrossBorder(Optional.ofNullable(r.getCrossBorder()).orElse(Boolean.FALSE));
        e.setType(r.getType());

        try {
            e = repository.saveAndFlush(e);
        } catch (DataIntegrityViolationException ex) {
            throw ex;
        }

    }

    @Transactional
    public void update(Integer id, SupervisedEntityCreateRequest r) {
        SupervisedEntity e = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Entity with id " + id + " not found"));

        e.setUknfCode(r.getUknfCode());
        e.setName(r.getName());
        e.setNip(r.getNip());
        e.setKrs(r.getKrs());
        e.setLei(r.getLei());
        e.setStreet(r.getStreet());
        e.setBuildingNumber(r.getBuildingNumber());
        e.setApartmentNumber(r.getApartmentNumber());
        e.setPostalCode(r.getPostalCode());
        e.setCity(r.getCity());
        e.setPhone(r.getPhone());
        e.setEmail(r.getEmail());
        e.setRegistryNumber(r.getRegistryNumber());
        e.setStatus(Optional.ofNullable(r.getStatus()).filter(s -> !s.isBlank()).orElse("active"));
        e.setCategory(r.getCategory());
        e.setCrossBorder(Optional.ofNullable(r.getCrossBorder()).orElse(Boolean.FALSE));
        e.setType(r.getType());

        repository.save(e);
    }

    @Transactional
    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Entity with id " + id + " not found");
        }
        repository.deleteById(id);
    }
}
