import TaskList from "../components/Tasks/TaskList";
import TaskFilter from "../components/Tasks/TaskFilter";
import { useTaskContext } from "../context/TaskContext";

function Dashboard() {
  const { tasks } = useTaskContext();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(task => task.priority === "high").length;
  
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Manage your tasks efficiently and stay organized
        </p>
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-label">Total Tasks</div>
          <div className="stat-number">{totalTasks}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-number stat-number-success">{completedTasks}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-number stat-number-warning">{pendingTasks}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Completion</div>
          <div className="stat-number stat-number-info">{completionPercentage}%</div>
        </div>
      </div>
      
      <TaskFilter />
      <TaskList />
    </div>
  );
}

export default Dashboard;
