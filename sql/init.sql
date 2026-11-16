CREATE DATABASE IF NOT EXISTS simple_task CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE simple_task;

-- ログインユーザーテーブル
CREATE TABLE IF NOT EXISTS login (
    user_id VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- タスクテーブル
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'TODO',
    due_date DATE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES login(user_id) ON DELETE CASCADE
);

-- テスト用初期ユーザー（ID: user01 / パスワード: password123）
INSERT INTO login (user_id, password) VALUES ('user01', 'password123');

-- サンプルタスクデータ
INSERT INTO tasks (user_id, title, description, status, due_date) VALUES
('user01', '設計書の確認', '画面設計とAPI設計の最終チェックを行う', 'DONE', '2026-11-15'),
('user01', 'バックエンドAPIの実装', 'Spring Bootでログインとタスク管理のAPIを作成する', 'DOING', '2026-11-20'),
('user01', 'フロントエンド画面の作成', 'Reactで一覧・登録・編集画面を作成する', 'TODO', '2026-11-25');
