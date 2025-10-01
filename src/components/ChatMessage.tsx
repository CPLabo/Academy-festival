/**
 * チャットメッセージコンポーネント
 */

import React from 'react';
import {
  Box,
  Typography,

} from '@mui/material';
import {
  Person as UserIcon,
} from '@mui/icons-material';
import { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        alignItems: 'flex-start',
      }}
    >
      {!isUser && (
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            mr: 1,
            width: 32,
            height: 32,
          }}
        >
          <BotIcon fontSize="small" />
        </Avatar>
      )}
      
      <Paper
        elevation={2}
        sx={{
          p: 2,
          maxWidth: '70%',
          bgcolor: isUser ? 'primary.main' : 'grey.100',
          color: isUser ? 'white' : 'text.primary',
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
        </Typography>
        
        {message.timestamp && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1,
              opacity: 0.7,
              fontSize: '0.75rem',
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString('ja-JP')}
          </Typography>
        )}
      </Paper>
      
      {isUser && (
        <Avatar
          sx={{
            bgcolor: 'secondary.main',
            ml: 1,
            width: 32,
            height: 32,
          }}
        >
          <UserIcon fontSize="small" />
        </Avatar>
      )}
    </Box>
  );
};

export default ChatMessage;
