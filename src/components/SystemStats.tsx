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
} from '@mui/material';
import {
  People as PeopleIcon,
  Message as MessageIcon,
  Schedule as ScheduleIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { adminService } from '../services/adminService';
import { SystemStats as SystemStatsType } from '../types/admin';

const SystemStats: React.FC = () => {
  const [stats, setStats] = useState<SystemStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getSystemStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '統計情報の取得に失敗しました');
    } finally {
      setLoading(false);
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
  ];

  return (
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
  );
};

export default SystemStats;
