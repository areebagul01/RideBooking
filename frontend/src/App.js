import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import BookRide from './pages/BookRide';
import Profile from './pages/Profile';

function AppRoutes() {
  const { user } = useContext(AuthContext);
  
  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route path="/book-ride" element={user?.type === 'passenger' ? <BookRide /> : <Navigate to="/" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/" element={user ? 
        (user.type === 'passenger' ? 
          <PassengerDashboard /> : 
          <DriverDashboard />) : 
        <Navigate to="/login" />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main>
            <AppRoutes />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;