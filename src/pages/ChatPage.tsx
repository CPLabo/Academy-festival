import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import ChatContainer from '../components/ChatContainer';

const ChatPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, height: '80vh' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            学園祭案内チャット（軽量版）
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            学園祭に関する質問を日本語でお気軽にお聞きください。
            スケジュール、場所、出展、アクセス、飲食、注意事項などについてお答えします。
          </Typography>
        </Box>
        
        <ChatContainer />
      </Paper>
    </Container>
  );
};

export default ChatPage;
