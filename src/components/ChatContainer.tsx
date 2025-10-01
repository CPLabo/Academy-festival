/**
 * チャットコンテナコンポーネント
 */

import React, { useState, useEffect, useRef } from 'react';
import {

  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { chatService } from '../services/chatService';
import { ChatMessage as ChatMessageType } from '../types/chat';

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自動スクロール
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初期化
  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // ヘルスチェック
      const healthy = await chatService.healthCheck();
      if (!healthy) {
        throw new Error('サーバーに接続できません');
      }
      
      setIsConnected(true);
      
      // 新しいセッションを作成
      const newSessionId = await chatService.createSession();
      setSessionId(newSessionId);
      
      // ウェルカムメッセージを追加
      const welcomeMessage: ChatMessageType = {
        id: 'welcome',
        content: 'こんにちは！学園祭案内チャットボットです。学園祭に関する質問を日本語でお気軽にお聞きください。スケジュール、場所、出展、アクセス、飲食、注意事項などについてお答えします。',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
      
    } catch (err) {
      console.error('チャット初期化エラー:', err);
      setError(err instanceof Error ? err.message : 'チャットの初期化に失敗しました');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!sessionId || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      // ユーザーメッセージを追加
      const userMessage: ChatMessageType = {
        id: Date.now().toString(),
        content: message,
        role: 'user',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);

      // サーバーにメッセージを送信
      const response = await chatService.sendMessage({
        message,
        session_id: sessionId,
      });

      // アシスタントのレスポンスを追加
      const assistantMessage: ChatMessageType = {
        id: Date.now().toString() + '_response',
        content: response.message,
        role: 'assistant',
        timestamp: response.timestamp,
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error('メッセージ送信エラー:', err);
      setError(err instanceof Error ? err.message : 'メッセージの送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    initializeChat();
  };

  if (isLoading && messages.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          チャットを初期化中...
        </Typography>
      </Box>
    );
  }

  if (error && !isConnected) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRetry}
        >
          再接続
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* メッセージ表示エリア */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          minHeight: 400,
          maxHeight: 600,
        }}
      >
        {messages.map((message) => (
          <ChatMessage key={message.id || Math.random()} message={message} />
        ))}
        
        {isLoading && messages.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              入力中...
            </Typography>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* エラー表示 */}
      {error && isConnected && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {/* 入力エリア */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading || !isConnected}
          placeholder={isConnected ? "メッセージを入力してください..." : "接続中..."}
        />
      </Box>
    </Box>
  );
};

export default ChatContainer;
