import React from 'react';
import {
  Box,
  List,
  ListItem,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import { ChatMessage } from '../types/chat';
import ChatMessage from './ChatMessage';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ 
  messages, 
  isLoading = false 
}) => {
  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <List sx={{ p: 0 }}>
        {messages.map((message) => (
          <ListItem key={message.id} sx={{ display: 'block', px: 2, py: 1 }}>
            <ChatMessage message={message} />
          </ListItem>
        ))}
        
        {isLoading && (
          <ListItem sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                backgroundColor: 'grey.50'
              }}
            >
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                応答を生成中...
              </Typography>
            </Paper>
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default ChatMessageList;
