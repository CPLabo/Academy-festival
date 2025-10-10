import React, { useState } from 'react';
import {
  Box,
  Paper,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  Psychology as PsychologyIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
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
      {/* セキュリティ警告 */}
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          管理者専用画面
        </Typography>
        この画面は管理者のみがアクセス可能です。機密情報の取り扱いにご注意ください。
      </Alert>

      <Paper elevation={3}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            学園祭チャットボット管理画面
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            システムの監視、設定、管理を行います。
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="管理機能タブ">
              <Tab 
                icon={<DashboardIcon />} 
                label="ダッシュボード" 
                iconPosition="start"
              />
              <Tab 
                icon={<PsychologyIcon />} 
                label="AIモデル管理" 
                iconPosition="start"
              />
              <Tab 
                icon={<PeopleIcon />} 
                label="セッション管理" 
                iconPosition="start"
              />
              <Tab 
                icon={<EditIcon />} 
                label="データ編集" 
                iconPosition="start"
              />
              <Tab 
                icon={<DescriptionIcon />} 
                label="ドキュメント管理" 
                iconPosition="start"
              />
              <Tab 
                icon={<SecurityIcon />} 
                label="セキュリティ設定" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" gutterBottom>
              システム統計
            </Typography>
            <SystemStats />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" gutterBottom>
              AIモデル管理
            </Typography>
            <ModelManager onModelChange={handleModelChange} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" gutterBottom>
              セッション管理
            </Typography>
            <SessionList />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h5" gutterBottom>
              学園祭データ編集
            </Typography>
            <FestivalDataEditor />
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Typography variant="h5" gutterBottom>
              ドキュメント管理
            </Typography>
            <DocumentManager />
          </TabPanel>

          <TabPanel value={tabValue} index={5}>
            <Typography variant="h5" gutterBottom>
              セキュリティ設定
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      アクセス制御
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      管理者画面へのアクセス制御設定
                    </Typography>
                    <Button variant="outlined" size="small">
                      設定を開く
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      ログ監視
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      システムログとアクセスログの監視
                    </Typography>
                    <Button variant="outlined" size="small">
                      ログを表示
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
