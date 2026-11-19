import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function TaskEditPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("TODO");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
          credentials: "include",
        });
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        if (!response.ok) {
          setError("タスク情報の取得に失敗しました");
          return;
        }
        const data = await response.json();
        setTitle(data.title || "");
        setStatus(data.status || "TODO");
        setDueDate(data.due_date || "");
        setDescription(data.description || "");
      } catch {
        setError("タスク情報の取得に失敗しました");
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title,
          status: status,
          due_date: dueDate,
          description: description,
        }),
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (response.ok) {
        navigate(`/tasks/${id}`);
      } else {
        const data = await response.json();
        setError(data.message || "更新に失敗しました");
      }
    } catch {
      setError("サーバーとの通信に失敗しました");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header-bar">
          <h1 className="page-title">タスク編集</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              タイトル<span className="required-badge">必須</span>
            </label>
            <input
              type="text"
              className="form-input"
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスクのタイトルを入力（100文字以内）"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              ステータス<span className="required-badge">必須</span>
            </label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="TODO">未着手</option>
              <option value="DOING">進行中</option>
              <option value="DONE">完了</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">期限日</label>
            <input
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">詳細メモ</label>
            <textarea
              className="form-textarea"
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="タスクの詳細やメモを入力（500文字以内）"
            />
          </div>

          <div className="btn-group">
            <Link to={`/tasks/${id}`} className="btn btn-secondary">
              詳細へ戻る
            </Link>
            <button type="submit" className="btn btn-primary">
              更新する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskEditPage;
