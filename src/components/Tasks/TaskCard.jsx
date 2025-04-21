import { FaEdit, FaTrash, FaCheck, FaUndo, FaTag, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTaskContext } from "../../context/TaskContext";

function TaskCard({ task }) {
  const { updateTask, deleteTask, checkTaskDependencies } = useTaskContext();

  const priorityClasses = {
    low: "badge-low",
    medium: "badge-medium",
    high: "badge-high"
  };

  const toggleStatus = () => {
    if (task.status !== "completed" && !checkTaskDependencies(task.id)) {
      alert("You need to complete all dependencies first!");
      return;
    }
    
    updateTask({
      ...task,
      status: task.status === "completed" ? "pending" : "completed"
    });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTask(task.id);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const hasReminder = task.reminder && new Date(task.reminder) > new Date();

  return (
    <Link
      to={`/task/${task.id}`}
      className={`card task-card ${task.status === "completed" ? "task-completed" : ""}`}
    >
      <div className="card-header">
        <span className={`badge ${priorityClasses[task.priority]}`}>
          {task.priority}
        </span>
        <div className="d-flex align-center gap-2">
          {hasReminder && (
            <span className="reminder-indicator" title={`Reminder set for ${new Date(task.reminder).toLocaleString()}`}>
              <FaClock />
            </span>
          )}
          <span className="text-sm text-gray">
            Due: {formatDate(task.dueDate)}
          </span>
        </div>
      </div>

      <h3 className="card-title truncate">{task.title}</h3>
      
      <p className="card-content line-clamp-2">{task.description}</p>
      
      {task.tags && task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag, index) => (
            <span key={index} className="task-tag">
              <FaTag className="tag-icon" />
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {task.pomodoroCount > 0 && (
        <div className="pomodoro-count">
          <span className="pomodoro-icon">🍅</span>
          <span>{task.pomodoroCount}</span>
        </div>
      )}

      <div className="card-footer" onClick={(e) => e.preventDefault()}>
        <button
          className={`btn btn-icon btn-sm ${task.status === "completed" ? "btn-warning" : "btn-success"}`}
          aria-label={task.status === "completed" ? "Mark as pending" : "Mark as completed"}
          onClick={toggleStatus}
        >
          {task.status === "completed" ? <FaUndo /> : <FaCheck />}
        </button>
        
        <Link
          to={`/edit/${task.id}`}
          className="btn btn-icon btn-sm btn-primary"
          aria-label="Edit task"
          onClick={(e) => e.stopPropagation()}
        >
          <FaEdit />
        </Link>
        
        <button
          className="btn btn-icon btn-sm btn-danger"
          aria-label="Delete task"
          onClick={handleDelete}
        >
          <FaTrash />
        </button>
      </div>
    </Link>
  );
}

export default TaskCard;
