package com.example.uknf.web;

import com.example.uknf.domain.FaqAnswer;
import com.example.uknf.domain.FaqCategory;
import com.example.uknf.domain.FaqQuestion;
import com.example.uknf.repository.FaqAnswerRepository;
import com.example.uknf.repository.FaqCategoryRepository;
import com.example.uknf.repository.FaqQuestionRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FaqController {

    private final FaqCategoryRepository categoryRepository;
    private final FaqQuestionRepository questionRepository;
    private final FaqAnswerRepository answerRepository;

    public FaqController(FaqCategoryRepository categoryRepository,
                         FaqQuestionRepository questionRepository,
                         FaqAnswerRepository answerRepository) {
        this.categoryRepository = categoryRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
    }

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    public record CreateQuestionRequest(
        @NotBlank String title,
        @NotBlank String content,
        Long categoryId,
        boolean anonymous
    ) {
    }

    @GetMapping("/faq-categories")
    public List<Map<String, Object>> listCategories() {
        return categoryRepository.findAll().stream()
            .map(category -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", category.getId());
                map.put("name", category.getName());
                map.put("description", category.getDescription());
                return map;
            })
            .toList();
    }

    @GetMapping("/faq-questions")
    public Map<String, Object> listQuestions() {
        List<Map<String, Object>> questions = questionRepository.findAll().stream()
            .map(question -> {
                Map<String, Object> resource = new HashMap<>();
                resource.put("id", question.getId());
                resource.put("title", question.getTitle());
                resource.put("content", question.getContent());
                resource.put("status", question.getStatus());
                resource.put("anonymous", question.isAnonymous());
                resource.put("createdAt", question.getCreatedAt() != null ? question.getCreatedAt().format(DATE_FORMAT) : null);
                resource.put("answerCount", question.getAnswerCount());
                resource.put("viewCount", question.getViewCount());
                Map<String, Object> links = new HashMap<>();
                links.put("self", Map.of("href", "/api/faq-questions/" + question.getId()));
                if (question.getCategory() != null) {
                    links.put("category", Map.of("href", "/api/faq-categories/" + question.getCategory().getId()));
                }
                links.put("answers", Map.of("href", "/api/faq-answers?question=" + question.getId()));
                resource.put("_links", links);
                return resource;
            })
            .toList();

        return Map.of(
            "_embedded", Map.of("faq-questions", questions)
        );
    }

    @GetMapping("/faq-answers")
    public Map<String, Object> listAnswers(@RequestParam(name = "question", required = false) Long questionId) {
        List<FaqAnswer> answers = questionId != null
            ? answerRepository.findAll().stream().filter(answer -> answer.getQuestion().getId().equals(questionId)).toList()
            : answerRepository.findAll();

        List<Map<String, Object>> resources = answers.stream()
            .map(answer -> {
                Map<String, Object> resource = new HashMap<>();
                resource.put("id", answer.getId());
                resource.put("content", answer.getContent());
                resource.put("status", answer.getStatus());
                resource.put("createdAt", answer.getCreatedAt() != null ? answer.getCreatedAt().format(DATE_FORMAT) : null);
                resource.put("ratingSum", answer.getRatingSum());
                resource.put("ratingCount", answer.getRatingCount());
                Map<String, Object> links = new HashMap<>();
                links.put("self", Map.of("href", "/api/faq-answers/" + answer.getId()));
                links.put("question", Map.of("href", "/api/faq-questions/" + answer.getQuestion().getId()));
                resource.put("_links", links);
                return resource;
            })
            .toList();

        return Map.of(
            "_embedded", Map.of("faq-answers", resources)
        );
    }

    @PostMapping("/faq-questions")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public Map<String, Object> createQuestion(@Valid @RequestBody CreateQuestionRequest request) {
        FaqQuestion question = new FaqQuestion();
        question.setTitle(request.title());
        question.setContent(request.content());
        question.setStatus("new");
        question.setAnonymous(request.anonymous());
        question.setViewCount(0);
        question.setAnswerCount(0);
        if (request.categoryId() != null) {
            FaqCategory category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono kategorii"));
            question.setCategory(category);
        }
        FaqQuestion saved = questionRepository.save(question);
        return Map.of(
            "id", saved.getId(),
            "title", saved.getTitle(),
            "content", saved.getContent(),
            "status", saved.getStatus()
        );
    }
}
