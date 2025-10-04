package com.example.uknf.controllers;

import com.example.uknf.entities.FaqQuestion;
import com.example.uknf.services.FaqQuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/faq-questions")
public class FaqQuestionController {

    private final FaqQuestionService faqQuestionService;

    public FaqQuestionController(FaqQuestionService faqQuestionService) {
        this.faqQuestionService = faqQuestionService;
    }

    @GetMapping
    public ResponseEntity<List<FaqQuestion>> getAllQuestions() {
        return ResponseEntity.ok(faqQuestionService.getAllQuestions());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<FaqQuestion>> getQuestionsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(faqQuestionService.getQuestionsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<FaqQuestion> createQuestion(@RequestBody FaqQuestion question) {
        return ResponseEntity.ok(faqQuestionService.createQuestion(question));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FaqQuestion> updateQuestion(@PathVariable Integer id, @RequestBody FaqQuestion question) {
        question.setId(id);
        return ResponseEntity.ok(faqQuestionService.updateQuestion(question));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Integer id) {
        faqQuestionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
