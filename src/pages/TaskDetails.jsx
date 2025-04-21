import { useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaUndo, FaArrowLeft, FaTag, FaClock, FaLink, FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTaskContext } from "../context/TaskContext";
import TaskTimer from "../components/Tasks/TaskTimer";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, updateTask, deleteTask, checkTaskDependencies } = useTaskContext();
  
  const task = tasks.find(task => task.id === id);
  
  const priorityClasses = {
    low: "badge-low",
    medium: "badge-medium",
    high: "badge-high"
  };
  
  if (!task) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-bold mb-4">Task Not Found</h2>
        <p className="mb-6">The task you're looking for doesn't exist or has been deleted.</p>
        <Link to="/" className="btn btn-primary">
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const options = { 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateString).toLocaleString(undefined, options);
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
    
    alert(`Task marked as ${task.status === "completed" ? "pending" : "completed"}`);
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
      alert("Task deleted");
      navigate("/");
    }
  };
  
  const dependentTasks = tasks.filter(t => 
    t.dependencies && t.dependencies.includes(task.id)
  );

  return (
    <div>
      <Link to="/" className="btn btn-outline mb-6">
        <FaArrowLeft className="mr-2" />
        Back to Dashboard
      </Link>
      
      <div className="card task-detail-card">
        <div className="d-flex justify-between mb-4">
          <span className={`badge ${priorityClasses[task.priority]}`}>
            {task.priority.toUpperCase()} PRIORITY
          </span>
          
          <span className={`badge ${task.status === "completed" ? "badge-completed" : "badge-pending"}`}>
            {task.status.toUpperCase()}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
        
        <p className="task-detail-description">{task.description}</p>
        
        {task.tags && task.tags.length > 0 && (
          <div className="task-tags mb-4">
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="tags-container">
              {task.tags.map((tag, index) => (
                <span key={index} className="task-tag">
                  <FaTag className="tag-icon" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="task-detail-meta">
          <div className="task-detail-meta-item">
            <span className="task-detail-meta-label">Due Date</span>
            <span className="task-detail-meta-value">{formatDate(task.dueDate)}</span>
          </div>
          
          <div className="task-detail-meta-item">
            <span className="task-detail-meta-label">Created</span>
            <span className="task-detail-meta-value">{formatDate(task.createdAt)}</span>
          </div>
          
          {task.reminder && (
            <div className="task-detail-meta-item">
              <span className="task-detail-meta-label">
                <FaClock className="mr-1" />
                Reminder
              </span>
              <span className="task-detail-meta-value">{formatDateTime(task.reminder)}</span>
            </div>
          )}
          
          {task.pomodoroCount > 0 && (
            <div className="task-detail-meta-item">
              <span className="task-detail-meta-label">Pomodoros</span>
              <span className="task-detail-meta-value">
                <span className="pomodoro-icon">🍅</span> {task.pomodoroCount}
              </span>
            </div>
          )}
        </div>
        
        <div className="task-timer-section">
          <h3 className="text-lg font-semibold mb-2">Task Timer</h3>
          <TaskTimer taskId={task.id} />
        </div>
        
        {task.dependencies && task.dependencies.length > 0 && (
          <div className="dependencies-section mt-6">
            <h3 className="text-lg font-semibold mb-2">
              <FaLink className="mr-2 inline-block" />
              Dependencies
            </h3>
            <ul className="dependencies-list">
              {task.dependencies.map(depId => {
                const depTask = tasks.find(t => t.id === depId);
                return depTask ? (
                  <li key={depId} className="dependency-item">
                    <Link to={`/task/${depId}`} className="dependency-link">
                      <span className={`dependency-status ${depTask.status === "completed" ? "completed" : "pending"}`}></span>
                      {depTask.title}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}
        
        {dependentTasks.length > 0 && (
          <div className="dependent-tasks-section mt-6">
            <h3 className="text-lg font-semibold mb-2">
              <FaLink className="mr-2 inline-block" />
              Tasks that depend on this
            </h3>
            <ul className="dependencies-list">
              {dependentTasks.map(depTask => (
                <li key={depTask.id} className="dependency-item">
                  <Link to={`/task/${depTask.id}`} className="dependency-link">
                    <span className={`dependency-status ${depTask.status === "completed" ? "completed" : "pending"}`}></span>
                    {depTask.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="d-flex justify-end gap-2 mt-6">
          <button
            className={`btn ${task.status === "completed" ? "btn-warning" : "btn-success"}`}
            onClick={toggleStatus}
          >
            {task.status === "completed" ? (
              <>
                <FaUndo className="mr-2" />
                Mark as Pending
              </>
            ) : (
              <>
                <FaCheck className="mr-2" />
                Mark as Completed
              </>
            )}
          </button>
          
          <Link
            to={`/edit/${task.id}`}
            className="btn btn-primary"
          >
            <FaEdit className="mr-2" />
            Edit
          </Link>
          
          <button
            className="btn btn-danger"
            onClick={handleDelete}
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
