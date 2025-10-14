
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



