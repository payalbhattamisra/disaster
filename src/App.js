import './Components/LandingPage.jsx'
import './App.css'; 
import {BrowserRouter as Router,Routes,Route}from 'react-router-dom';
import Victim from './Components/victim.jsx';
import LandingPage from './Components/LandingPage.jsx';
import Volunter from './Components/Volunter.jsx';
import VolunteerDashboard from './Components/VolunteerDashboard.jsx';
import NewsFeed from './Components/news.jsx';
import "leaflet/dist/leaflet.css";
import Ngo from './Components/ngo.jsx';
import NgoDashboard from './Components/ngoDashboard.jsx';
import Donation from "./Components/donation.jsx";
import Community from './Components/community.jsx';
import DonateMoney from './Components/DonateMoney.jsx';
import DonateGoods from './Components/DonateGoods.jsx';
import DonateMedical from './Components/DonateMedical.jsx';
import Schemes from './Components/schemes.jsx';
import Lost from './Components/Lost.jsx';
function App() {
  return (
     <Router>
        <Routes>
            <Route path="/"element={<LandingPage/>}/>
            <Route path="/victim" element={<Victim/>}/>
            <Route path="/volunter" element={<Volunter/>}/> 
            <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
            <Route path="/news"element={<NewsFeed/>}/>
            <Route path="/ngo"element={<Ngo/>}/>
            <Route path="/ngo-dashboard" element={<NgoDashboard/>}/>
            <Route path="/donation" element={<Donation/>}/>
            <Route path="/broadcasts" element={<Community/>}/>
            <Route path="/donate-money" element={<DonateMoney />} />
            <Route path="/donate-goods" element={<DonateGoods />} />
            <Route path="/donate-medical" element={<DonateMedical />} />
            <Route path="/schemes" element={<Schemes/>}/> 
            <Route path="/lostfound" element={<Lost/>}/> 
        </Routes>
     </Router>
  );
}

export default App;
