/**
 * モデル管理コンポーネント
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  SwapHoriz,
  Info,
  Memory,
  Schedule
} from '@mui/icons-material';
import { ModelInfo, ModelStatus } from '../types/llm';
import { llmService } from '../services/llmService';

interface ModelManagerProps {
  onModelChange?: (modelName: string) => void;
}

const ModelManager: React.FC<ModelManagerProps> = ({ onModelChange }) => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [modelStatus, setModelStatus] = useState<ModelStatus[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [modelsData, statusData, currentData] = await Promise.all([
        llmService.getAvailableModels(),
        llmService.getModelStatus(),
        llmService.getCurrentModel()
      ]);
      
      setModels(modelsData);
      setModelStatus(statusData);
      setCurrentModel(currentData.current_model);
    } catch (err) {
      setError('データの読み込みに失敗しました');
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadModel = async (modelName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await llmService.loadModel(modelName);
      setSuccess(`モデル ${modelName} を読み込みました`);
      await loadData();
      
      if (onModelChange) {
        onModelChange(modelName);
      }
    } catch (err) {
      setError(`モデル ${modelName} の読み込みに失敗しました`);
      console.error('Load model error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnloadModel = async (modelName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await llmService.unloadModel(modelName);
      setSuccess(`モデル ${modelName} をアンロードしました`);
      await loadData();
    } catch (err) {
      setError(`モデル ${modelName} のアンロードに失敗しました`);
      console.error('Unload model error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchModel = async (modelName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await llmService.switchModel(modelName);
      setSuccess(`モデルを ${modelName} に切り替えました`);
      setCurrentModel(modelName);
      
      if (onModelChange) {
        onModelChange(modelName);
      }
    } catch (err) {
      setError(`モデル切り替えに失敗しました`);
      console.error('Switch model error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getModelStatus = (modelName: string): ModelStatus | undefined => {
    return modelStatus.find(status => status.model_name === modelName);
  };

  const formatMemoryUsage = (usage: number): string => {
    if (usage < 1024) {
      return `${usage.toFixed(1)} MB`;
    } else {
      return `${(usage / 1024).toFixed(1)} GB`;
    }
  };

  const formatLastUsed = (lastUsed?: string): string => {
    if (!lastUsed) return '未使用';
    
    const date = new Date(lastUsed);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return '今';
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}時間前`;
    return date.toLocaleDateString();
  };

  if (loading && models.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        AIモデル管理
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={2}>
        {models.map((model) => {
          const status = getModelStatus(model.name);
          const isCurrent = model.name === currentModel;
          const isLoaded = status?.is_loaded || false;
          
          return (
            <Grid item xs={12} md={6} lg={4} key={model.name}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: isCurrent ? 2 : 1,
                  borderColor: isCurrent ? 'primary.main' : 'divider'
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" component="div">
                      {model.display_name}
                    </Typography>
                    {isCurrent && (
                      <Chip 
                        label="現在" 
                        color="primary" 
                        size="small"
                      />
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {model.description}
                  </Typography>
                  
                  <Box display="flex" gap={1} mb={2}>
                    <Chip 
                      label={model.size} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={model.language} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={isLoaded ? '読み込み済み' : '未読み込み'} 
                      size="small" 
                      color={isLoaded ? 'success' : 'default'}
                    />
                  </Box>

                  {status && (
                    <Box mb={2}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Memory fontSize="small" />
                        <Typography variant="body2">
                          メモリ: {formatMemoryUsage(status.memory_usage)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Schedule fontSize="small" />
                        <Typography variant="body2">
                          最終使用: {formatLastUsed(status.last_used)}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {status?.error_message && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {status.error_message}
                    </Alert>
                  )}

                  <Box display="flex" gap={1} flexWrap="wrap">
                    {!isLoaded ? (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlayArrow />}
                        onClick={() => handleLoadModel(model.name)}
                        disabled={loading}
                      >
                        読み込み
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Stop />}
                        onClick={() => handleUnloadModel(model.name)}
                        disabled={loading}
                      >
                        アンロード
                      </Button>
                    )}
                    
                    {isLoaded && !isCurrent && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<SwapHoriz />}
                        onClick={() => handleSwitchModel(model.name)}
                        disabled={loading}
                      >
                        切り替え
                      </Button>
                    )}
                    
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Info />}
                      onClick={() => {
                        setSelectedModel(model);
                        setDialogOpen(true);
                      }}
                    >
                      詳細
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* モデル詳細ダイアログ */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedModel?.display_name} の詳細
        </DialogTitle>
        <DialogContent>
          {selectedModel && (
            <Box>
              <Typography variant="body1" paragraph>
                <strong>説明:</strong> {selectedModel.description}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>サイズ:</strong> {selectedModel.size}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>言語:</strong> {selectedModel.language}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>利用可能:</strong> {selectedModel.is_available ? 'はい' : 'いいえ'}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                モデル状態
              </Typography>
              {(() => {
                const status = getModelStatus(selectedModel.name);
                return status ? (
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="読み込み状態" 
                        secondary={status.is_loaded ? '読み込み済み' : '未読み込み'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="メモリ使用量" 
                        secondary={formatMemoryUsage(status.memory_usage)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="最終使用時刻" 
                        secondary={formatLastUsed(status.last_used)}
                      />
                    </ListItem>
                    {status.error_message && (
                      <ListItem>
                        <ListItemText 
                          primary="エラーメッセージ" 
                          secondary={status.error_message}
                        />
                      </ListItem>
                    )}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    状態情報がありません
                  </Typography>
                );
              })()}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModelManager;
