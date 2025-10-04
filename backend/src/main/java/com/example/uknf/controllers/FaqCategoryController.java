package com.example.uknf.controllers;

import com.example.uknf.entities.FaqCategory;
import com.example.uknf.services.FaqCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/faq-categories")
public class FaqCategoryController {

    @Autowired
    private FaqCategoryService faqCategoryService;

    @GetMapping
    public List<FaqCategory> getAllFaqCategories() {
        return faqCategoryService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FaqCategory> getFaqCategoryById(@PathVariable Integer id) {
        return faqCategoryService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public FaqCategory createFaqCategory(@RequestBody FaqCategory faqCategory) {
        return faqCategoryService.save(faqCategory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FaqCategory> updateFaqCategory(@PathVariable Integer id, @RequestBody FaqCategory faqCategory) {
        try {
            return ResponseEntity.ok(faqCategoryService.update(id, faqCategory));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFaqCategory(@PathVariable Integer id) {
        faqCategoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
