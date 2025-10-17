import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ChatMessage as ChatMessageType } from '../types/chat';
import { chatService } from '../services/chatService';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // ヘルスチェック
      const isHealthy = await chatService.healthCheck();
      if (!isHealthy) {
        throw new Error('サーバーに接続できません');
      }

      // セッション作成
      const newSessionId = await chatService.createSession();
      setSessionId(newSessionId);
      setIsConnected(true);

      // 初期メッセージを追加
      const welcomeMessage: ChatMessageType = {
        id: 'welcome',
        content: 'こんにちは！学園祭案内AIアシスタントです。何かお手伝いできることはありますか？',
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
        content: response.response,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error('メッセージ送信エラー:', err);
      setError(err instanceof Error ? err.message : 'メッセージの送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !sessionId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ヘッダー */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="div">
          学園祭RAGチャットボット（試験版）
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isConnected ? '接続中' : '接続エラー'}
        </Typography>
      </Box>

      {/* エラー表示 */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ m: 2 }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* メッセージ一覧 */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <ChatMessageList messages={messages} isLoading={isLoading} />
      </Box>

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
