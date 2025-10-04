package com.example.uknf.service;

import com.example.uknf.dto.*;
import com.example.uknf.model.FaqEntry;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

@Service
public class FaqService {
    private final InMemoryDatabase db;
    private final IdService idService;

    public FaqService(InMemoryDatabase db, IdService idService) {
        this.db = db;
        this.idService = idService;
    }

    public List<FaqDto> findAll(String query, String category, String tag) {
        Stream<FaqEntry> stream = db.faqs().values().stream();
        if (query != null && !query.isBlank()) {
            String lower = query.toLowerCase();
            stream = stream.filter(entry ->
                    entry.getQuestion().toLowerCase().contains(lower) ||
                            (entry.getAnswer() != null && entry.getAnswer().toLowerCase().contains(lower)));
        }
        if (category != null && !category.isBlank()) {
            stream = stream.filter(entry -> category.equalsIgnoreCase(entry.getCategory()));
        }
        if (tag != null && !tag.isBlank()) {
            stream = stream.filter(entry -> entry.getTags().stream().anyMatch(t -> t.equalsIgnoreCase(tag)));
        }
        return stream.map(this::toDto).toList();
    }

    public Optional<FaqDto> findById(String id) {
        return Optional.ofNullable(db.faqs().get(id)).map(this::toDto);
    }

    public FaqDto createQuestion(CreateFaqQuestionRequest request) {
        FaqEntry entry = new FaqEntry();
        entry.setId(idService.nextId("FAQ"));
        entry.setQuestion(request.question());
        entry.setAskedBy(request.askedBy());
        entry.setCategory(request.category());
        entry.setTags(request.tags() != null ? Set.copyOf(request.tags()) : Set.of());
        entry.setAskedAt(Instant.now());
        entry.setPublished(false);
        db.faqs().put(entry.getId(), entry);
        return toDto(entry);
    }

    public Optional<FaqDto> answerQuestion(String id, AnswerFaqRequest request) {
        FaqEntry entry = db.faqs().get(id);
        if (entry == null) {
            return Optional.empty();
        }
        entry.setAnswer(request.answer());
        entry.setAnsweredBy(request.answeredBy());
        entry.setAnsweredAt(Instant.now());
        if (request.published() != null) {
            entry.setPublished(request.published());
        }
        return Optional.of(toDto(entry));
    }

    public Optional<FaqDto> rate(String id, RateFaqRequest request) {
        FaqEntry entry = db.faqs().get(id);
        if (entry == null) {
            return Optional.empty();
        }
        entry.setRatingSum(entry.getRatingSum() + request.rating());
        entry.setRatingCount(entry.getRatingCount() + 1);
        return Optional.of(toDto(entry));
    }

    private FaqDto toDto(FaqEntry entry) {
        return new FaqDto(
                entry.getId(),
                entry.getQuestion(),
                entry.getAnswer(),
                entry.getCategory(),
                Set.copyOf(entry.getTags()),
                entry.getAskedAt(),
                entry.getAnsweredAt(),
                entry.getAskedBy(),
                entry.getAnsweredBy(),
                entry.averageRating(),
                entry.getRatingCount(),
                entry.isPublished()
        );
    }
}
