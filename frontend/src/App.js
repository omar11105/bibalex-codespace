import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/candidateDashboard';
import ProblemPage from './pages/ProblemPage';
import AdminDashboard from './pages/adminDashboard';
import AddProblem from './pages/AddProblem';
import ViewAllProblems from './pages/ViewAllProblems';
import EditProblems from './pages/EditProblems';
import './App.css';

window.onunhandledrejection = function (e) {
  console.error("UNHANDLED PROMISE REJECTION:", e.reason);
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Define routes for the application */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route 
          path='/candidateDashboard' 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/adminDashboard' 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/problem/:id' 
          element={
            <ProtectedRoute>
              <ProblemPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/add-problem' 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AddProblem />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/view-all-problems' 
          element={
            <ProtectedRoute>
              <ViewAllProblems />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/edit-problems' 
          element={
            <ProtectedRoute requireAdmin={true}>
              <EditProblems />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
