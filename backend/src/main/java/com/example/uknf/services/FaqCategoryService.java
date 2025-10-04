package com.example.uknf.services;

import com.example.uknf.entities.FaqCategory;
import com.example.uknf.repositories.FaqCategoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FaqCategoryService {

    @Autowired
    private FaqCategoryRepository faqCategoryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public List<FaqCategory> findAll() {
        return faqCategoryRepository.findAll();
    }

    public Optional<FaqCategory> findById(Integer id) {
        return faqCategoryRepository.findById(id);
    }

    public FaqCategory save(FaqCategory faqCategory) {
        return faqCategoryRepository.save(faqCategory);
    }

    public FaqCategory update(Integer id, FaqCategory updatedFaqCategory) {
        return faqCategoryRepository.findById(id).map(existingFaqCategory -> {
            try {
                objectMapper.updateValue(existingFaqCategory, updatedFaqCategory);
            } catch (com.fasterxml.jackson.databind.JsonMappingException e) {
                throw new RuntimeException("Failed to update FaqCategory due to mapping error: " + e.getMessage(), e);
            }
            return faqCategoryRepository.save(existingFaqCategory);
        }).orElseThrow(() -> new RuntimeException("FaqCategory not found with id " + id));
    }

    public void deleteById(Integer id) {
        faqCategoryRepository.deleteById(id);
    }
}
