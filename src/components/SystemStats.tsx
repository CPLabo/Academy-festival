/**
 * システム統計コンポーネント
 */

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Chip,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  Message as MessageIcon,
  Schedule as ScheduleIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  Timer as TimerIcon,
  Refresh as RefreshIcon,
  Memory as GpuIcon,
  Visibility as VisibilityIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { adminService } from '../services/adminService';
import { SystemStats as SystemStatsType, SystemConfig } from '../types/admin';

const SystemStats: React.FC = () => {
  const [stats, setStats] = useState<SystemStatsType | null>(null);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const [statsData, configData] = await Promise.all([
        adminService.getSystemStats(),
        adminService.getSystemConfig()
      ]);
      setStats(statsData);
      setConfig(configData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadData(true);
  };

  const handleChatServiceToggle = async (enabled: boolean) => {
    if (!config) return;
    
    try {
      setUpdating(true);
      const updatedConfig = { ...config, chat_service_enabled: enabled };
      await adminService.updateSystemConfig(updatedConfig);
      setConfig(updatedConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : '設定の更新に失敗しました');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: '総セッション数',
      value: stats.total_sessions.toLocaleString(),
      icon: <PeopleIcon />,
      color: 'primary',
    },
    {
      title: '総メッセージ数',
      value: stats.total_messages.toLocaleString(),
      icon: <MessageIcon />,
      color: 'secondary',
    },
    {
      title: 'アクティブセッション',
      value: stats.active_sessions.toLocaleString(),
      icon: <ScheduleIcon />,
      color: 'success',
    },
    {
      title: 'アクセス数',
      value: stats.access_count.toLocaleString(),
      icon: <VisibilityIcon />,
      color: 'info',
    },
    {
      title: '稼働時間',
      value: stats.uptime,
      icon: <TimerIcon />,
      color: 'info',
    },
    {
      title: 'メモリ使用率',
      value: `${stats.memory_usage.toFixed(1)}%`,
      icon: <MemoryIcon />,
      color: 'warning',
    },
    {
      title: 'CPU使用率',
      value: `${stats.cpu_usage.toFixed(1)}%`,
      icon: <SpeedIcon />,
      color: 'error',
    },
    ...(stats.gpu_usage && stats.gpu_usage.length > 0 ? stats.gpu_usage.map((usage, index) => ({
      title: `GPU使用率 ${index + 1}`,
      value: `${usage.toFixed(1)}%`,
      icon: <GpuIcon />,
      color: 'secondary',
    })) : []),
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          システム統計
        </Typography>
        <Tooltip title="統計情報を更新">
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* チャットサービス制御 */}
      {config && (
        <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="h3">
                チャットサービス制御
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ChatIcon sx={{ color: config.chat_service_enabled ? 'success.main' : 'error.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    チャットサービス
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {config.chat_service_enabled ? '現在公開中です' : '現在停止中です'}
                  </Typography>
                </Box>
                <Chip
                  label={config.chat_service_enabled ? '公開中' : '停止中'}
                  color={config.chat_service_enabled ? 'success' : 'error'}
                  size="small"
                />
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.chat_service_enabled}
                    onChange={(e) => handleChatServiceToggle(e.target.checked)}
                    disabled={updating}
                    color="primary"
                  />
                }
                label={config.chat_service_enabled ? '公開' : '非公開'}
                labelPlacement="start"
              />
            </Box>
            {updating && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  設定を更新中...
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      color: `${card.color}.main`,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h6" component="div">
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" color={`${card.color}.main`}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SystemStats;
