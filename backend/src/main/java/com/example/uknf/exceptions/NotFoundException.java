package com.example.uknf.exceptions;

public class NotFoundException extends RuntimeException {
    public NotFoundException(Integer id) {
        super("Entity not found: id=" + id);
    }
}