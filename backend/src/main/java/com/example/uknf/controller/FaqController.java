package com.example.uknf.controller;

import com.example.uknf.dto.*;
import com.example.uknf.service.FaqService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faq")
public class FaqController {
    private final FaqService faqService;

    public FaqController(FaqService faqService) {
        this.faqService = faqService;
    }

    @GetMapping
    public List<FaqDto> listFaq(@RequestParam(required = false) String query,
                                @RequestParam(required = false) String category,
                                @RequestParam(required = false) String tag) {
        return faqService.findAll(query, category, tag);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FaqDto> getFaq(@PathVariable String id) {
        return faqService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FaqDto> askQuestion(@Valid @RequestBody CreateFaqQuestionRequest request) {
        return ResponseEntity.ok(faqService.createQuestion(request));
    }

    @PostMapping("/{id}/answer")
    public ResponseEntity<FaqDto> answer(@PathVariable String id, @Valid @RequestBody AnswerFaqRequest request) {
        return faqService.answerQuestion(id, request).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<FaqDto> rate(@PathVariable String id, @Valid @RequestBody RateFaqRequest request) {
        return faqService.rate(id, request).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
