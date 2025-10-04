package com.example.uknf.entities;

import com.example.uknf.entities.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.Set;

@Entity
@Table(name = "faq_questions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class FaqQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Integer id;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "nvarchar(max)")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private FaqCategory category;

    // status przechowywany jako NVARCHAR (DB ma CHECK: new/in_review/answered/archived)
    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "created_at", columnDefinition = "datetime2", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "datetime2")
    private OffsetDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy; // może być null (pytanie anonimowe)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @Column(name = "is_anonymous", nullable = false)
    private Boolean anonymous = Boolean.FALSE;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount = 0;

    @Column(name = "answer_count", nullable = false)
    private Integer answerCount = 0;

    @Column(name = "deleted_at", columnDefinition = "datetime2")
    private OffsetDateTime deletedAt;

    /* Tagowanie pytań */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "faq_question_tags",
            joinColumns = @JoinColumn(name = "question_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<FaqTag> tags;

    /* Odpowiedzi do pytania – ukryte w JSON, zwykle pobierane osobno */
    @OneToMany(mappedBy = "question", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<FaqAnswer> answers;
}
