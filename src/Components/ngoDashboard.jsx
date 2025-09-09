import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { MapContainer, TileLayer, CircleMarker , Popup} from 'react-leaflet';
import 'chart.js/auto';
import 'leaflet/dist/leaflet.css';
import './ngoDashboard.css';

function NgoDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [victims, setVictims] = useState([]); // store victim data for map
  const [volunteerActivity, setVolunteerActivity] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    // Fetch victim stats and store victim data
    const fetchVictimStats = async () => {
      try {
        const res = await fetch('http://disaster-3hvn.onrender.com/api/victim/all');
        const data = await res.json();

        setVictims(data); // store full victim data for map

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
        const res = await fetch('http://disaster-3hvn.onrender.com/api/ngo/activity'); 
        const data = await res.json();
        setVolunteerActivity(data);
      } catch (err) {
        console.error("Error fetching volunteer activity:", err);
      }
    };

    // Fetch inventory
    const fetchInventory = async () => {
      try {
        const res = await fetch('http://disaster-3hvn.onrender.com/api/inventory'); 
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

  // Bar chart data
  const barData = {
    labels: ['Pending', 'In Progress', 'Resolved'],
    datasets: [
      { 
        label: 'Requests', 
        data: [stats.pending, stats.inProgress, stats.resolved], 
        backgroundColor: ['#f39c12','#2980b9','#27ae60'] 
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
              <li key={idx}>{item.item}: {item.qty}</li>
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
            const res = await fetch('http://disaster-3hvn.onrender.com/api/inventory/add', {
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
              <li key={idx}>{item.item} - Only {item.qty} left!</li>
            ))}
          </ul>
        </section>
      )}

      {/* Graphs & Maps */}
      <section className="graphs-maps">
        <h2>Graphs and Heatmaps</h2>

        {/* Bar Chart */}
        <div className="bar-chart-container">
          <h3>Requests Overview</h3>
          <Bar data={barData} />
        </div>

        {/* Map showing Pending & In Progress victims */}
        <div className="map-container">
          <h3>Heatmap / Victim Locations</h3>
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '300px', width: '100%' }}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  
  {victims
    .filter(v =>
  ["Pending", "In Progress"].includes(v.status) &&
  typeof v.latitude === "number" &&
  typeof v.longitude === "number"
)
    .map((v, idx) => (
     <CircleMarker
  key={idx}
  center={[v.latitude, v.longitude]}
  radius={15}
  color={v.status === "Pending" ? "#f39c12" : "#2980b9"}
>
  <Popup>
    <div>
      <strong>Name:</strong> {v.name || "Unassigned"} <br />
      <strong>Task:</strong> {v.task || "-"} <br />
      <strong>Status:</strong> {v.status}
    </div>
  </Popup>
</CircleMarker>

    ))
  }
</MapContainer>


        </div>
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
