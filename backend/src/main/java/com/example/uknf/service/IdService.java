package com.example.uknf.service;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class IdService {
    private final Map<String, AtomicLong> sequences = new ConcurrentHashMap<>();

    public String nextId(String prefix) {
        AtomicLong counter = sequences.computeIfAbsent(prefix, key -> new AtomicLong(0));
        long value = counter.incrementAndGet();
        return "%s-%06d".formatted(prefix.toUpperCase(), value);
    }
}
