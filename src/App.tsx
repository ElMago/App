
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { AdminEvents } from './pages/AdminEvents';
import { AdminCars } from './pages/AdminCars';
import { EventsList } from './pages/EventsList';
import { EventDetails } from './pages/EventDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><EventsList /></ProtectedRoute>} />
          <Route path="/events/:eventId" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />

          <Route
            path="/admin/events"
            element={<ProtectedRoute requireAdmin><AdminEvents /></ProtectedRoute>}
          />
          <Route
            path="/admin/events/:eventId/cars"
            element={<ProtectedRoute requireAdmin><AdminCars /></ProtectedRoute>}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
