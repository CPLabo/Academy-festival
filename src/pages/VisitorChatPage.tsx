import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  Paper,
  Fade,
  Slide,
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  SmartToy as BotIcon,
  Info as InfoIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { ChatMessage } from '../types/chat';

const VisitorChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // メッセージが追加されたらスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    setShowWelcome(false);

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

  const handleSampleQuestion = (question: string) => {
    setInputMessage(question);
    setShowWelcome(false);
  };

  const sampleQuestions = [
    '開催時間は？',
    '会場はどこ？',
    '食べ物はある？',
    'アクセス方法は？',
    '駐車場はある？',
    '雨天時はどうなる？',
    '入場料はかかる？',
    'おすすめのイベントは？'
  ];

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#f7f7f8',
      overflow: 'hidden'
    }}>
      {/* ヘッダー */}
      <Box sx={{ 
        bgcolor: '#1976d2', 
        borderBottom: '1px solid #1565c0',
        px: { xs: 2, md: 4 },
        py: 2,
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Box sx={{ 
          maxWidth: '800px', 
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              color: 'white',
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}>
              学園祭案内チャット
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              学園祭について何でもお聞きください！
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 履歴保存の注意 */}
      {showDisclaimer && (
        <Box sx={{ 
          bgcolor: '#fef3c7', 
          borderBottom: '1px solid #fbbf24',
          px: { xs: 2, md: 4 },
          py: 1
        }}>
          <Box sx={{ 
            maxWidth: '800px', 
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <InfoIcon sx={{ fontSize: 16, color: '#d97706' }} />
            <Typography variant="caption" sx={{ color: '#92400e', flex: 1 }}>
              チャット履歴は自動的に保存されます。個人情報は入力しないようご注意ください。
            </Typography>
            <Button
              size="small"
              onClick={() => setShowDisclaimer(false)}
              sx={{
                minWidth: 'auto',
                p: 0.5,
                color: '#92400e',
                '&:hover': {
                  bgcolor: 'rgba(146, 64, 14, 0.1)'
                }
              }}
            >
              ×
            </Button>
          </Box>
        </Box>
      )}

      {/* メッセージ表示エリア */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        px: { xs: 2, md: 4 },
        py: 2
      }}>
        <Box sx={{ 
          maxWidth: '800px', 
          mx: 'auto',
          minHeight: '100%'
        }}>
          {/* ウェルカムメッセージ */}
          {showWelcome && messages.length === 0 && (
            <Fade in={showWelcome}>
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                px: 2
              }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 600,
                  color: '#202123',
                  mb: 2,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}>
                  学園祭について何でもお聞きください！
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#6b7280',
                  mb: 4,
                  maxWidth: '600px',
                  mx: 'auto'
                }}>
                  開催時間、場所、食べ物、イベントなど、お気軽にご質問ください。
                </Typography>

                {/* よくある質問 */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ 
                    mb: 2, 
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}>
                    <HelpIcon sx={{ fontSize: 20 }} />
                    よくある質問
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1.5,
                    justifyContent: 'center',
                    maxWidth: '600px',
                    mx: 'auto'
                  }}>
                    {sampleQuestions.map((question, index) => (
                      <Slide 
                        key={question} 
                        direction="up" 
                        in={showWelcome} 
                        timeout={300 + index * 100}
                      >
                        <Chip
                          label={question}
                          onClick={() => handleSampleQuestion(question)}
                          sx={{ 
                            cursor: 'pointer',
                            bgcolor: 'white',
                            border: '1px solid #e5e5e7',
                            '&:hover': {
                              bgcolor: '#f3f4f6',
                              borderColor: '#d1d5db'
                            }
                          }}
                        />
                      </Slide>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Fade>
          )}

          {/* メッセージリスト */}
          <List sx={{ py: 0 }}>
            {messages.map((message, index) => (
              <ListItem 
                key={index}
                sx={{ 
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  mb: 2,
                  px: 0
                }}
              >
                <Avatar sx={{ 
                  bgcolor: message.role === 'user' ? '#1976d2' : '#6b7280',
                  mx: 1,
                  width: { xs: 32, md: 40 },
                  height: { xs: 32, md: 40 }
                }}>
                  {message.role === 'user' ? <PersonIcon /> : <BotIcon />}
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{ 
                    maxWidth: { xs: '75%', md: '70%' },
                    bgcolor: message.role === 'user' ? '#1976d2' : 'white',
                    color: message.role === 'user' ? 'white' : '#374151',
                    p: 2,
                    borderRadius: 2,
                    wordBreak: 'break-word',
                    border: message.role === 'assistant' ? '1px solid #e5e5e7' : 'none'
                  }}
                >
                  <Typography variant="body1" sx={{ 
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6
                  }}>
                    {message.content}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    display: 'block', 
                    mt: 1, 
                    opacity: 0.7,
                    fontSize: '0.75rem'
                  }}>
                    {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'now'}
                  </Typography>
                </Paper>
              </ListItem>
            ))}
          </List>

          {/* ローディング表示 */}
          {isLoading && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              mb: 2,
              px: 0
            }}>
              <Avatar sx={{ 
                bgcolor: '#6b7280',
                mx: 1,
                width: { xs: 32, md: 40 },
                height: { xs: 32, md: 40 }
              }}>
                <BotIcon />
              </Avatar>
              <Paper
                elevation={0}
                sx={{ 
                  bgcolor: 'white',
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid #e5e5e7',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <CircularProgress size={16} />
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  応答を生成中...
                </Typography>
              </Paper>
            </Box>
          )}

          {/* エラー表示 */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* 入力エリア - 下部固定 */}
      <Box sx={{ 
        bgcolor: 'white',
        borderTop: '1px solid #e5e5e7',
        px: { xs: 2, md: 4 },
        py: 2,
        position: 'sticky',
        bottom: 0
      }}>
        <Box sx={{ 
          maxWidth: '800px', 
          mx: 'auto'
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            alignItems: 'flex-end'
          }}>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: '#f9fafb',
                  '&:hover': {
                    bgcolor: '#f3f4f6'
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white'
                  }
                }
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{ 
                minWidth: 48,
                height: 40,
                borderRadius: 3,
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0'
                },
                '&:disabled': {
                  bgcolor: '#d1d5db'
                }
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VisitorChatPage;
