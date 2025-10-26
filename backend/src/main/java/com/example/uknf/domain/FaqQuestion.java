package com.example.uknf.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "faq_questions")
public class FaqQuestion extends BaseEntity {

    @Column(name = "title", nullable = false, length = 400)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "status", length = 100)
    private String status;

    @Column(name = "anonymous")
    private boolean anonymous;

    @Column(name = "view_count")
    private long viewCount;

    @Column(name = "answer_count")
    private long answerCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private FaqCategory category;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isAnonymous() {
        return anonymous;
    }

    public void setAnonymous(boolean anonymous) {
        this.anonymous = anonymous;
    }

    public long getViewCount() {
        return viewCount;
    }

    public void setViewCount(long viewCount) {
        this.viewCount = viewCount;
    }

    public long getAnswerCount() {
        return answerCount;
    }

    public void setAnswerCount(long answerCount) {
        this.answerCount = answerCount;
    }

    public FaqCategory getCategory() {
        return category;
    }

    public void setCategory(FaqCategory category) {
        this.category = category;
    }
}
