import { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Dashboard from "./pages/Dashboard";
import TaskForm from "./pages/TaskForm";
import TaskDetails from "./pages/TaskDetails";
import Profile from "./pages/Profile";
import NotificationHelper from "./components/NotificationHelper";
import { TaskProvider } from "./context/TaskContext";
import "./styles/index.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <TaskProvider>
      <HashRouter>
        <NotificationHelper />
        <div className="app-container">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="main-content">
            <div className="container">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add" element={<TaskForm />} />
                <Route path="/edit/:id" element={<TaskForm />} />
                <Route path="/task/:id" element={<TaskDetails />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </TaskProvider>
  );
}

export default App;
