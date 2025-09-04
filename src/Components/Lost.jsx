import React, { useState, useRef, useEffect } from 'react';
import './Lost.css';

const lostItems = [
  {
    id: 1,
    name: 'Rohit Kumar',
    type: 'Missing Person',
    category: 'person',
    lastSeen: 'Bhubaneswar, Odisha',
    date: '2025-08-20',
    time: '03:30 PM',
    image: './images/person1.avif',
    description: 'Male, 28 years old, wearing blue shirt and jeans. Last seen near Kalinga Stadium.',
    contactNumber: '+91-9876543210',
    reportedBy: 'Family Member',
    urgency: 'High',
    reward: '₹10,000',
    status: 'Active',
    daysLost: 3,
    coordinates: { lat: 20.2961, lng: 85.8245 }
  },
  {
    id: 2,
    name: 'Brown Leather Bag with Documents',
    type: 'Lost Item',
    category: 'documents',
    lastSeen: 'Cuttack, Odisha',
    date: '2025-08-21',
    time: '11:15 AM',
    image: './images/bag.avif',
    description: 'Brown leather messenger bag containing Aadhaar card, passport, and bank documents.',
    contactNumber: '+91-8765432109',
    reportedBy: 'Owner',
    urgency: 'Medium',
    reward: '₹5,000',
    status: 'Active',
    daysLost: 2,
    coordinates: { lat: 20.4625, lng: 85.8828 }
  },
  {
    id: 3,
    name: 'Anita Singh',
    type: 'Missing Person',
    category: 'person',
    lastSeen: 'Puri, Odisha',
    date: '2025-08-22',
    time: '07:45 AM',
    image: './images/person2.avif',
    description: 'Female, 35 years old, wearing red saree. Last seen near Jagannath Temple.',
    contactNumber: '+91-7654321098',
    reportedBy: 'Husband',
    urgency: 'High',
    reward: '₹25,000',
    status: 'Active',
    daysLost: 1,
    coordinates: { lat: 19.8135, lng: 85.8312 }
  },
  {
    id: 4,
    name: 'Samsung Galaxy Phone',
    type: 'Lost Item',
    category: 'electronics',
    lastSeen: 'Berhampur, Odisha',
    date: '2025-08-19',
    time: '02:20 PM',
    image: './images/phone.avif',
    description: 'Black Samsung Galaxy S21 with blue case. Contains important family photos.',
    contactNumber: '+91-6543210987',
    reportedBy: 'Owner',
    urgency: 'Low',
    reward: '₹2,000',
    status: 'Found',
    daysLost: 4,
    coordinates: { lat: 19.3149, lng: 84.7941 }
  },
  {
    id: 5,
    name: 'Golden Retriever - Max',
    type: 'Missing Pet',
    category: 'pet',
    lastSeen: 'Rourkela, Odisha',
    date: '2025-08-20',
    time: '06:00 PM',
    image: './images/dog.avif',
    description: 'Friendly golden retriever, 3 years old, responds to "Max". Has blue collar.',
    contactNumber: '+91-5432109876',
    reportedBy: 'Pet Owner',
    urgency: 'High',
    reward: '₹15,000',
    status: 'Active',
    daysLost: 3,
    coordinates: { lat: 22.2604, lng: 84.8536 }
  }
];

const categories = ['All', 'person', 'documents', 'electronics', 'pet', 'other'];
const sortOptions = ['newest', 'oldest', 'urgency', 'reward'];
const statusOptions = ['All', 'Active', 'Found', 'Closed'];

function Lost() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const modalRef = useRef();

  // Filter and sort logic
  const filteredItems = lostItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.type.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'newest': return new Date(b.date) - new Date(a.date);
        case 'oldest': return new Date(a.date) - new Date(b.date);
        case 'urgency': 
          const urgencyOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        case 'reward': 
          const getRewardValue = (reward) => parseInt(reward.replace(/[₹,]/g, ''));
          return getRewardValue(b.reward) - getRewardValue(a.reward);
        default: return 0;
      }
    });

  // Modal handlers
  const openModal = (item) => {
    setSelectedItem(item);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedItem(null);
    document.body.style.overflow = 'auto';
  };

  // Click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (selectedItem) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [selectedItem]);

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'High': return 'urgent-high';
      case 'Medium': return 'urgent-medium';
      case 'Low': return 'urgent-low';
      default: return 'urgent-low';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'status-active';
      case 'Found': return 'status-found';
      case 'Closed': return 'status-closed';
      default: return 'status-active';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'person': return '👤';
      case 'documents': return '📄';
      case 'electronics': return '📱';
      case 'pet': return '🐕';
      default: return '📦';
    }
  };

  return (
    <div className="lost-container">
      {/* Header */}
      <div className="lost-header">
        <div className="header-content">
          <h1 className="page-title">Lost & Found Center</h1>
          <p className="page-subtitle">
            Help reunite people with their loved ones and belongings. Every report matters.
          </p>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{lostItems.filter(i => i.status === 'Active').length}</span>
              <span className="stat-label">Active Cases</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{lostItems.filter(i => i.status === 'Found').length}</span>
              <span className="stat-label">Resolved</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{lostItems.filter(i => i.category === 'person').length}</span>
              <span className="stat-label">Missing Persons</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="controls-section">
        <div className="search-controls">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, type, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className="clear-search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="control-buttons">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
            >
              <span>⚙️</span>
              Filters
            </button>
            
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="view-toggle"
            >
              <span>{viewMode === 'grid' ? '📋' : '⊞'}</span>
            </button>

            <button 
              onClick={() => setShowAddForm(true)}
              className="add-report-btn"
            >
              <span>➕</span>
              Report Missing
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Category:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="urgency">By Urgency</option>
                <option value="reward">By Reward</option>
              </select>
            </div>

            <div className="filter-actions">
              <button 
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                  setSortBy('newest');
                }}
                className="clear-filters"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="results-summary">
          <span className="results-count">
            {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} found
          </span>
          {search && <span className="search-term">for "{search}"</span>}
        </div>
      </div>

      {/* Items Display */}
      <div className={`items-container ${viewMode}`}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div 
              key={item.id} 
              className={`item-card ${item.category} ${getStatusColor(item.status)}`}
              onClick={() => openModal(item)}
            >
              <div className="card-image-container">
                <img src={item.image} alt={item.name} className="card-image" />
                <div className="image-overlay">
                  <span className={`urgency-badge ${getUrgencyColor(item.urgency)}`}>
                    {item.urgency}
                  </span>
                  <span className={`status-badge ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="category-icon">
                  {getCategoryIcon(item.category)}
                </div>
              </div>

              <div className="card-content">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-type">{item.type}</p>
                
                <div className="item-details">
                  <div className="detail-row">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">{item.lastSeen}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">📅</span>
                    <span className="detail-text">{item.date} at {item.time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">⏱️</span>
                    <span className="detail-text">{item.daysLost} day{item.daysLost !== 1 ? 's' : ''} ago</span>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="reward-info">
                    <span className="reward-label">Reward:</span>
                    <span className="reward-amount">{item.reward}</span>
                  </div>
                  <button className="action-btn primary">
                    {item.category === 'person' ? 'I Have Info' : 'I Found This'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No items found</h3>
            <p>Try adjusting your search criteria or filters</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="add-report-btn"
            >
              Report a missing item
            </button>
          </div>
        )}
      </div>

      {/* Detailed Modal */}
      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            
            <div className="modal-header">
              <img src={selectedItem.image} alt={selectedItem.name} className="modal-image" />
              <div className="modal-title-section">
                <h2 className="modal-title">{selectedItem.name}</h2>
                <p className="modal-type">{selectedItem.type}</p>
                <div className="modal-badges">
                  <span className={`urgency-badge ${getUrgencyColor(selectedItem.urgency)}`}>
                    {selectedItem.urgency} Priority
                  </span>
                  <span className={`status-badge ${getStatusColor(selectedItem.status)}`}>
                    {selectedItem.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4>Description</h4>
                <p>{selectedItem.description}</p>
              </div>

              <div className="modal-details-grid">
                <div className="modal-detail">
                  <strong>Last Seen:</strong>
                  <span>{selectedItem.lastSeen}</span>
                </div>
                <div className="modal-detail">
                  <strong>Date & Time:</strong>
                  <span>{selectedItem.date} at {selectedItem.time}</span>
                </div>
                <div className="modal-detail">
                  <strong>Reported By:</strong>
                  <span>{selectedItem.reportedBy}</span>
                </div>
                <div className="modal-detail">
                  <strong>Reward Offered:</strong>
                  <span className="reward-highlight">{selectedItem.reward}</span>
                </div>
              </div>

              <div className="modal-actions">
                <a 
                  href={`tel:${selectedItem.contactNumber}`}
                  className="action-btn primary large"
                >
                  📞 Call: {selectedItem.contactNumber}
                </a>
                <button className="action-btn secondary large">
                  📧 Send Information
                </button>
                <button className="action-btn success large">
                  📍 Share Location
                </button>
              </div>

              <div className="safety-notice">
                <h4>⚠️ Safety Notice</h4>
                <p>
                  Please verify identity before sharing information. 
                  For missing persons, contact local authorities immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Hotline */}
      <div className="emergency-banner">
        <div className="emergency-content">
          <span className="emergency-icon">🚨</span>
          <div className="emergency-text">
            <strong>Emergency Hotline</strong>
            <p>For immediate assistance with missing persons</p>
          </div>
          <a href="tel:100" className="emergency-call">
            📞 Call 100
          </a>
        </div>
      </div>
    </div>
  );
}

export default Lost;