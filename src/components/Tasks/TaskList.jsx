import TaskCard from "./TaskCard";
import { useTaskContext } from "../../context/TaskContext";
import { FaClipboardList } from "react-icons/fa";

function TaskList() {
  const { filteredTasks, isLoading, error } = useTaskContext();

  if (isLoading) {
    return (
      <div className="text-center p-6">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-danger">Error: {error}</p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <FaClipboardList />
        </div>
        <h3 className="empty-state-title">No tasks found</h3>
        <p className="empty-state-description">
          Add some tasks to get started or try adjusting your filters.
        </p>
        <a href="#/add" className="btn btn-primary">Add Your First Task</a>
      </div>
    );
  }

  return (
    <div className="grid grid-3-col">
      {filteredTasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;
