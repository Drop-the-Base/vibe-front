package com.example.uknf.model;

import java.time.Instant;
import java.util.Map;

public class EntityChangeLog {
    private Instant timestamp;
    private String user;
    private Map<String, Object> changes;

    public EntityChangeLog() {
    }

    public EntityChangeLog(Instant timestamp, String user, Map<String, Object> changes) {
        this.timestamp = timestamp;
        this.user = user;
        this.changes = changes;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public Map<String, Object> getChanges() {
        return changes;
    }

    public void setChanges(Map<String, Object> changes) {
        this.changes = changes;
    }
}
