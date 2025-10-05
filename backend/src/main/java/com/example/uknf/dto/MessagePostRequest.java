package com.example.uknf.dto;

import java.util.List;

public record MessagePostRequest(
        String authorId,
        String authorName,
        String content,
        boolean internal,
        List<String> attachmentIds
) {
}
