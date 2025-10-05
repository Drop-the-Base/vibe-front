package com.example.uknf.exceptions;

public class NotFoundException extends RuntimeException {

    public NotFoundException(Integer id) {
        this((Number) id);
    }

    public NotFoundException(Long id) {
        this((Number) id);
    }

    public NotFoundException(Number id) {
        super("Entity not found: id=" + id);
    }

    public NotFoundException(String message) {
        super(message);
    }
}