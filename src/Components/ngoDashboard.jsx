import React, { useEffect, useState } from 'react';
import './ngoDashboard.css';

function NgoDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [volunteerActivity, setVolunteerActivity] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    // Fetch victim request status counts
    const fetchVictimStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/victim/all');
        const data = await res.json();

        const pendingCount = data.filter(v => v.status === "Pending").length;
        const inProgressCount = data.filter(v => v.status === "In Progress").length;
        const resolvedCount = data.filter(v => v.status === "Completed").length;

        setStats({
          pending: pendingCount,
          inProgress: inProgressCount,
          resolved: resolvedCount
        });
      } catch (err) {
        console.error("Error fetching victim stats:", err);
      }
    };

    // Fetch volunteer activity
    const fetchVolunteerActivity = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/volunteer/activity'); 
        // Replace with your actual volunteer API endpoint
        const data = await res.json();
        setVolunteerActivity(data);
      } catch (err) {
        console.error("Error fetching volunteer activity:", err);
      }
    };

    // Fetch inventory (optional: from backend)
    const fetchInventory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/inventory'); 
        // Replace with your actual inventory API endpoint
        const data = await res.json();
        setInventory(data);
        setLowStock(data.filter(item => item.qty < 10)); // Example threshold
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }
    };

    fetchVictimStats();
    fetchVolunteerActivity();
    fetchInventory();
  }, []);

  const handleSendAlert = (type) => {
    alert(`Mass ${type} alert sent!`);
  };

  return (
    <div className="ngo-dashboard">
      <h1>NGO Dashboard</h1>

      {/* Stats Section */}
      <div className="stats-cards">
        <div className="card pending">Pending: {stats.pending}</div>
        <div className="card in-progress">In Progress: {stats.inProgress}</div>
        <div className="card resolved">Resolved: {stats.resolved}</div>
      </div>

      {/* Volunteer Activity */}
      <section className="volunteer-section">
        <h2>Volunteer Activity</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Task</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {volunteerActivity.length > 0 ? (
              volunteerActivity.map((v, idx) => (
                <tr key={idx}>
                  <td>{v.name}</td>
                  <td>{v.task}</td>
                  <td>{v.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No active volunteer data.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Inventory */}
      <section className="inventory-section">
        <h2>Inventory of Resources</h2>
        <ul>
          {inventory.map((item, idx) => (
            <li key={idx}>
              {item.item}: {item.qty}
            </li>
          ))}
        </ul>
      </section>

      {/* Low Stock Warnings */}
      {lowStock.length > 0 && (
        <section className="low-stock">
          <h2>⚠ Low Stock Warnings</h2>
          <ul>
            {lowStock.map((item, idx) => (
              <li key={idx}>
                {item.item} - Only {item.qty} left!
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Graphs & Maps Placeholder */}
      <section className="graphs-maps">
        <h2>Graphs and Heatmaps</h2>
        <div className="placeholder">[Graph/Map will be rendered here]</div>
      </section>

      {/* Alerts */}
      <section className="alerts">
        <h2>Send Mass Alerts</h2>
        <button onClick={() => handleSendAlert('SMS')}>Send SMS Alert</button>
        <button onClick={() => handleSendAlert('Email')}>Send Email Alert</button>
      </section>
    </div>
  );
}

export default NgoDashboard;
