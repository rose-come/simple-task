import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function TopPage() {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/me", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserId(data.user_id);
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header-bar">
          <h1 className="page-title">SimpleTask</h1>
          <span style={{ fontSize: "14px", color: "#64748b" }}>
            ログイン中：{userId}
          </span>
        </div>

        <p style={{ marginBottom: "28px", color: "#475569" }}>
          日々のタスクをシンプルに管理できるWebアプリです。実行したい操作を選択してください。
        </p>

        <div style={{ display: "flex", gap: "20px", justifyContent: "center", margin: "32px 0" }}>
          <Link to="/tasks" className="btn btn-primary" style={{ padding: "18px 32px", fontSize: "16px" }}>
            タスク一覧画面へ
          </Link>
          <Link to="/tasks/new" className="btn btn-success" style={{ padding: "18px 32px", fontSize: "16px" }}>
            タスク登録画面へ
          </Link>
        </div>

        <div style={{ marginTop: "40px", borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            ログアウト
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopPage;
