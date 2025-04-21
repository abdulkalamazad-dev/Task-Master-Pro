import { useState, useEffect } from "react";
import { useTaskContext } from "../context/TaskContext";

function Profile() {
  const { tasks } = useTaskContext();
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : {
      name: "User Name",
      email: "user@example.com",
      joinDate: "April 2025",
      avatar: "https://i.pravatar.cc/150?img=68"
    };
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({...user});
  
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;
  
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
    
  const highPriorityTasks = tasks.filter(task => task.priority === "high").length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === "medium").length;
  const lowPriorityTasks = tasks.filter(task => task.priority === "low").length;
  
  const highPriorityPending = tasks.filter(
    task => task.priority === "high" && task.status === "pending"
  ).length;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(formData);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setFormData({...user});
    setIsEditing(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      
      <div className="card mb-6">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="d-flex gap-6 align-start">
              <div className="profile-avatar">
                <img 
                  src={formData.avatar} 
                  alt="User avatar" 
                  className="rounded-full border"
                  width="150"
                  height="150"
                />
                <div className="form-group mt-2">
                  <label htmlFor="avatar" className="form-label">Avatar URL</label>
                  <input 
                    type="text"
                    id="avatar"
                    name="avatar"
                    className="form-control"
                    value={formData.avatar}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input 
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input 
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-success">Save Changes</button>
                  <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="d-flex gap-6 align-start">
            <div className="profile-avatar">
              <img 
                src={user.avatar} 
                alt="User avatar" 
                className="rounded-full border"
                width="150"
                height="150"
              />
            </div>
            
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray">{user.email}</p>
              <p className="text-sm text-gray mt-2">
                Member since: {user.joinDate}
              </p>
              
              <div className="d-flex gap-2 mt-4">
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
                <button className="btn btn-outline btn-sm">Change Password</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="card mb-6">
        <h3 className="text-lg font-bold mb-4">Task Statistics</h3>
        
        <div className="stats-container mb-6">
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
            <div className="stat-label">High Priority Pending</div>
            <div className="stat-number text-danger">{highPriorityPending}</div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="d-flex justify-between mb-2">
            <span>Task Completion</span>
            <span className="font-bold">{completionPercentage}%</span>
          </div>
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h4 className="text-md font-bold mb-4">Priority Distribution</h4>
          
          <div className="d-flex flex-column gap-3">
            <div>
              <div className="d-flex justify-between mb-1">
                <span className="text-sm">High Priority</span>
                <span className="text-sm font-bold">{highPriorityTasks}</span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${(highPriorityTasks / totalTasks) * 100 || 0}%`,
                    backgroundColor: "var(--color-danger)"
                  }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="d-flex justify-between mb-1">
                <span className="text-sm">Medium Priority</span>
                <span className="text-sm font-bold">{mediumPriorityTasks}</span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${(mediumPriorityTasks / totalTasks) * 100 || 0}%`,
                    backgroundColor: "var(--color-warning)"
                  }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="d-flex justify-between mb-1">
                <span className="text-sm">Low Priority</span>
                <span className="text-sm font-bold">{lowPriorityTasks}</span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${(lowPriorityTasks / totalTasks) * 100 || 0}%`,
                    backgroundColor: "var(--color-success)"
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-bold mb-4">Activity Summary</h3>
        
        <div className="border-b pb-4 mb-4">
          <h4 className="font-medium mb-2">Recent Activity</h4>
          <ul className="activity-list">
            <li className="d-flex justify-between mb-2">
              <span>Created task "Complete React Project"</span>
              <span className="text-sm text-gray">2 days ago</span>
            </li>
            <li className="d-flex justify-between mb-2">
              <span>Completed task "Research React Hooks"</span>
              <span className="text-sm text-gray">3 days ago</span>
            </li>
            <li className="d-flex justify-between mb-2">
              <span>Updated profile information</span>
              <span className="text-sm text-gray">1 week ago</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Productivity Tips</h4>
          <ul className="tips-list">
            <li className="mb-2">
              Hello {user.name}! You have {highPriorityPending} high priority tasks pending. Consider focusing on these first.
            </li>
            <li className="mb-2">
              Your task completion rate is {completionPercentage}%. 
              {completionPercentage < 50 
                ? " Try to complete more tasks to improve productivity." 
                : " Great job keeping up with your tasks!"}
            </li>
            <li className="mb-2">
              Remember to break down large tasks into smaller, manageable ones.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Profile;
