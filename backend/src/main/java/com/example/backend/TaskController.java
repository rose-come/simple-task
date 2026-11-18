package com.example.backend;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // タスク一覧取得 (GET /api/tasks)
    @GetMapping
    public ResponseEntity<?> getTasks(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "ログインが必要です"));
        }
        List<Task> tasks = taskRepository.findByUserIdOrderByIdDesc(userId);
        return ResponseEntity.ok(tasks);
    }

    // タスク詳細取得 (GET /api/tasks/{id})
    @GetMapping("/{id}")
    public ResponseEntity<?> getTask(@PathVariable Integer id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "ログインが必要です"));
        }

        Optional<Task> taskOpt = taskRepository.findByIdAndUserId(id, userId);
        if (taskOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "タスクが見つかりません"));
        }
        return ResponseEntity.ok(taskOpt.get());
    }

    // タスク新規登録 (POST /api/tasks)
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Map<String, String> body, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "ログインが必要です"));
        }

        String title = body.get("title");
        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "タイトルは必須です"));
        }

        Task task = new Task();
        task.setUserId(userId);
        task.setTitle(title.trim());
        task.setDescription(body.getOrDefault("description", ""));

        String status = body.get("status");
        task.setStatus((status != null && !status.isEmpty()) ? status : "TODO");

        String dueDateStr = body.get("due_date");
        if (dueDateStr != null && !dueDateStr.isEmpty()) {
            task.setDueDate(LocalDate.parse(dueDateStr));
        }

        Task saved = taskRepository.save(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // タスク更新 (PUT /api/tasks/{id})
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Integer id, @RequestBody Map<String, String> body, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "ログインが必要です"));
        }

        Optional<Task> taskOpt = taskRepository.findByIdAndUserId(id, userId);
        if (taskOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "タスクが見つかりません"));
        }

        String title = body.get("title");
        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "タイトルは必須です"));
        }

        Task task = taskOpt.get();
        task.setTitle(title.trim());
        task.setDescription(body.getOrDefault("description", ""));

        String status = body.get("status");
        if (status != null && !status.isEmpty()) {
            task.setStatus(status);
        }

        String dueDateStr = body.get("due_date");
        if (dueDateStr != null && !dueDateStr.isEmpty()) {
            task.setDueDate(LocalDate.parse(dueDateStr));
        } else {
            task.setDueDate(null);
        }

        Task updated = taskRepository.save(task);
        return ResponseEntity.ok(updated);
    }

    // タスク削除 (DELETE /api/tasks/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Integer id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "ログインが必要です"));
        }

        Optional<Task> taskOpt = taskRepository.findByIdAndUserId(id, userId);
        if (taskOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "タスクが見つかりません"));
        }

        taskRepository.delete(taskOpt.get());
        return ResponseEntity.ok(Map.of("message", "削除しました"));
    }
}
