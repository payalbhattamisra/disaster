import React, { useEffect, useState } from 'react';
import './news.css';

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userState, setUserState] = useState("");
   const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
  const IPINFO_TOKEN = process.env.REACT_APP_IPINFO_TOKEN;
  const helplineNumbers = {
    "Odisha": {
      disaster: "1070",
      fire: "101",
      ambulance: "108",
      women: "181"
    },
    "Maharashtra": {
      disaster: "1077",
      fire: "101",
      ambulance: "108",
      women: "1091"
    },
    "Default": {
      disaster: "1078",
      fire: "101",
      ambulance: "108",
      women: "1091"
    }
  };

  // Fetch user location
  useEffect(() => {
    fetch('https://ipinfo.io/json?token=4e95e8574fb4bb')
      .then(res => res.json())
      .then(data => {
        setUserState(data.region); // e.g., "Odisha"
      })
      .catch(err => console.log(err));
  }, []);

  // Fetch news articles 
   const fetchDisasterNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = `earthquake OR flood OR wildfire ${userState ? "OR " + userState : ""}`;
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&apiKey=c40922dda8f641d78e092c1063a5a089
`
      );
      const data = await response.json();
      if (data.status === "ok") {
        setArticles(data.articles);
      } else {
        throw new Error(data.message || "Failed to load news");
      }
    } catch (error) {
      setError(error.message || "Error fetching news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("news api",NEWS_API_KEY);
    console.log("toll free",IPINFO_TOKEN);
    fetchDisasterNews();
  }, []);
 
  // Get helpline details based on user state
  const helpline = helplineNumbers[userState] || helplineNumbers["Default"];
   // Filter articles by search input
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="news-feed">
      <h2>🌍 Live Disaster News Feed</h2>

      {/* Search and Refresh Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="🔍 Search news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={fetchDisasterNews} className="refresh-button">🔄 Refresh</button>
      </div>

      {/* Error Handling */}
      {error && <p className="error-message">❌ {error}</p>}

      {/* Spinner Loader */}
      {loading ? (
        <div className="spinner">⏳ Loading latest updates...</div>
      ) : (
        <>
          {/* Result Count */}
          <p className="result-count">📌 Showing {filteredArticles.length} articles</p>

          {/* News Grid */}
          <div className="news-grid">
            {filteredArticles.slice(0, 10).map((article, index) => (
              <div className="news-card" key={index}>
                {article.urlToImage && (
                  <img src={article.urlToImage} alt="news" className="news-image" />
                )}
                <div className="news-content">
                  <h3>{article.title}</h3>
                  <p className="desc">{article.description}</p>
                  <div className="news-meta">
                    <span className="source">{article.source.name}</span>
                    <span className="time">{new Date(article.publishedAt).toLocaleString()}</span>
                  </div>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
                    🔗 Read Full Article
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Helpline Section */}
          <div className="helpline-box">
            <h3>📞 Toll-Free Emergency Helplines - {userState || "Your Region"}</h3>
            <ul>
              <li>🆘 Disaster Relief: <strong>{helpline.disaster}</strong></li>
              <li>🚒 Fire Services: <strong>{helpline.fire}</strong></li>
              <li>🚑 Ambulance: <strong>{helpline.ambulance}</strong></li>
              <li>👩 Women Helpline: <strong>{helpline.women}</strong></li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsFeed;
