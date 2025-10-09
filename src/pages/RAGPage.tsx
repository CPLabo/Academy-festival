import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import {
  Upload as UploadIcon,
  Search as SearchIcon,
  FileUpload as FileUploadIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { ragService } from '../services/ragService';

interface Document {
  id: string;
  text: string;
  metadata: {
    source: string;
    title: string;
    timestamp: string;
    file_type: string;
  };
  distance?: number;
}

interface RAGPageProps {
  onQuery?: (query: string, context: string) => void;
}

const RAGPage: React.FC<RAGPageProps> = ({ onQuery }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Document[]>([]);
  const [searching, setSearching] = useState(false);
  const [ragQuery, setRagQuery] = useState('');
  const [ragContext, setRagContext] = useState('');
  const [ragResults, setRagResults] = useState<any>(null);
  const [ragProcessing, setRagProcessing] = useState(false);
  const [collectionInfo, setCollectionInfo] = useState<any>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
    setUploadSuccess(false);
    setError(null);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setError('ファイルを選択してください');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      formData.append('source', 'web_upload');
      formData.append('title', 'Uploaded Documents');

      const response = await ragService.uploadDocuments(formData);
      
      if (response.success) {
        setUploadSuccess(true);
        setFiles(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        await loadCollectionInfo();
      } else {
        setError('アップロードに失敗しました');
      }
    } catch (err) {
      setError(`アップロードエラー: ${err}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('検索クエリを入力してください');
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const response = await ragService.searchDocuments(searchQuery, 5);
      
      if (response.success) {
        setSearchResults(response.results);
      } else {
        setError('検索に失敗しました');
      }
    } catch (err) {
      setError(`検索エラー: ${err}`);
    } finally {
      setSearching(false);
    }
  };

  const handleRAGQuery = async () => {
    if (!ragQuery.trim()) {
      setError('RAGクエリを入力してください');
      return;
    }

    setRagProcessing(true);
    setError(null);

    try {
      const response = await ragService.ragQuery(ragQuery, 5);
      
      if (response.success) {
        setRagResults(response);
        setRagContext(response.context);
        
        // 親コンポーネントにクエリとコンテキストを渡す
        if (onQuery) {
          onQuery(ragQuery, response.context);
        }
      } else {
        setError('RAGクエリに失敗しました');
      }
    } catch (err) {
      setError(`RAGクエリエラー: ${err}`);
    } finally {
      setRagProcessing(false);
    }
  };

  const loadCollectionInfo = async () => {
    try {
      const info = await ragService.getCollectionInfo();
      setCollectionInfo(info);
    } catch (err) {
      console.error('コレクション情報の取得に失敗:', err);
    }
  };

  React.useEffect(() => {
    loadCollectionInfo();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        RAG機能管理
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {uploadSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ファイルのアップロードが完了しました
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* ファイルアップロード */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <FileUploadIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              ドキュメントアップロード
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.md,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ mr: 2 }}
              >
                ファイルを選択
              </Button>
              {files && (
                <Typography variant="body2" color="text.secondary">
                  {files.length}個のファイルが選択されています
                </Typography>
              )}
            </Box>

            {files && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">選択されたファイル:</Typography>
                <List dense>
                  {Array.from(files).map((file, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024).toFixed(1)} KB`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!files || uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
            >
              {uploading ? 'アップロード中...' : 'アップロード'}
            </Button>
          </Paper>
        </Grid>

        {/* コレクション情報 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                コレクション情報
              </Typography>
              <IconButton onClick={() => setInfoDialogOpen(true)}>
                <InfoIcon />
              </IconButton>
            </Box>
            
            {collectionInfo ? (
              <Box>
                <Typography variant="body1">
                  ドキュメント数: <Chip label={collectionInfo.document_count} color="primary" />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  モデル: {collectionInfo.model_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  コレクション: {collectionInfo.collection_name}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                情報を読み込み中...
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* ドキュメント検索 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <SearchIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              ドキュメント検索
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="検索クエリ"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={searching}
                startIcon={searching ? <CircularProgress size={20} /> : <SearchIcon />}
              >
                {searching ? '検索中...' : '検索'}
              </Button>
            </Box>

            {searchResults.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  検索結果 ({searchResults.length}件)
                </Typography>
                {searchResults.map((doc, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {doc.metadata.source} - {doc.metadata.title}
                      </Typography>
                      <Typography variant="body1">
                        {doc.text.substring(0, 200)}...
                      </Typography>
                      {doc.distance && (
                        <Chip
                          label={`類似度: ${(1 - doc.distance).toFixed(3)}`}
                          size="small"
                          color="secondary"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* RAGクエリ */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              RAGクエリ
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="RAGクエリ"
                multiline
                rows={3}
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleRAGQuery}
                disabled={ragProcessing}
                startIcon={ragProcessing ? <CircularProgress size={20} /> : <SearchIcon />}
              >
                {ragProcessing ? '処理中...' : 'RAG実行'}
              </Button>
            </Box>

            {ragResults && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  RAG結果
                </Typography>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      コンテキスト長: {ragResults.context_length}文字
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {ragResults.context.substring(0, 500)}...
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      関連ドキュメント:
                    </Typography>
                    {ragResults.relevant_documents.map((doc: Document, index: number) => (
                      <Chip
                        key={index}
                        label={`${doc.metadata.title} (類似度: ${((1 - (doc.distance || 0)) * 100).toFixed(1)}%)`}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </CardContent>
                </Card>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* 情報ダイアログ */}
      <Dialog open={infoDialogOpen} onClose={() => setInfoDialogOpen(false)}>
        <DialogTitle>RAG機能について</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            RAG（Retrieval-Augmented Generation）機能により、アップロードしたドキュメントを基にした
            高精度な回答生成が可能になります。
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>主な機能:</strong>
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• ドキュメントのアップロードとベクトル化" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• 類似ドキュメントの検索" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• コンテキストを考慮した回答生成" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RAGPage;
