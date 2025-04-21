import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaTimes, FaClock, FaLink, FaBell } from "react-icons/fa";
import { useTaskContext } from "../context/TaskContext";

function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, addTask, updateTask } = useTaskContext();
  
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: new Date().toISOString().split("T")[0],
    status: "pending",
    tags: [],
    reminder: "",
    dependencies: []
  });
  
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [tagInput, setTagInput] = useState("");
  
  useEffect(() => {
    if (isEditMode) {
      const taskToEdit = tasks.find(task => task.id === id);
      if (taskToEdit) {
        setFormData({
          ...taskToEdit,
          tags: taskToEdit.tags || [],
          reminder: taskToEdit.reminder || "",
          dependencies: taskToEdit.dependencies || []
        });
      } else {
        alert("Task not found");
        navigate("/");
      }
    }
  }, [id, tasks, navigate, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput("");
    }
  };
  
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleDependencyChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      dependencies: selectedOptions
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    
    if (formData.reminder) {
      const reminderDate = new Date(formData.reminder);
      const now = new Date();
      if (reminderDate <= now) {
        newErrors.reminder = "Reminder must be in the future";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const testNotification = () => {
    if (Notification.permission === "granted") {
      const notification = new Notification("Test Reminder", {
        body: "This is a test notification for TaskMaster",
        icon: '/favicon.ico'
      });
      
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(e => console.log('Could not play notification sound'));
      } catch (error) {
        console.error("Error playing notification sound:", error);
      }
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          testNotification();
        } else {
          alert("Notification permission denied. Please enable notifications in your browser settings.");
        }
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditMode) {
      updateTask(formData);
      alert("Task updated successfully!");
    } else {
      addTask(formData);
      alert("Task created successfully!");
    }
    
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Task" : "Create New Task"}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input 
            type="text"
            id="title"
            name="title"
            className={`form-control ${errors.title && formSubmitted ? "is-invalid" : ""}`}
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
          />
          {errors.title && formSubmitted && (
            <div className="form-error">{errors.title}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea 
            id="description"
            name="description"
            className={`form-control form-textarea ${errors.description && formSubmitted ? "is-invalid" : ""}`}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows={4}
          ></textarea>
          {errors.description && formSubmitted && (
            <div className="form-error">{errors.description}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="priority" className="form-label">Priority</label>
          <select 
            id="priority"
            name="priority"
            className="form-control form-select"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="dueDate" className="form-label">Due Date</label>
          <input 
            type="date"
            id="dueDate"
            name="dueDate"
            className={`form-control ${errors.dueDate && formSubmitted ? "is-invalid" : ""}`}
            value={formData.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
          />
          {errors.dueDate && formSubmitted && (
            <div className="form-error">{errors.dueDate}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="tags" className="form-label">Tags</label>
          <div className="tags-input-container">
            <div className="tags-list">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button 
                    type="button" 
                    className="tag-remove-btn"
                    onClick={() => removeTag(tag)}
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
            <div className="tag-input-wrapper">
              <input
                type="text"
                id="tagInput"
                className="form-control"
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <button 
                type="button" 
                className="btn btn-icon btn-sm btn-outline add-tag-btn"
                onClick={() => {
                  if (tagInput.trim()) {
                    if (!formData.tags.includes(tagInput.trim())) {
                      setFormData(prev => ({
                        ...prev,
                        tags: [...prev.tags, tagInput.trim()]
                      }));
                    }
                    setTagInput("");
                  }
                }}
              >
                <FaPlus />
              </button>
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="reminder" className="form-label">
            <FaClock className="mr-2 inline-block" />
            Set Reminder
          </label>
          <input
            type="datetime-local"
            id="reminder"
            name="reminder"
            className={`form-control ${errors.reminder && formSubmitted ? "is-invalid" : ""}`}
            value={formData.reminder}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 16)}
          />
          {errors.reminder && formSubmitted && (
            <div className="form-error">{errors.reminder}</div>
          )}
          <div className="reminder-info mt-2">
            <div className="d-flex align-center gap-2">
              <span className="reminder-icon">🔔</span>
              <span className="text-sm">
                {formData.reminder 
                  ? `Reminder set for ${new Date(formData.reminder).toLocaleString()}`
                  : "No reminder set"}
              </span>
            </div>
            {formData.reminder && (
              <button
                type="button"
                className="btn btn-sm btn-outline mt-2"
                onClick={() => {
                  setFormData(prev => ({ ...prev, reminder: "" }));
                }}
              >
                Clear Reminder
              </button>
            )}
            {Notification.permission !== "granted" && (
              <div className="notification-permission-warning mt-2">
                <p className="text-sm text-warning">
                  ⚠️ Notification permission not granted. Reminders may not work.
                  <button
                    type="button"
                    className="btn btn-sm btn-link"
                    onClick={async () => {
                      const permission = await Notification.requestPermission();
                      if (permission === "granted") {
                        // Force re-render
                        setFormData({...formData});
                      }
                    }}
                  >
                    Enable notifications
                  </button>
                </p>
              </div>
            )}
            {formData.reminder && Notification.permission === "granted" && (
              <button
                type="button"
                className="btn btn-sm btn-outline mt-2"
                onClick={testNotification}
              >
                <FaBell className="mr-2" />
                Test Notification
              </button>
            )}
          </div>
        </div>
        
        {isEditMode && (
          <div className="form-group">
            <label htmlFor="dependencies" className="form-label">
              <FaLink className="mr-2 inline-block" />
              Task Dependencies
            </label>
            <select
              id="dependencies"
              multiple
              className="form-control"
              value={formData.dependencies || []}
              onChange={handleDependencyChange}
              size={Math.min(5, tasks.filter(t => t.id !== id).length)}
            >
              {tasks.filter(t => t.id !== id).map(task => (
                <option key={task.id} value={task.id}>
                  {task.title} ({task.status})
                </option>
              ))}
            </select>
            <p className="text-sm text-gray mt-1">
              This task can only be completed after its dependencies are completed.
            </p>
          </div>
        )}
        
        {isEditMode && (
          <div className="form-group">
            <label htmlFor="status" className="form-label">Status</label>
            <select 
              id="status"
              name="status"
              className="form-control form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
          >
            {isEditMode ? "Update Task" : "Create Task"}
          </button>
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
