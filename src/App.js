import './Components/LandingPage.jsx'
import './App.css'; 
import {BrowserRouter as Router,Routes,Route}from 'react-router-dom';
import Victim from './Components/victim.jsx';
import LandingPage from './Components/LandingPage.jsx';
import Volunter from './Components/Volunter.jsx';
import VolunteerDashboard from './Components/VolunteerDashboard.jsx';
function App() {
  return (
     <Router>
        <Routes>
            <Route path="/"element={<LandingPage/>}/>
            <Route path="/victim" element={<Victim/>}/>
            <Route path="/volunter" element={<Volunter/>}/> 
            <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        </Routes>
     </Router>
  );
}

export default App;
