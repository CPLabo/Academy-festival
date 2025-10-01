/**
 * LLM関連の型定義
 */

export interface ModelInfo {
  name: string;
  display_name: string;
  description: string;
  size: string;
  language: string;
  is_available: boolean;
}

export interface ModelStatus {
  model_name: string;
  is_loaded: boolean;
  memory_usage: number;
  last_used?: string;
  error_message?: string;
}

export interface LLMRequest {
  prompt: string;
  model_name?: string;
  max_length?: number;
  temperature?: number;
  system_prompt?: string;
}

export interface LLMResponse {
  response: string;
  model_name: string;
  tokens_used: number;
  processing_time: number;
  metadata?: Record<string, any>;
}

export interface ModelConfig {
  model_name: string;
  model_path: string;
  max_length: number;
  temperature: number;
  top_p: number;
  do_sample: boolean;
  device: string;
}

export interface CurrentModel {
  current_model: string;
  is_loaded: boolean;
}
