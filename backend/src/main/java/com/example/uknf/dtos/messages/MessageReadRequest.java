package com.example.uknf.dtos.messages;

import jakarta.validation.constraints.NotNull;

public record MessageReadRequest(@NotNull Boolean read) {
}
