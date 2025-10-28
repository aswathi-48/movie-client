
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import EntriesPage from './pages/EntriesPage';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';

// Protected route wrapper
function ProtectedRoute({ children }:any) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <BrowserRouter>
        <header className="bg-white shadow p-4">
          <h1 className="text-2xl font-semibold">Movie & TV Show Manager</h1>
        </header>

        <main className="p-4">
          <Routes>
            {/* Protected route */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <EntriesPage />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />

    </div>
  );
}
