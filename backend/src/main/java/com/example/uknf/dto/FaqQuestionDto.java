package com.example.uknf.dto;

import lombok.Data;

import java.util.Set;

@Data
public class FaqQuestionDto {
    private String title; // Title of the question
    private String content; // Content of the question
    private Integer categoryId; // ID of the category
    private String status; // Status of the question
    private Boolean anonymous; // Whether the question is anonymous
    private Set<Integer> tags; // IDs of associated tags
}
