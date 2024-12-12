import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Homepage from './pages/Homepage';
import MQTTpage from './pages/MQTTPage'; 
import Login from './pages/Signin' ;
import ProtectedRoute from './pages/ProtectedRoute';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/motor" element={<Homepage />} />
          <Route path="/sign-in" element={<Login />} />

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/mqtt/:id" element={<MQTTpage />} />
      </Route>

         


        </Routes>
      </div>
    </Router>
  );
}






export default App;
