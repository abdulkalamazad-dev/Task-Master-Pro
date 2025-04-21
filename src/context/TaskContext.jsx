import { createContext, useContext, useReducer, useEffect, useRef, useMemo } from "react";

const TaskContext = createContext();

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
  filter: "all", 
  searchQuery: "",
  sortBy: "dueDate",
  sortDirection: "asc",
  tags: [],
};

function taskReducer(state, action) {
  switch (action.type) {
    case "FETCH_TASKS_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_TASKS_SUCCESS":
      return { ...state, isLoading: false, tasks: action.payload };
    case "FETCH_TASKS_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_SORT":
      return { ...state, sortBy: action.payload };
    case "TOGGLE_SORT_DIRECTION":
      return { ...state, sortDirection: state.sortDirection === "asc" ? "desc" : "asc" };
    case "SET_TAG_FILTER":
      return { ...state, tags: action.payload };
    case "ADD_REMINDER":
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.taskId 
            ? { ...task, reminder: action.payload.reminderDate } 
            : task
        ),
      };
    case "REMOVE_REMINDER":
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload 
            ? { ...task, reminder: null } 
            : task
        ),
      };
    case "UPDATE_TASK_TIME":
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.taskId 
            ? { ...task, timeSpent: (task.timeSpent || 0) + action.payload.timeSpent } 
            : task
        ),
      };
    case "INCREMENT_POMODORO":
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload 
            ? { ...task, pomodoroCount: (task.pomodoroCount || 0) + 1 } 
            : task
        ),
      };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const tasksRef = useRef(state.tasks);
  
  useEffect(() => {
    tasksRef.current = state.tasks;
  }, [state.tasks]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      dispatch({ 
        type: "FETCH_TASKS_SUCCESS", 
        payload: JSON.parse(savedTasks) 
      });
    } else {
      fetchTasks();
    }
    
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
    
    const checkReminders = setInterval(() => {
      const now = new Date();
      tasksRef.current.forEach(task => {
        if (task.reminder) {
          const reminderTime = new Date(task.reminder);
          
          const timeDiff = reminderTime - now;
          if (timeDiff <= 60000 && timeDiff > -60000) { 
            const notifiedReminders = JSON.parse(localStorage.getItem('notifiedReminders') || '[]');
            
            if (!notifiedReminders.includes(task.id + '-' + task.reminder)) {
              if (Notification.permission === "granted") {
                const notification = new Notification(`Task Reminder: ${task.title}`, {
                  body: `Your task "${task.title}" is due now!`,
                  icon: '/notification-icon.png'
                });
                
                try {
                  const audio = new Audio('/notification-sound.mp3');
                  audio.play().catch(e => console.log('Could not play notification sound'));
                } catch (error) {
                  console.error("Error playing notification sound:", error);
                }
                
                notifiedReminders.push(task.id + '-' + task.reminder);
                localStorage.setItem('notifiedReminders', JSON.stringify(notifiedReminders));
                
                notification.onclick = function() {
                  window.open(`/#/task/${task.id}`, '_blank');
                };
              } else if (Notification.permission !== "denied") {
                Notification.requestPermission();
              }
            }
          }
        }
      });
    }, 10000);
    
    return () => clearInterval(checkReminders);
  }, []); 

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  const fetchTasks = async () => {
    dispatch({ type: "FETCH_TASKS_START" });
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=10");
      const data = await response.json();
      
      const formattedTasks = data.map(item => ({
        id: item.id.toString(),
        title: item.title,
        description: "Task imported from JSONPlaceholder",
        status: item.completed ? "completed" : "pending",
        priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        dueDate: new Date(Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        tags: [], 
        timeSpent: 0, 
        pomodoroCount: 0, 
        dependencies: [], 
      }));
      
      dispatch({ type: "FETCH_TASKS_SUCCESS", payload: formattedTasks });
    } catch (error) {
      dispatch({ type: "FETCH_TASKS_ERROR", payload: error.message });
    }
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      timeSpent: 0,
      pomodoroCount: 0,
    };
    dispatch({ type: "ADD_TASK", payload: newTask });
  };

  const updateTask = (task) => {
    dispatch({ type: "UPDATE_TASK", payload: task });
  };

  const deleteTask = (id) => {
    dispatch({ type: "DELETE_TASK", payload: id });
  };

  const setFilter = (filter) => {
    dispatch({ type: "SET_FILTER", payload: filter });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: "SET_SEARCH", payload: query });
  };
  
  const setSortBy = (sortBy) => {
    dispatch({ type: "SET_SORT", payload: sortBy });
  };
  
  const toggleSortDirection = () => {
    dispatch({ type: "TOGGLE_SORT_DIRECTION" });
  };
  
  const setTagFilter = (tags) => {
    dispatch({ type: "SET_TAG_FILTER", payload: tags });
  };
  
  const addReminder = (taskId, reminderDate) => {
    dispatch({ 
      type: "ADD_REMINDER", 
      payload: { taskId, reminderDate } 
    });
  };
  
  const removeReminder = (taskId) => {
    dispatch({ type: "REMOVE_REMINDER", payload: taskId });
  };
  
  const updateTaskTime = (taskId, timeSpent) => {
    dispatch({ 
      type: "UPDATE_TASK_TIME", 
      payload: { taskId, timeSpent } 
    });
  };
  
  const incrementPomodoro = (taskId) => {
    dispatch({ type: "INCREMENT_POMODORO", payload: taskId });
  };
  
  const checkTaskDependencies = (taskId) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || !task.dependencies || task.dependencies.length === 0) {
      return true; 
    }
    
    return task.dependencies.every(depId => {
      const depTask = state.tasks.find(t => t.id === depId);
      return depTask && depTask.status === "completed";
    });
  };

  const getFilteredTasks = () => {
    let filtered = [...state.tasks];
    
    if (state.filter !== "all") {
      filtered = filtered.filter(task => task.status === state.filter);
    }
    
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    if (state.tags.length > 0) {
      filtered = filtered.filter(task => 
        task.tags && state.tags.some(tag => task.tags.includes(tag))
      );
    }
    
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (state.sortBy) {
        case "dueDate":
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        case "priority":
          const priorityValues = { high: 3, medium: 2, low: 1 };
          comparison = priorityValues[b.priority] - priorityValues[a.priority];
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "createdAt":
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        default:
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
      }
      
      return state.sortDirection === "asc" ? comparison : -comparison;
    });
    
    return filtered;
  };

  const contextValue = useMemo(() => ({
    ...state,
    filteredTasks: getFilteredTasks(),
    addTask,
    updateTask,
    deleteTask,
    setFilter,
    setSearchQuery,
    setSortBy,
    toggleSortDirection,
    setTagFilter,
    addReminder,
    removeReminder,
    updateTaskTime,
    incrementPomodoro,
    checkTaskDependencies,
    refreshTasks: fetchTasks,
  }), [state]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  return useContext(TaskContext);
}
