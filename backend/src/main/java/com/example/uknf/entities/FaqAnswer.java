package com.example.uknf.entities;

import com.example.uknf.entities.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Set;

@Entity
@Table(name = "faq_answers")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class FaqAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private FaqQuestion question;

    @Column(name = "content", nullable = false, columnDefinition = "nvarchar(max)")
    private String content;

    // DB CHECK: draft/published/archived
    @Column(name = "status", nullable = false, length = 30)
    private String status;

    // opcjonalnie kategoria odpowiedzi
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private FaqCategory category;

    @Column(name = "created_at", columnDefinition = "datetime2", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "datetime2")
    private OffsetDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @Column(name = "rating_sum", nullable = false)
    private Integer ratingSum = 0;

    @Column(name = "rating_count", nullable = false)
    private Integer ratingCount = 0;

    @Column(name = "rating_avg", insertable = false, updatable = false)
    private BigDecimal ratingAvg; // computed column w DB

    /* Tagowanie odpowiedzi (opcjonalne) */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "faq_answer_tags",
            joinColumns = @JoinColumn(name = "answer_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<FaqTag> tags;

    /* Oceny odpowiedzi – zwykle pobierane osobno */
    @OneToMany(mappedBy = "answer", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<FaqAnswerRating> ratings;
}
