package com.example.uknf.dtos;

import com.example.uknf.entites.TestEntity;

public record TestResponse(
        Integer id,
        String name,
        String createdAt // ISO string dla prostoty
) {
    public static TestResponse from(TestEntity e) {
        return new TestResponse(e.getId(), e.getName(),
                e.getCreatedAt() != null ? e.getCreatedAt().toString() : null);
    }
}
