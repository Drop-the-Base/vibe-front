package com.example.uknf.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "faq_answer_ratings"
        // UWAGA: częściowy indeks unikalny (answer_id, user_id WHERE user_id IS NOT NULL)
        // masz w DB. Tutaj nie dodajemy unique constraint, żeby nie blokować anonimów (user_id = NULL).
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FaqAnswerRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "answer_id", nullable = false)
    private FaqAnswer answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // może być null (anonim)

    @Column(name = "rating", nullable = false)
    private Integer rating; // 1..5 (DB CHECK)

    @Column(name = "comment", length = 500)
    private String comment;

    @Column(name = "created_at", columnDefinition = "datetime2", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}

