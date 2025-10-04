package com.example.uknf.services;

import com.example.uknf.entities.User;
import com.example.uknf.exceptions.NotFoundException;
import com.example.uknf.repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // Create
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Read all
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Read by ID
    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(id));
    }

    // Update
    public User updateUser(Integer id, User updatedUser) throws com.fasterxml.jackson.databind.JsonMappingException {
        User existingUser = getUserById(id);
        objectMapper.updateValue(existingUser, updatedUser);
        return userRepository.save(existingUser);
    }

    // Delete
    public void deleteUser(Integer id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}