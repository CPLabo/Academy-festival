import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import VisitorChatPage from './pages/VisitorChatPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';

function App() {
  return (
    <AuthProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Routes>
          {/* 来場者向けチャット（公開） - ヘッダーなし */}
          <Route path="/" element={<VisitorChatPage />} />
          <Route path="/chat" element={<VisitorChatPage />} />
          
          {/* 管理者向け機能（認証必須・隠しURL） - ヘッダーあり */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <>
                <Header />
                <Box component="main" sx={{ flexGrow: 1 }}>
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                </Box>
              </>
            } 
          />
          
          {/* その他のURLは来場者向けチャットにリダイレクト */}
          <Route path="*" element={<VisitorChatPage />} />
        </Routes>
      </Box>
    </AuthProvider>
  );
}

export default App;
