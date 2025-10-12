/**
 * セッション一覧コンポーネント
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { adminService } from '../services/adminService';
import { ChatSessionInfo } from '../types/admin';

const SessionList: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [csvDownloading, setCsvDownloading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getChatSessions(100);
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'セッション一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleClearOldSessions = async () => {
    try {
      await adminService.clearOldSessions(24);
      setClearDialogOpen(false);
      loadSessions(); // 一覧を再読み込み
    } catch (err) {
      setError(err instanceof Error ? err.message : 'セッションクリアに失敗しました');
    }
  };

  const handleDownloadCSV = async () => {
    try {
      setCsvDownloading(true);
      await adminService.downloadSessionsCSV();
      setSnackbarMessage('CSVファイルのダウンロードが開始されました');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : 'CSVダウンロードに失敗しました');
      setSnackbarOpen(true);
    } finally {
      setCsvDownloading(false);
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">チャットセッション一覧</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadCSV}
            disabled={csvDownloading}
          >
            {csvDownloading ? 'ダウンロード中...' : 'CSVダウンロード'}
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => setClearDialogOpen(true)}
          >
            古いセッションをクリア
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>セッションID</TableCell>
              <TableCell>作成日時</TableCell>
              <TableCell>最終活動</TableCell>
              <TableCell>メッセージ数</TableCell>
              <TableCell>ステータス</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.session_id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {session.session_id.substring(0, 8)}...
                  </Typography>
                </TableCell>
                <TableCell>
                  {format(new Date(session.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                </TableCell>
                <TableCell>
                  {format(new Date(session.last_activity), 'yyyy/MM/dd HH:mm', { locale: ja })}
                </TableCell>
                <TableCell>{session.message_count}</TableCell>
                <TableCell>
                  <Chip
                    label={session.is_active ? 'アクティブ' : '非アクティブ'}
                    color={session.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>古いセッションのクリア</DialogTitle>
        <DialogContent>
          <Typography>
            24時間以上古いセッションを削除します。この操作は取り消せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleClearOldSessions} color="warning">
            削除
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default SessionList;
