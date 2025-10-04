package com.example.uknf.controllers;

import com.example.uknf.entities.FaqAnswer;
import com.example.uknf.services.FaqAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/faq-answers")
public class FaqAnswerController {

    @Autowired
    private FaqAnswerService faqAnswerService;

    @GetMapping
    public List<FaqAnswer> getAllFaqAnswers() {
        return faqAnswerService.getAllAnswers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FaqAnswer> getFaqAnswerById(@PathVariable Integer id) {
        FaqAnswer answer = faqAnswerService.getAnswerById(id);
        if (answer != null) {
            return ResponseEntity.ok(answer);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public FaqAnswer createFaqAnswer(@RequestBody FaqAnswer faqAnswer) {
        return faqAnswerService.createAnswer(faqAnswer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FaqAnswer> updateFaqAnswer(@PathVariable Integer id, @RequestBody FaqAnswer faqAnswer) {
        if (faqAnswerService.getAnswerById(id) != null) {
            faqAnswer.setId(id);
            return ResponseEntity.ok(faqAnswerService.updateAnswer(faqAnswer));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFaqAnswer(@PathVariable Integer id) {
        if (faqAnswerService.getAnswerById(id) != null) {
            faqAnswerService.deleteAnswer(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
