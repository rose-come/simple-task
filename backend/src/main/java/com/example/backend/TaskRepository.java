package com.example.backend;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByUserIdOrderByIdDesc(String userId);
    Optional<Task> findByIdAndUserId(Integer id, String userId);
}
