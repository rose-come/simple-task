import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const statusLabel = (status) => {
    if (status === "DOING") return "進行中";
    if (status === "DONE") return "完了";
    return "未着手";
  };

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
        setTask(data);
      } catch {
        setError("タスク情報の取得に失敗しました");
      }
    };
    fetchTask();
  }, [id, navigate]);

  return (
    <div className="container">
      <div className="card">
        <div className="header-bar">
          <h1 className="page-title">タスク詳細</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        {task && (
          <div className="detail-list">
            <div className="detail-row">
              <div className="detail-term">タスクID</div>
              <div className="detail-desc">{task.id}</div>
            </div>
            <div className="detail-row">
              <div className="detail-term">タイトル</div>
              <div className="detail-desc">{task.title}</div>
            </div>
            <div className="detail-row">
              <div className="detail-term">ステータス</div>
              <div className="detail-desc">
                <span className={`status-badge status-${task.status}`}>
                  {statusLabel(task.status)}
                </span>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-term">期限日</div>
              <div className="detail-desc">{task.due_date || "未設定"}</div>
            </div>
            <div className="detail-row">
              <div className="detail-term">詳細メモ</div>
              <div className="detail-desc">{task.description || "（なし）"}</div>
            </div>
          </div>
        )}

        <div className="btn-group">
          <Link to="/tasks" className="btn btn-secondary">
            一覧へ戻る
          </Link>
          {task && (
            <Link to={`/tasks/${task.id}/edit`} className="btn btn-primary">
              編集画面へ
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetailPage;
