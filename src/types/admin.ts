/**
 * 管理機能関連の型定義
 */

export interface SystemStats {
  total_sessions: number;
  total_messages: number;
  active_sessions: number;
  uptime: string;
  memory_usage: number;
  cpu_usage: number;
  gpu_usage?: number[];
  access_count: number;
}

export interface ChatSessionInfo {
  session_id: string;
  created_at: string;
  last_activity: string;
  message_count: number;
  is_active: boolean;
}

export interface FestivalData {
  schedule: Record<string, string>;
  locations: Record<string, string>;
  food: string[];
  access: Record<string, string>;
  notes: string[];
}

export interface FestivalDataUpdate {
  schedule?: Record<string, string>;
  locations?: Record<string, string>;
  food?: string[];
  access?: Record<string, string>;
  notes?: string[];
}

export interface SystemConfig {
  max_sessions: number;
  session_timeout: number;
  max_message_length: number;
  enable_logging: boolean;
  log_level: string;
}

export interface AdminResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
