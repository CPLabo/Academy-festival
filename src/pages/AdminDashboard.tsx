import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Alert,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  Psychology as PsychologyIcon,
  Description as DescriptionIcon,
  AdminPanelSettings as AdminIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import SystemStats from '../components/SystemStats';
import SessionList from '../components/SessionList';
import FestivalDataEditor from '../components/FestivalDataEditor';
import ModelManager from '../components/ModelManager';
import DocumentManager from '../components/DocumentManager';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={value === index} timeout={300}>
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {children}
          </Box>
        </Fade>
      )}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleModelChange = (modelName: string) => {
    console.log('Model changed to:', modelName);
  };

  const tabs = [
    { label: 'ダッシュボード', icon: <DashboardIcon />, component: <SystemStats /> },
    { label: 'データ管理', icon: <EditIcon />, component: <FestivalDataEditor /> },
    { label: 'RAG管理', icon: <DescriptionIcon />, component: <DocumentManager /> },
    { label: 'AI設定', icon: <PsychologyIcon />, component: <ModelManager onModelChange={handleModelChange} /> },
    { label: 'セッション管理', icon: <PeopleIcon />, component: <SessionList /> },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f7f7f8',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* ヘッダー */}
      <Box sx={{ 
        bgcolor: 'white', 
        borderBottom: '1px solid #e5e5e7',
        px: { xs: 2, md: 4 },
        py: 3,
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Box sx={{ 
          maxWidth: '1200px', 
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <AdminIcon sx={{ fontSize: 32, color: '#1976d2' }} />
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 600, 
              color: '#202123',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}>
              学園祭チャットボット管理画面
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>
              システムの監視、データ管理、AI設定、セッション管理を行います
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 管理者情報 */}
      <Box sx={{ 
        bgcolor: '#e3f2fd', 
        borderBottom: '1px solid #bbdefb',
        px: { xs: 2, md: 4 },
        py: 2
      }}>
        <Box sx={{ 
          maxWidth: '1200px', 
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <InfoIcon sx={{ fontSize: 20, color: '#1976d2' }} />
          <Typography variant="body2" sx={{ color: '#1565c0' }}>
            管理者モードでログイン中です。システムの設定変更には注意してください。
          </Typography>
        </Box>
      </Box>

      {/* メインコンテンツ */}
      <Box sx={{ 
        flex: 1,
        px: { xs: 2, md: 4 },
        py: 3
      }}>
        <Box sx={{ 
          maxWidth: '1200px', 
          mx: 'auto'
        }}>
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              border: '1px solid #e5e5e7',
              overflow: 'hidden'
            }}
          >
            {/* タブナビゲーション */}
            <Box sx={{ 
              borderBottom: '1px solid #e5e5e7',
              bgcolor: '#f9fafb'
            }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="管理機能タブ"
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 64,
                    textTransform: 'none',
                    fontWeight: 500,
                    color: '#6b7280',
                    '&.Mui-selected': {
                      color: '#1976d2',
                      bgcolor: 'white'
                    },
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.04)'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#1976d2',
                    height: 3
                  }
                }}
              >
                {tabs.map((tab, index) => (
                  <Tab 
                    key={index}
                    icon={tab.icon}
                    label={tab.label}
                    iconPosition="start"
                    sx={{ gap: 1 }}
                  />
                ))}
              </Tabs>
            </Box>

            {/* タブコンテンツ */}
            {tabs.map((tab, index) => (
              <TabPanel key={index} value={tabValue} index={index}>
                <Slide 
                  direction="left" 
                  in={tabValue === index} 
                  timeout={300}
                  mountOnEnter
                  unmountOnExit
                >
                  <Box>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 600,
                      color: '#202123',
                      mb: 1,
                      fontSize: { xs: '1.25rem', md: '1.5rem' }
                    }}>
                      {tab.label}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: '#6b7280',
                      mb: 3,
                      lineHeight: 1.6
                    }}>
                      {index === 0 && "システムの稼働状況、パフォーマンス、リソース使用量を監視します。"}
                      {index === 1 && "学園祭の開催日程、会場情報、模擬店情報などの基本データを編集します。"}
                      {index === 2 && "AIが参照する文書データをアップロード・管理し、RAG機能の精度を向上させます。"}
                      {index === 3 && "LLMモデルと埋め込みモデルの設定、状態確認を行います。"}
                      {index === 4 && "ユーザーのチャットセッション履歴を確認・管理します。"}
                    </Typography>
                    {tab.component}
                  </Box>
                </Slide>
              </TabPanel>
            ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
