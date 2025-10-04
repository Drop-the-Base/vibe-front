package com.example.uknf.controllers;

import com.example.uknf.dtos.TestCreateRequest;
import com.example.uknf.dtos.TestResponse;
import com.example.uknf.services.TestService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tests")
public class TestController {

    private final TestService service;

    public TestController(TestService service) {
        this.service = service;
    }

    @GetMapping
    public List<TestResponse> list() {
        return service.findAll().stream().map(TestResponse::from).toList();
    }

    @GetMapping("/{id}")
    public TestResponse get(@PathVariable Integer id) {
        return TestResponse.from(service.findById(id));
    }

    @PostMapping
    public TestResponse create(@RequestBody @Valid TestCreateRequest req) {
        return TestResponse.from(service.create(req.name()));
    }
}

