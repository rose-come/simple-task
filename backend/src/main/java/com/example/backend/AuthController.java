package com.example.backend;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private LoginUserRepository loginUserRepository;

    // ログインAPI (POST /api/login)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpSession session) {
        String userId = body.get("user_id");
        String password = body.get("password");

        if (userId == null || userId.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "ユーザーIDとパスワードを入力してください"));
        }

        Optional<LoginUser> userOpt = loginUserRepository.findById(userId);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            session.setAttribute("userId", userId);
            Map<String, String> res = new HashMap<>();
            res.put("user_id", userId);
            res.put("message", "ログイン成功");
            return ResponseEntity.ok(res);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "ユーザーIDまたはパスワードが違います"));
    }

    // ログアウトAPI (POST /api/logout)
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "ログアウトしました"));
    }

    // ログイン状態確認API (GET /api/me)
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "ログインしていません"));
        }
        return ResponseEntity.ok(Map.of("user_id", userId));
    }
}
