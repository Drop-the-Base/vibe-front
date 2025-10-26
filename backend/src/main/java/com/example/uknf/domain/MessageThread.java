package com.example.uknf.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "message_threads")
public class MessageThread extends BaseEntity {

    @Column(name = "thread_key", nullable = false, unique = true, length = 100)
    private String threadKey;

    @Column(name = "subject", length = 400)
    private String subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id")
    private SupervisedEntity entity;

    public String getThreadKey() {
        return threadKey;
    }

    public void setThreadKey(String threadKey) {
        this.threadKey = threadKey;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public SupervisedEntity getEntity() {
        return entity;
    }

    public void setEntity(SupervisedEntity entity) {
        this.entity = entity;
    }
}
