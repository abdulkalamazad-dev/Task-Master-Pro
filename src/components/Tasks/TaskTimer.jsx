import { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaRedo, FaPlus } from "react-icons/fa";
import { useTaskContext } from "../../context/TaskContext";

function TaskTimer({ taskId }) {
  const { updateTaskTime, incrementPomodoro } = useTaskContext();
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); 
  const [breakTime, setBreakTime] = useState(5 * 60); 
  const [isBreak, setIsBreak] = useState(false);
  
  const timerRef = useRef(null);
  const audioRef = useRef(new Audio('/notification-sound.mp3')); 
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeElapsed(0);
    setIsBreak(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const saveTime = () => {
    if (timeElapsed > 0) {
      updateTaskTime(taskId, timeElapsed);
      alert(`Saved ${formatTime(timeElapsed)} to this task!`);
      resetTimer();
    }
  };
  
  const completePomodoro = () => {
    incrementPomodoro(taskId);
    alert("Pomodoro completed! Take a break.");
    setIsBreak(true);
    setTimeElapsed(0);
  };
  
  const togglePomodoroMode = () => {
    setPomodoroMode(!pomodoroMode);
    resetTimer();
  };
  
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          
          if (pomodoroMode) {
            const limit = isBreak ? breakTime : pomodoroTime;
            
            if (newTime >= limit) {
              try {
                audioRef.current.play();
              } catch (error) {
                console.error("Could not play notification sound:", error);
              }
              
              if (!isBreak) {
                incrementPomodoro(taskId);
                setIsBreak(true);
                return 0; 
              } else {
                setIsBreak(false);
                return 0;
              }
            }
          }
          
          return newTime;
        });
      }, 1000);
      
      return () => {
        clearInterval(timerRef.current);
      };
    }
  }, [isRunning, pomodoroMode, isBreak, pomodoroTime, breakTime, taskId, incrementPomodoro]);
  
  return (
    <div className="task-timer">
      <div className="timer-mode-toggle">
        <button 
          className={`btn btn-sm ${pomodoroMode ? 'btn-primary' : 'btn-outline'}`}
          onClick={togglePomodoroMode}
        >
          Pomodoro Mode {pomodoroMode ? 'ON' : 'OFF'}
        </button>
      </div>
      
      {pomodoroMode && (
        <div className="pomodoro-status">
          {isBreak ? 'BREAK TIME' : 'WORK TIME'}
        </div>
      )}
      
      <div className="timer-display">
        {formatTime(timeElapsed)}
      </div>
      
      <div className="timer-progress">
        {pomodoroMode && (
          <div 
            className="timer-progress-bar" 
            style={{ 
              width: `${(timeElapsed / (isBreak ? breakTime : pomodoroTime)) * 100}%`,
              backgroundColor: isBreak ? 'var(--color-success)' : 'var(--color-primary)'
            }}
          ></div>
        )}
      </div>
      
      <div className="timer-controls">
        <button 
          className="btn btn-icon btn-primary"
          onClick={toggleTimer}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? <FaPause /> : <FaPlay />}
        </button>
        
        <button 
          className="btn btn-icon btn-outline"
          onClick={resetTimer}
          aria-label="Reset timer"
        >
          <FaRedo />
        </button>
        
        {!pomodoroMode && (
          <button 
            className="btn btn-icon btn-success"
            onClick={saveTime}
            disabled={timeElapsed === 0}
            aria-label="Save time"
          >
            <FaPlus />
          </button>
        )}
      </div>
      
      {pomodoroMode && (
        <div className="pomodoro-settings mt-4">
          <div className="form-group">
            <label className="form-label">Work Time (minutes)</label>
            <input 
              type="number" 
              className="form-control" 
              value={pomodoroTime / 60}
              onChange={(e) => setPomodoroTime(Math.max(1, parseInt(e.target.value)) * 60)}
              min="1"
              max="60"
              disabled={isRunning}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Break Time (minutes)</label>
            <input 
              type="number" 
              className="form-control" 
              value={breakTime / 60}
              onChange={(e) => setBreakTime(Math.max(1, parseInt(e.target.value)) * 60)}
              min="1"
              max="30"
              disabled={isRunning}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskTimer;
