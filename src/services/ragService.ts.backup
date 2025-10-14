/**
 * RAG機能のAPIサービス
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface Document {
  id: string;
  text: string;
  metadata: {
    source: string;
    title: string;
    timestamp: string;
    file_type: string;
  };
  distance?: number;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  uploaded_files: Array<{
    filename: string;
    size: number;
    content_type: string;
  }>;
  document_count: number;
}

export interface SearchResponse {
  success: boolean;
  query: string;
  results: Document[];
  total_results: number;
}

export interface RAGResponse {
  success: boolean;
  query: string;
  context: string;
  prompt: string;
  relevant_documents: Document[];
  context_length: number;
}

export interface CollectionInfo {
  success: boolean;
  collection_name: string;
  document_count: number;
  model_name: string;
}

export interface EmbeddingStatus {
  success: boolean;
  is_loaded: boolean;
  model_name: string | null;
  collection_name: string;
}

class RAGService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/v1/rag`;
  }

  /**
   * ドキュメントをアップロード
   */
  async uploadDocuments(formData: FormData): Promise<UploadResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * ドキュメントを検索
   */
  async searchDocuments(query: string, nResults: number = 5): Promise<SearchResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/documents/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          n_results: nResults,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  /**
   * RAGクエリを実行
   */
  async ragQuery(query: string, nResults: number = 5): Promise<RAGResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          n_results: nResults,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('RAG query error:', error);
      throw error;
    }
  }

  /**
   * コレクション情報を取得
   */
  async getCollectionInfo(): Promise<CollectionInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/collection/info`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Collection info error:', error);
      throw error;
    }
  }

  /**
   * 埋め込みモデルの状態を取得
   */
  async getEmbeddingStatus(): Promise<EmbeddingStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/embedding/status`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Embedding status error:', error);
      throw error;
    }
  }

  /**
   * 埋め込みモデルを読み込み
   */
  async loadEmbeddingModel(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/embedding/load`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Load embedding model error:', error);
      throw error;
    }
  }

  /**
   * コレクションを削除
   */
  async deleteCollection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/collection`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete collection error:', error);
      throw error;
    }
  }
}

export const ragService = new RAGService();
