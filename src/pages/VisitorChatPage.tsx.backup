import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  SmartToy as BotIcon,
} from '@mui/icons-material';
import { ChatMessage } from '../types/chat';

const VisitorChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // セッション初期化
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const response = await fetch('/api/v1/chat/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: 'visitor' }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setSessionId(data.session_id);
        }
      } catch (err) {
        setError('セッションの初期化に失敗しました');
      }
    };

    initializeSession();
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/chat/session/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: inputMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: ChatMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        setError('メッセージの送信に失敗しました');
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        {/* ヘッダー */}
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h5" component="h1" gutterBottom>
            学園祭案内チャット
          </Typography>
          <Typography variant="body2">
            学園祭について何でもお聞きください！
          </Typography>
        </Box>

        {/* メッセージ表示エリア */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <BotIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                学園祭について何でもお聞きください！
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                開催時間、場所、食べ物、イベントなど、お気軽にご質問ください。
              </Typography>
            </Box>
          )}

          <List>
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ 
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  mb: 1
                }}>
                  <Avatar sx={{ 
                    bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                    mx: 1
                  }}>
                    {message.role === 'user' ? <PersonIcon /> : <BotIcon />}
                  </Avatar>
                  <Box sx={{ 
                    maxWidth: '70%',
                    bgcolor: message.role === 'user' ? 'primary.light' : 'grey.100',
                    color: message.role === 'user' ? 'white' : 'text.primary',
                    p: 2,
                    borderRadius: 2,
                    wordBreak: 'break-word'
                  }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      display: 'block', 
                      mt: 1, 
                      opacity: 0.7 
                    }}>
                      {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'now'}
                    </Typography>
                  </Box>
                </ListItem>
                {index < messages.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                応答を生成中...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        {/* 入力エリア */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="学園祭について質問してください..."
              disabled={isLoading}
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{ minWidth: 100 }}
            >
              <SendIcon />
            </Button>
          </Box>
          
          {/* サンプル質問 */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              よくある質問:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[
                '開催時間は？',
                '会場はどこ？',
                '食べ物はある？',
                'アクセス方法は？'
              ].map((question) => (
                <Chip
                  key={question}
                  label={question}
                  size="small"
                  onClick={() => setInputMessage(question)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default VisitorChatPage;
