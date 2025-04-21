import { useState } from "react";
import { FaSearch, FaSort, FaTag } from "react-icons/fa";
import { useTaskContext } from "../../context/TaskContext";

function TaskFilter() {
  const { 
    filter, 
    searchQuery, 
    sortBy,
    sortDirection,
    tags: selectedTags,
    setFilter, 
    setSearchQuery,
    setSortBy,
    toggleSortDirection,
    setTagFilter
  } = useTaskContext();
  
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  
  const { tasks } = useTaskContext();
  const allTags = [...new Set(tasks.flatMap(task => task.tags || []))];

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setTagFilter(selectedTags.filter(t => t !== tag));
    } else {
      setTagFilter([...selectedTags, tag]);
    }
  };

  return (
    <div className="search-filter-container animate-slide-up">
      <div className="search-container">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search tasks by title, description, priority or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="search-icon">
          <FaSearch />
        </span>
      </div>
      
      <div className="filter-controls">
        <select 
          className="form-control form-select filter-select"
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter tasks by status"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        
        <div className="sort-container">
          <select 
            className="form-control form-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort tasks"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="createdAt">Sort by Creation Date</option>
            <option value="title">Sort by Title</option>
          </select>
          
          <button 
            className="btn btn-icon btn-outline sort-direction-toggle"
            onClick={toggleSortDirection}
            aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
          >
            <FaSort className={sortDirection === 'desc' ? 'rotate-180' : ''} />
          </button>
        </div>
        
        <div className="tags-filter-container">
          <button 
            className="btn btn-outline tags-filter-button"
            onClick={() => setShowTagsDropdown(!showTagsDropdown)}
            aria-expanded={showTagsDropdown}
            aria-haspopup="true"
          >
            <FaTag className="mr-2" />
            Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
          </button>
          
          {showTagsDropdown && (
            <div className="tags-dropdown">
              {allTags.length > 0 ? (
                <>
                  {allTags.map(tag => (
                    <div key={tag} className="tag-option">
                      <label className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedTags.includes(tag)}
                          onChange={() => handleTagToggle(tag)}
                        />
                        <span className="form-check-label">{tag}</span>
                      </label>
                    </div>
                  ))}
                  
                  {selectedTags.length > 0 && (
                    <button 
                      className="btn btn-sm btn-outline clear-tags-btn"
                      onClick={() => setTagFilter([])}
                    >
                      Clear all
                    </button>
                  )}
                </>
              ) : (
                <div className="no-tags-message">No tags available</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskFilter;
