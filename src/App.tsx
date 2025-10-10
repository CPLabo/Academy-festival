import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import VisitorChatPage from './pages/VisitorChatPage';
import AdminDashboard from './pages/AdminDashboard';
import RAGPage from './pages/RAGPage';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';

function App() {
  return (
    <AuthProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            {/* 来場者向けチャット（公開） */}
            <Route path="/" element={<VisitorChatPage />} />
            <Route path="/chat" element={<VisitorChatPage />} />
            
            {/* 管理者向け機能（認証必須） */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/rag" 
              element={
                <ProtectedRoute>
                  <RAGPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Box>
      </Box>
    </AuthProvider>
  );
}

export default App;
