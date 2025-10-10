import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import VisitorChatPage from './pages/VisitorChatPage';
import Header from './components/Header';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          {/* 来場者向けチャット（公開） */}
          <Route path="/" element={<VisitorChatPage />} />
          <Route path="/chat" element={<VisitorChatPage />} />
          <Route path="*" element={<VisitorChatPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
