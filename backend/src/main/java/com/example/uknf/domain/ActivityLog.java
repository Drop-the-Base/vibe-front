package com.example.uknf.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "activity_logs")
public class ActivityLog extends BaseEntity {

    @Column(name = "activity_type", length = 100)
    private String type;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "actor", length = 200)
    private String actor;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }
}
