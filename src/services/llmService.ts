/**
 * LLMサービスクラス
 */

import axios from 'axios';
import { ModelInfo, ModelStatus, LLMRequest, LLMResponse, CurrentModel } from '../types/llm';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

class LLMService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * 利用可能なモデル一覧を取得
   */
  async getAvailableModels(): Promise<ModelInfo[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/llm/models`);
      return response.data;
    } catch (error) {
      console.error('モデル一覧取得エラー:', error);
      throw new Error('モデル一覧の取得に失敗しました');
    }
  }

  /**
   * モデル状態を取得
   */
  async getModelStatus(): Promise<ModelStatus[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/llm/status`);
      return response.data;
    } catch (error) {
      console.error('モデル状態取得エラー:', error);
      throw new Error('モデル状態の取得に失敗しました');
    }
  }

  /**
   * モデルを読み込み
   */
  async loadModel(modelName: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(`${this.baseURL}/api/v1/llm/load/${modelName}`);
      return response.data;
    } catch (error) {
      console.error('モデル読み込みエラー:', error);
      throw new Error('モデルの読み込みに失敗しました');
    }
  }

  /**
   * モデルをアンロード
   */
  async unloadModel(modelName: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(`${this.baseURL}/api/v1/llm/unload/${modelName}`);
      return response.data;
    } catch (error) {
      console.error('モデルアンロードエラー:', error);
      throw new Error('モデルのアンロードに失敗しました');
    }
  }

  /**
   * モデルを切り替え
   */
  async switchModel(modelName: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(`${this.baseURL}/api/v1/llm/switch/${modelName}`);
      return response.data;
    } catch (error) {
      console.error('モデル切り替えエラー:', error);
      throw new Error('モデルの切り替えに失敗しました');
    }
  }

  /**
   * LLMレスポンスを生成
   */
  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/v1/llm/generate`, request);
      return response.data;
    } catch (error) {
      console.error('レスポンス生成エラー:', error);
      throw new Error('レスポンスの生成に失敗しました');
    }
  }

  /**
   * 現在のモデルを取得
   */
  async getCurrentModel(): Promise<CurrentModel> {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/llm/current`);
      return response.data;
    } catch (error) {
      console.error('現在のモデル取得エラー:', error);
      throw new Error('現在のモデルの取得に失敗しました');
    }
  }
}

export const llmService = new LLMService();
