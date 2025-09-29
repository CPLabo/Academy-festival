import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import SystemStats from '../components/SystemStats';
import SessionList from '../components/SessionList';
import FestivalDataEditor from '../components/FestivalDataEditor';

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

const AdminPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            管理画面
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            チャットボットの設定と管理を行います。
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="管理機能タブ">
              <Tab 
                icon={<DashboardIcon />} 
                label="ダッシュボード" 
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
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" gutterBottom>
              システム統計
            </Typography>
            <SystemStats />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <SessionList />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <FestivalDataEditor />
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminPage;
