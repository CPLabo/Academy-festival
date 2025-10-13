import React, { useState } from 'react';
import {
  Box,
  Paper,
  Container,
  Typography,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  Psychology as PsychologyIcon,
  Description as DescriptionIcon,
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
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleModelChange = (modelName: string) => {
    console.log('Model changed to:', modelName);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* 管理者情報 */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          管理者画面
        </Typography>
        システムの監視、データ管理、AI設定を行います。
      </Alert>

      <Paper elevation={3}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            学園祭チャットボット管理画面
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            システムの監視、データ管理、AI設定、セッション管理を行います。
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="管理機能タブ">
              <Tab 
                icon={<DashboardIcon />} 
                label="ダッシュボード" 
                iconPosition="start"
              />
              <Tab 
                icon={<EditIcon />} 
                label="データ管理" 
                iconPosition="start"
              />
              <Tab 
                icon={<DescriptionIcon />} 
                label="RAG管理" 
                iconPosition="start"
              />
              <Tab 
                icon={<PsychologyIcon />} 
                label="AI設定" 
                iconPosition="start"
              />
              <Tab 
                icon={<PeopleIcon />} 
                label="セッション管理" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" gutterBottom>
              システム統計
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              システムの稼働状況、パフォーマンス、リソース使用量を監視します。
            </Typography>
            <SystemStats />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" gutterBottom>
              学園祭データ管理
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              学園祭の開催日程、会場情報、模擬店情報などの基本データを編集します。
            </Typography>
            <FestivalDataEditor />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" gutterBottom>
              RAGドキュメント管理
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              AIが参照する文書データをアップロード・管理し、RAG機能の精度を向上させます。
            </Typography>
            <DocumentManager />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h5" gutterBottom>
              AIモデル設定
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              LLMモデルと埋め込みモデルの設定、状態確認を行います。
            </Typography>
            <ModelManager onModelChange={handleModelChange} />
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Typography variant="h5" gutterBottom>
              セッション管理
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              ユーザーのチャットセッション履歴を確認・管理します。
            </Typography>
            <SessionList />
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
