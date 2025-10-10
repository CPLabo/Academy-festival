import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Tooltip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import DocumentUpload from './DocumentUpload';

interface Document {
  id: string;
  text: string;
  full_text: string;
  metadata: {
    title?: string;
    source?: string;
    timestamp?: string;
    file_type?: string;
  };
}

interface DocumentManagerProps {}

const DocumentManager: React.FC<DocumentManagerProps> = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editForm, setEditForm] = useState({
    title: '',
    source: '',
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // ドキュメント一覧を取得
  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/rag/documents`);
      if (!response.ok) {
        throw new Error('ドキュメントの取得に失敗しました');
      }
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // ドキュメントを削除
  const deleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/rag/documents`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_ids: [documentId],
        }),
      });

      if (!response.ok) {
        throw new Error('ドキュメントの削除に失敗しました');
      }

      setSuccess('ドキュメントを削除しました');
      setDeleteDialogOpen(false);
      setSelectedDocument(null);
      fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました');
    }
  };

  // ドキュメントを更新
  const updateDocument = async () => {
    if (!selectedDocument) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/rag/documents/${selectedDocument.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('ドキュメントの更新に失敗しました');
      }

      setSuccess('ドキュメントを更新しました');
      setEditDialogOpen(false);
      setSelectedDocument(null);
      fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    }
  };

  // 編集ダイアログを開く
  const handleEditClick = (document: Document) => {
    setSelectedDocument(document);
    setEditForm({
      title: document.metadata.title || '',
      source: document.metadata.source || '',
    });
    setEditDialogOpen(true);
  };

  // 削除ダイアログを開く
  const handleDeleteClick = (document: Document) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };

  // フィルタリングされたドキュメント
  const filteredDocuments = documents.filter(doc =>
    doc.metadata.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.metadata.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          ドキュメント管理
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchDocuments}
            sx={{ mr: 1 }}
          >
            更新
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadDialogOpen(true)}
          >
            ドキュメント追加
          </Button>
        </Box>
      </Box>

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

      {/* 検索バー */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="ドキュメントを検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      {/* ドキュメント一覧 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredDocuments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            ドキュメントがありません
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            新しいドキュメントをアップロードしてください
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredDocuments.map((doc) => (
            <Grid item xs={12} md={6} lg={4} key={doc.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {doc.metadata.title || '無題のドキュメント'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {doc.text.substring(0, 100)}...
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {doc.metadata.source && (
                      <Chip label={doc.metadata.source} size="small" />
                    )}
                    {doc.metadata.file_type && (
                      <Chip label={doc.metadata.file_type} size="small" variant="outlined" />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    ID: {doc.id}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Tooltip title="編集">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(doc)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="削除">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(doc)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 編集ダイアログ */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>ドキュメント編集</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="タイトル"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="ソース"
            value={editForm.source}
            onChange={(e) => setEditForm({ ...editForm, source: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>キャンセル</Button>
          <Button onClick={updateDocument} variant="contained">
            更新
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>ドキュメント削除</DialogTitle>
        <DialogContent>
          <Typography>
            このドキュメントを削除しますか？この操作は元に戻せません。
          </Typography>
          {selectedDocument && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {selectedDocument.metadata.title || '無題のドキュメント'}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button
            onClick={() => selectedDocument && deleteDocument(selectedDocument.id)}
            color="error"
            variant="contained"
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>

      {/* アップロードダイアログ */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>ドキュメントアップロード</DialogTitle>
        <DialogContent>
          <DocumentUpload
            onUploadSuccess={() => {
              setUploadDialogOpen(false);
              fetchDocuments();
            }}
            onUploadError={(error) => setError(error)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentManager;
