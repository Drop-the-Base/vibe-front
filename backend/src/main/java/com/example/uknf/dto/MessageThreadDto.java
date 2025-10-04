package com.example.uknf.dto;

import com.example.uknf.model.MessageEntry;
import com.example.uknf.model.enums.MessageStatus;

import java.time.Instant;
import java.util.List;
import java.util.Set;

public record MessageThreadDto(
        String id,
        String subject,
        String entityId,
        String entityName,
        MessageStatus status,
        Set<String> participants,
        Instant lastMessageAt,
        List<MessageEntry> messages
) {
}
