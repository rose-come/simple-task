import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId.trim() || !password.trim()) {
      setError("ログインIDとパスワードを入力してください");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user_id: userId,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/top");
      } else {
        setError(data.message || "ログインIDまたはパスワードが正しくありません");
      }
    } catch {
      setError("サーバーとの通信に失敗しました");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "440px", marginTop: "80px" }}>
      <div className="card">
        <h1 className="page-title" style={{ textAlign: "center", marginBottom: "24px" }}>
          SimpleTask ログイン
        </h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ログインID</label>
            <input
              type="text"
              className="form-input"
              maxLength={50}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="ログインIDを入力"
            />
          </div>

          <div className="form-group">
            <label className="form-label">パスワード</label>
            <input
              type="password"
              className="form-input"
              maxLength={50}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }}>
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
