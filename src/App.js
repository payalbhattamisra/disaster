import './Components/LandingPage.jsx'
import './App.css'; 
import {BrowserRouter as Router,Routes,Route}from 'react-router-dom';
import Victim from './Components/victim.jsx';
import LandingPage from './Components/LandingPage.jsx';

function App() {
  return (
     <Router>
        <Routes>
            <Route path="/"element={<LandingPage/>}/>
            <Route path="/victim" element={<Victim/>}/>
        </Routes>
     </Router>
  );
}

export default App;
