/**
 * 管理サービスクラス
 */

import axios from 'axios';
import { SystemStats, ChatSessionInfo, FestivalData, FestivalDataUpdate, SystemConfig, AdminResponse } from '../types/admin';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost';

class AdminService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * システム統計情報を取得
   */
  async getSystemStats(): Promise<SystemStats> {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/admin/stats`);
      return response.data;
    } catch (error) {
      console.error('システム統計取得エラー:', error);
      throw new Error('システム統計の取得に失敗しました');
    }
  }

  /**
   * チャットセッション一覧を取得
   */
  async getChatSessions(limit: number = 50): Promise<ChatSessionInfo[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/admin/sessions?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('セッション一覧取得エラー:', error);
      throw new Error('セッション一覧の取得に失敗しました');
    }
  }

  /**
   * 学園祭データを取得
   */
  async getFestivalData(): Promise<AdminResponse<FestivalData>> {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/admin/festival-data`);
      return response.data;
    } catch (error) {
      console.error('学園祭データ取得エラー:', error);
      throw new Error('学園祭データの取得に失敗しました');
    }
  }

  /**
   * 学園祭データを更新
   */
  async updateFestivalData(data: FestivalDataUpdate): Promise<AdminResponse<FestivalData>> {
    try {
      const response = await axios.put(`${this.baseURL}/api/v1/admin/festival-data`, data);
      return response.data;
    } catch (error) {
      console.error('学園祭データ更新エラー:', error);
      throw new Error('学園祭データの更新に失敗しました');
    }
  }

  /**
   * 古いセッションをクリア
   */
  async clearOldSessions(hours: number = 24): Promise<AdminResponse> {
    try {
      const response = await axios.delete(`${this.baseURL}/api/v1/admin/sessions/old?hours=${hours}`);
      return response.data;
    } catch (error) {
      console.error('セッションクリアエラー:', error);
      throw new Error('セッションクリアに失敗しました');
    }
  }

  /**
   * システム設定を取得
   */
  async getSystemConfig(): Promise<SystemConfig> {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/admin/config`);
      return response.data;
    } catch (error) {
      console.error('システム設定取得エラー:', error);
      throw new Error('システム設定の取得に失敗しました');
    }
  }

  /**
   * システム設定を更新
   */
  async updateSystemConfig(config: SystemConfig): Promise<AdminResponse> {
    try {
      const response = await axios.put(`${this.baseURL}/api/v1/admin/config`, config);
      return response.data;
    } catch (error) {
      console.error('システム設定更新エラー:', error);
      throw new Error('システム設定の更新に失敗しました');
    }
  }
}

export const adminService = new AdminService();
