import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const statusLabel = (status) => {
    if (status === "DOING") return "進行中";
    if (status === "DONE") return "完了";
    return "未着手";
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/tasks", {
        credentials: "include",
      });
      if (response.status === 401) {
        navigate("/login");
        return;
      }
      if (!response.ok) {
        setError("処理に失敗しました");
        return;
      }
      const data = await response.json();
      setTasks(data);
    } catch {
      setError("処理に失敗しました");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`「${title}」を削除してもよろしいですか？`)) {
      return;
    }
    setError("");
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.status === 401) {
        navigate("/login");
        return;
      }
      if (!response.ok) {
        setError("処理に失敗しました");
        return;
      }
      fetchTasks();
    } catch {
      setError("処理に失敗しました");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header-bar">
          <h1 className="page-title">タスク一覧</h1>
          <Link to="/tasks/new" className="btn btn-primary">
            新規タスク登録
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {tasks.length === 0 ? (
          <p style={{ color: "#64748b", padding: "24px 0", textAlign: "center" }}>
            登録されているタスクはありません。
          </p>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>ID</th>
                <th>タイトル</th>
                <th style={{ width: "110px" }}>ステータス</th>
                <th style={{ width: "120px" }}>期限日</th>
                <th style={{ width: "150px" }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.title}</td>
                  <td>
                    <span className={`status-badge status-${task.status}`}>
                      {statusLabel(task.status)}
                    </span>
                  </td>
                  <td>{task.due_date || "-"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link to={`/tasks/${task.id}`} className="btn btn-primary btn-sm">
                        詳細
                      </Link>
                      <button
                        onClick={() => handleDelete(task.id, task.title)}
                        className="btn btn-danger btn-sm"
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="btn-group">
          <Link to="/top" className="btn btn-secondary">
            トップへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TaskListPage;
