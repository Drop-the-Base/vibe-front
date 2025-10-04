package com.example.uknf.util;

import java.util.concurrent.atomic.AtomicLong;

public class IdGenerator {
    private final AtomicLong counter;
    private final String prefix;

    public IdGenerator(String prefix) {
        this.prefix = prefix;
        this.counter = new AtomicLong(0);
    }

    public synchronized String nextId() {
        return "%s-%06d".formatted(prefix, counter.incrementAndGet());
    }
}
