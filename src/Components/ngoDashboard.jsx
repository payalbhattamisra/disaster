import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
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
    // Fetch victim stats
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
        const res = await fetch('http://localhost:5000/api/ngo/activity'); 
        const data = await res.json();
        setVolunteerActivity(data);
      } catch (err) {
        console.error("Error fetching volunteer activity:", err);
      }
    };

    // Fetch inventory
    const fetchInventory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/inventory'); 
        const data = await res.json();
        setInventory(data);
        setLowStock(data.filter(item => item.qty < 10));
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

  // Pie chart data
  const pieData = {
    labels: ['Pending', 'In Progress', 'Resolved'],
    datasets: [
      {
        data: [stats.pending, stats.inProgress, stats.resolved],
        backgroundColor: ['#f39c12', '#2980b9', '#27ae60']
      }
    ]
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

      {/* Pie Chart */}
      <section className="pie-chart-section">
        <h2>Requests Breakdown</h2>
        <div className="pie-chart-container">
          <Pie data={pieData} />
        </div>
      </section>

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
                  <td>{v.name || "Unassigned"}</td>
                  <td>{v.task || "-"}</td>
                  <td>{v.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No volunteer activity yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Inventory */}
  <section className="inventory-section">
    <h2>Inventory of Resources</h2>
    
    <ul>
      {inventory.length > 0 ? (
        inventory.map((item, idx) => (
          <li key={idx}>
            {item.item}: {item.qty}
          </li>
        ))
      ) : (
        <li>No inventory data.</li>
      )}
    </ul>

    {/* Add New Inventory Item */}
    <h3>Add New Item</h3>
    <form onSubmit={async (e) => {
      e.preventDefault();
      const itemName = e.target.item.value;
      const itemQty = parseInt(e.target.qty.value);

      if(!itemName || isNaN(itemQty)) return alert("Enter valid data");

      try {
        const res = await fetch('http://localhost:5000/api/inventory/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item: itemName, qty: itemQty })
        });
        const newItem = await res.json();
        setInventory(prev => [...prev, newItem]);
        e.target.reset();
      } catch (err) {
        console.error("Error adding inventory:", err);
      }
    }}>
      <input type="text" name="item" placeholder="Item Name" required />
      <input type="number" name="qty" placeholder="Quantity" required />
      <button type="submit">Add Item</button>
    </form>
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
