/**
 * チャットサービスクラス
 */

import axios from 'axios';
import { ChatRequest, ChatResponse, ChatMessage } from '../types/chat';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

class ChatService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * チャットメッセージを送信
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/v1/chat/session/message`, request, {
        timeout: 60000, // 60秒のタイムアウト
      });
      return response.data;
    } catch (error) {
      console.error('チャットメッセージ送信エラー:', error);
      throw new Error('メッセージの送信に失敗しました');
    }
  }

  /**
   * チャット履歴を取得
   */
  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/chat/session/${sessionId}`, {
        timeout: 30000, // 30秒のタイムアウト
      });
      return response.data.messages;
    } catch (error) {
      console.error('チャット履歴取得エラー:', error);
      throw new Error('チャット履歴の取得に失敗しました');
    }
  }

  /**
   * 新しいセッションを作成
   */
  async createSession(): Promise<string> {
    try {
      const response = await axios.post(`${this.baseURL}/api/v1/chat/session`, {}, {
        timeout: 30000, // 30秒のタイムアウト
      });
      return response.data.session_id;
    } catch (error) {
      console.error('セッション作成エラー:', error);
      throw new Error('セッションの作成に失敗しました');
    }
  }

  /**
   * ヘルスチェック
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/health`, {
        timeout: 10000, // 10秒のタイムアウト
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data.status === 'healthy';
    } catch (error) {
      console.error('ヘルスチェックエラー:', error);
      if (axios.isAxiosError(error)) {
        console.error('エラー詳細:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          }
        });
      }
      return false;
    }
  }
}

export const chatService = new ChatService();
