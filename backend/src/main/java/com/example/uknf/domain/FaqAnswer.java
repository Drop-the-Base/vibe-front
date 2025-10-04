package com.example.uknf.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "faq_answers")
public class FaqAnswer extends BaseEntity {

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "status", length = 100)
    private String status;

    @Column(name = "rating_sum")
    private long ratingSum;

    @Column(name = "rating_count")
    private long ratingCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private FaqQuestion question;

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

    public long getRatingSum() {
        return ratingSum;
    }

    public void setRatingSum(long ratingSum) {
        this.ratingSum = ratingSum;
    }

    public long getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(long ratingCount) {
        this.ratingCount = ratingCount;
    }

    public FaqQuestion getQuestion() {
        return question;
    }

    public void setQuestion(FaqQuestion question) {
        this.question = question;
    }
}
