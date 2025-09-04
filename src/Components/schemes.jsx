import React, { useState } from 'react';
import './Schemes.css';  

const schemesList = [
  {
    id: 1,
    name: 'Relief Fund Access',
    description: 'Get immediate financial assistance for disaster-affected families.',
    category: 'Financial Aid',
    eligibility: 'Disaster-affected families with valid ID proof',
    amount: '₹10,000 - ₹50,000',
    processingTime: '7-14 days',
    contactNumber: '1800-123-4567',
    documents: ['Identity Proof', 'Address Proof', 'Damage Assessment Certificate'],
    status: 'Active',
    priority: 'High'
  },
  {
    id: 2,
    name: 'Subsidy Information',
    description: 'Learn about food, shelter, and medical subsidies available in your area.',
    category: 'Subsidies',
    eligibility: 'BPL families and disaster victims',
    amount: 'Varies by subsidy type',
    processingTime: '3-7 days',
    contactNumber: '1800-987-6543',
    documents: ['Ration Card', 'Income Certificate', 'Disaster Certificate'],
    status: 'Active',
    priority: 'Medium'
  },
  {
    id: 3,
    name: 'Insurance Claims',
    description: 'Guidelines to claim disaster-related insurance for homes and businesses.',
    category: 'Insurance',
    eligibility: 'Policy holders with valid insurance coverage',
    amount: 'As per policy terms',
    processingTime: '21-45 days',
    contactNumber: '1800-456-7890',
    documents: ['Insurance Policy', 'Damage Photos', 'Survey Report'],
    status: 'Active',
    priority: 'Medium'
  },
  {
    id: 4,
    name: 'Compensation Guidelines',
    description: 'Official instructions on how to receive government compensation for losses.',
    category: 'Compensation',
    eligibility: 'Verified disaster victims with documented losses',
    amount: '₹25,000 - ₹2,00,000',
    processingTime: '30-60 days',
    contactNumber: '1800-234-5678',
    documents: ['Loss Assessment Report', 'Property Documents', 'Bank Details'],
    status: 'Active',
    priority: 'High'
  },
  {
    id: 5,
    name: 'Emergency Policies',
    description: 'Access government policies for evacuation, shelter, and safety procedures.',
    category: 'Emergency Services',
    eligibility: 'All residents in disaster-prone areas',
    amount: 'Free services',
    processingTime: 'Immediate',
    contactNumber: '1800-345-6789',
    documents: ['Identity Proof only'],
    status: 'Active',
    priority: 'High'
  },
  {
    id: 6,
    name: 'Medical Emergency Support',
    description: 'Free medical treatment and medicine for disaster-affected individuals.',
    category: 'Healthcare',
    eligibility: 'Disaster victims requiring medical attention',
    amount: 'Free treatment up to ₹1,00,000',
    processingTime: 'Immediate',
    contactNumber: '1800-567-8901',
    documents: ['Medical Reports', 'Identity Proof', 'Disaster Certificate'],
    status: 'Active',
    priority: 'High'
  }
];

const categories = ['All', 'Financial Aid', 'Subsidies', 'Insurance', 'Compensation', 'Emergency Services', 'Healthcare'];

function Schemes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedScheme, setExpandedScheme] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredSchemes = schemesList.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (schemeId) => {
    setExpandedScheme(expandedScheme === schemeId ? null : schemeId);
  };

  return (
    <div className="schemes-container">
      <div className="schemes-max-width">
        {/* Header */}
        <div className="schemes-header">
          <h1 className="schemes-title">
            Government Schemes & Benefits
          </h1>
          <p className="schemes-subtitle">
            Access verified government resources and support during disasters. Find the right assistance for your needs.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="search-container">
          <div className="search-wrapper">
            {/* Search Bar */}
            <div className="search-input-wrapper">
              <span className="search-icon icon-search"></span>
              <input
                type="text"
                placeholder="Search schemes by name or description..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filter-button"
            >
              <span className="icon-filter"></span>
              Filter
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="filter-section">
              <div className="category-grid">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="results-text">
          Showing <span className="highlight">{filteredSchemes.length}</span> schemes
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchTerm && ` for "${searchTerm}"`}
        </div>

        {/* Schemes Grid */}
        <div>
          {filteredSchemes.map(scheme => (
            <div key={scheme.id} className="scheme-card">
              <div className="card-header">
                {/* Header */}
                <div className="card-title-row">
                  <div className="card-title-content">
                    <h3 className="card-title">{scheme.name}</h3>
                    <span className={`priority-badge priority-${scheme.priority.toLowerCase()}`}>
                      {scheme.priority} Priority
                    </span>
                    <p className="card-description">{scheme.description}</p>
                    <div className="card-meta">
                      <span className="meta-item">
                        <span className="icon-users"></span>
                        {scheme.category}
                      </span>
                      <span className="meta-item">
                        <span className="icon-clock"></span>
                        {scheme.processingTime}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpand(scheme.id)}
                    className="expand-button"
                  >
                    <span className={`expand-icon icon-chevron ${expandedScheme === scheme.id ? 'rotated' : ''}`}></span>
                  </button>
                </div>

                {/* Quick Info */}
                <div className="quick-info-grid">
                  <div className="info-card financial">
                    <p className="info-label financial">Financial Assistance</p>
                    <p className="info-value financial">{scheme.amount}</p>
                  </div>
                  <div className="info-card contact">
                    <p className="info-label contact">Contact Number</p>
                    <p className="info-value contact">
                      <span className="icon-phone"></span>
                      {scheme.contactNumber}
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedScheme === scheme.id && (
                  <div className="expanded-details">
                    <div className="detail-section">
                      <h4 className="detail-title">Eligibility Criteria</h4>
                      <p className="detail-content">{scheme.eligibility}</p>
                    </div>
                    
                    <div className="detail-section">
                      <h4 className="detail-title">Required Documents</h4>
                      <div className="documents-grid">
                        {scheme.documents.map((doc, index) => (
                          <span key={index} className="document-tag">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button className="action-button primary">
                        <span className="icon-external"></span>
                        Apply Online
                      </button>
                      <button className="action-button success">
                        <span className="icon-map"></span>
                        Find Nearest Office
                      </button>
                      <button className="action-button secondary">
                        Download Guidelines
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredSchemes.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3 className="no-results-title">No schemes found</h3>
            <p className="no-results-text">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Emergency Contact Section */}
        <div className="emergency-section">
          <h2 className="emergency-title">Emergency Assistance</h2>
          <p className="emergency-description">For immediate help during disasters, contact our 24/7 emergency helpline</p>
          <div className="emergency-buttons">
            <a href="tel:108" className="emergency-button primary">
              <span className="icon-phone"></span>
              Emergency: 108
            </a>
            <a href="tel:1077" className="emergency-button secondary">
              <span className="icon-phone"></span>
              Disaster Helpline: 1077
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schemes;