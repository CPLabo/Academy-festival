// デバッグ用のユーティリティ
export const debugInfo = {
  apiUrl: process.env.REACT_APP_API_URL || '',
  environment: process.env.NODE_ENV || 'development',
  timestamp: new Date().toISOString()
};

export const logApiError = (error: any, endpoint: string) => {
  console.error('API Error:', {
    endpoint,
    error: error.message,
    status: error.response?.status,
    data: error.response?.data,
    debugInfo
  });
};
