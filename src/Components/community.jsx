// CommunityPage.jsx
import React, { useState, useEffect } from "react";
import "./Community.css";

const guides = {
  "Short Guides & Videos": {
    type: "video",
    icon: "🎥",
    description: "Quick video tutorials for essential survival skills",
    content: [
      {
        url: "https://www.youtube.com/embed/O-SwlIy0nzw",
        title: "Emergency Preparedness Basics",
        description: "Learn the fundamentals of emergency preparedness"
      },
      {
        url: "https://www.youtube.com/embed/UmiGvOha7As",
        title: "Disaster Response Guide",
        description: "Essential steps during disaster situations"
      }
    ],
  },
  "Water Purification Tips": {
    type: "text",
    icon: "💧",
    description: "Essential methods for making water safe to drink",
    content: [
      {
        text: "Boil water for at least 10 minutes before drinking.",
        priority: "high",
        category: "Heat Treatment"
      },
      {
        text: "Use purification tablets if boiling isn't possible.",
        priority: "medium",
        category: "Chemical Treatment"
      },
      {
        text: "Filter water using a clean cloth to remove particles.",
        priority: "medium",
        category: "Physical Filtration"
      },
      {
        text: "UV light can kill bacteria and viruses in clear water.",
        priority: "low",
        category: "UV Treatment"
      },
      {
        text: "Solar disinfection (SODIS) works with clear plastic bottles.",
        priority: "low",
        category: "Solar Treatment"
      }
    ],
  },
  "First Aid Tutorials": {
    type: "video",
    icon: "🏥",
    description: "Life-saving first aid techniques everyone should know",
    content: [
      {
        url: "https://www.youtube.com/embed/hizBdM1Ob68",
        title: "Hands-Only CPR Training",
        description: "Learn life-saving Hands-Only CPR in under 2 minutes"
      },
      {
        url: "https://www.youtube.com/embed/5OKFljZ2GQE",
        title: "How to Help a Choking Adult",
        description: "Step-by-step guide to helping someone who is choking"
      },
      {
        url: "https://www.youtube.com/embed/gn6xt1ca8A0",
        title: "Basic First Aid for Cuts and Wounds",
        description: "Proper wound cleaning and bandaging techniques"
      }
    ],
  },
  "Safety Awareness": {
    type: "text",
    icon: "⚠️",
    description: "Critical safety tips for emergency situations",
    content: [
      {
        text: "Always keep emergency numbers saved on your phone.",
        priority: "high",
        category: "Communication"
      },
      {
        text: "Stay calm and don't spread panic during disasters.",
        priority: "high",
        category: "Mental Preparedness"
      },
      {
        text: "Follow instructions from local authorities immediately.",
        priority: "high",
        category: "Authority Compliance"
      },
      {
        text: "Identify multiple evacuation routes from your location.",
        priority: "medium",
        category: "Evacuation Planning"
      },
      {
        text: "Keep a whistle or signaling device to attract attention.",
        priority: "medium",
        category: "Signaling"
      }
    ],
  },
  "Offline Access": {
    type: "text",
    icon: "📱",
    description: "Prepare for when internet and cell service are unavailable",
    content: [
      {
        text: "Download essential apps that work offline before emergencies.",
        priority: "high",
        category: "App Preparation"
      },
      {
        text: "Keep PDFs of survival guides stored locally on your device.",
        priority: "high",
        category: "Document Storage"
      },
      {
        text: "Store offline maps for navigation in Google Maps or similar apps.",
        priority: "high",
        category: "Navigation"
      },
      {
        text: "Download weather apps that cache forecasts for offline use.",
        priority: "medium",
        category: "Weather Information"
      },
      {
        text: "Save important contact information in multiple locations.",
        priority: "medium",
        category: "Contact Management"
      }
    ],
  },
};

const CommunityPage = () => {
  const [selected, setSelected] = useState("Short Guides & Videos");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContent, setFilteredContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter content based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContent(null);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const currentGuide = guides[selected];
      if (currentGuide.type === "text") {
        const filtered = currentGuide.content.filter(item =>
          item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredContent(filtered);
      } else {
        const filtered = currentGuide.content.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredContent(filtered);
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selected]);

  const handleSidebarClick = (item) => {
    setSelected(item);
    setSearchTerm("");
    setFilteredContent(null);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high": return "priority-high";
      case "medium": return "priority-medium";
      case "low": return "priority-low";
      default: return "";
    }
  };

  const renderTextContent = (content) => {
    const itemsToShow = filteredContent !== null ? filteredContent : content;
    
    if (itemsToShow.length === 0) {
      return (
        <div className="community-no-results">
          <p>No results found for "{searchTerm}"</p>
        </div>
      );
    }

    return (
      <div className="community-text-content-grid">
        {itemsToShow.map((item, idx) => (
          <div 
            key={idx} 
            className={`community-content-card ${getPriorityClass(item.priority)}`}
          >
            <div className="community-card-header">
              <span className="community-category-tag">{item.category}</span>
              {item.priority && (
                <span className={`community-priority-badge ${item.priority}`}>
                  {item.priority.toUpperCase()}
                </span>
              )}
            </div>
            <p className="community-card-content">{item.text}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderVideoContent = (content) => {
    const itemsToShow = filteredContent !== null ? filteredContent : content;
    
    if (itemsToShow.length === 0) {
      return (
        <div className="community-no-results">
          <p>No results found for "{searchTerm}"</p>
        </div>
      );
    }

    return (
      <div className="community-video-content-grid">
        {itemsToShow.map((video, idx) => (
          <div key={idx} className="community-video-card">
            <div className="community-video-wrapper">
              <iframe
                src={video.url}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <div className="community-video-info">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="community-page-wrapper">
      <div className="community-container">
        {/* Sidebar */}
        <aside className="community-sidebar" role="navigation" aria-label="Resource categories">
          <div className="community-sidebar-header">
            <h2>Community Resources</h2>
            <p className="community-sidebar-subtitle">Essential survival guides and tutorials</p>
          </div>
          <nav>
            <ul role="menu">
              {Object.keys(guides).map((item) => (
                <li
                  key={item}
                  role="menuitem"
                  className={`community-sidebar-item ${selected === item ? "active" : ""}`}
                  onClick={() => handleSidebarClick(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSidebarClick(item);
                    }
                  }}
                  tabIndex={0}
                  aria-selected={selected === item}
                >
                  <span className="community-sidebar-icon">{guides[item].icon}</span>
                  <div className="community-sidebar-text">
                    <span className="community-sidebar-title">{item}</span>
                    <span className="community-sidebar-count">
                      {guides[item].content.length} items
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="community-content" role="main">
          <header className="community-content-header">
            <div className="community-title-section">
              <h1>
                <span className="community-title-icon">{guides[selected].icon}</span>
                {selected}
              </h1>
              <p className="community-content-description">{guides[selected].description}</p>
            </div>
            
            {/* Search Bar */}
            <div className="community-search-container">
              <input
                type="search"
                placeholder={`Search in ${selected.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="community-search-input"
                aria-label={`Search within ${selected}`}
              />
              <div className="community-search-icon">🔍</div>
            </div>
          </header>

          <div className="community-content-box" role="region" aria-live="polite">
            {isLoading ? (
              <div className="community-loading-spinner">
                <div className="community-spinner"></div>
                <p>Searching...</p>
              </div>
            ) : (
              <>
                {guides[selected].type === "video" 
                  ? renderVideoContent(guides[selected].content)
                  : renderTextContent(guides[selected].content)
                }
              </>
            )}
          </div>

          {/* Stats Footer */}
          <footer className="community-content-footer">
            <div className="community-stats">
              <span>
                Showing {filteredContent ? filteredContent.length : guides[selected].content.length} of {guides[selected].content.length} items
              </span>
              {searchTerm && (
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredContent(null);
                  }}
                  className="community-clear-search"
                  aria-label="Clear search"
                >
                  Clear search ✕
                </button>
              )}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default CommunityPage;