import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
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
  Fade,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Search as SearchIcon,
  FileUpload as FileUploadIcon,
  Info as InfoIcon,
  Psychology as PsychologyIcon,
  Storage as StorageIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
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

interface UploadedDocument {
  id: string;
  filename: string;
  size: number;
  uploaded_at: string;
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
  const [ragResults, setRagResults] = useState<any>(null);
  const [ragProcessing, setRagProcessing] = useState(false);
  const [collectionInfo, setCollectionInfo] = useState<any>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  
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
        await loadUploadedDocuments();
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

  const handleDownload = async (documentId: string, filename: string) => {
    try {
      await ragService.downloadDocument(documentId, filename);
    } catch (err) {
      setError(`ダウンロードエラー: ${err}`);
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

  const loadUploadedDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const response = await ragService.getUploadedDocuments();
      if (response.success) {
        setUploadedDocuments(response.documents);
      }
    } catch (err) {
      console.error('ドキュメント一覧の取得に失敗:', err);
    } finally {
      setLoadingDocuments(false);
    }
  };

  React.useEffect(() => {
    loadCollectionInfo();
    loadUploadedDocuments();
  }, []);

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
          <PsychologyIcon sx={{ fontSize: 32, color: '#1976d2' }} />
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 600, 
              color: '#202123',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}>
              RAG機能管理
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>
              ドキュメントのアップロード、検索、RAG機能の管理を行います
            </Typography>
          </Box>
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
          {error && (
            <Fade in={!!error}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}

          {uploadSuccess && (
            <Fade in={uploadSuccess}>
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                ファイルのアップロードが完了しました
              </Alert>
            </Fade>
          )}

          <Grid container spacing={3}>
            {/* ファイルアップロード */}
            <Grid item xs={12} md={6}>
              <Slide direction="up" in timeout={300}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e5e5e7',
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600,
                    color: '#202123',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <FileUploadIcon sx={{ color: '#1976d2' }} />
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
                      sx={{ 
                        mr: 2,
                        borderRadius: 2,
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        '&:hover': {
                          borderColor: '#1565c0',
                          bgcolor: 'rgba(25, 118, 210, 0.04)'
                        }
                      }}
                    >
                      ファイルを選択
                    </Button>
                    {files && (
                      <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
                        {files.length}個のファイルが選択されています
                      </Typography>
                    )}
                  </Box>

                  {files && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: '#374151', mb: 1 }}>
                        選択されたファイル:
                      </Typography>
                      <List dense>
                        {Array.from(files).map((file, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemText
                              primary={file.name}
                              secondary={`${(file.size / 1024).toFixed(1)} KB`}
                              primaryTypographyProps={{ fontSize: '0.875rem' }}
                              secondaryTypographyProps={{ fontSize: '0.75rem' }}
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
                    sx={{
                      borderRadius: 2,
                      bgcolor: '#1976d2',
                      '&:hover': {
                        bgcolor: '#1565c0'
                      },
                      '&:disabled': {
                        bgcolor: '#d1d5db'
                      }
                    }}
                  >
                    {uploading ? 'アップロード中...' : 'アップロード'}
                  </Button>
                </Paper>
              </Slide>
            </Grid>

            {/* コレクション情報 */}
            <Grid item xs={12} md={6}>
              <Slide direction="up" in timeout={500}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e5e5e7',
                    height: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      color: '#202123',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <StorageIcon sx={{ color: '#1976d2' }} />
                      コレクション情報
                    </Typography>
                    <IconButton 
                      onClick={() => setInfoDialogOpen(true)}
                      sx={{ ml: 'auto' }}
                    >
                      <InfoIcon sx={{ color: '#6b7280' }} />
                    </IconButton>
                  </Box>
                  
                  {collectionInfo ? (
                    <Box>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        ドキュメント数: <Chip 
                          label={collectionInfo.document_count} 
                          sx={{ 
                            bgcolor: '#1976d2',
                            color: 'white',
                            fontWeight: 500
                          }} 
                        />
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                        モデル: {collectionInfo.model_name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        コレクション: {collectionInfo.collection_name}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      情報を読み込み中...
                    </Typography>
                  )}
                </Paper>
              </Slide>
            </Grid>

            {/* アップロード済みドキュメント一覧 */}
            <Grid item xs={12}>
              <Slide direction="up" in timeout={700}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e5e5e7'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      color: '#202123',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <FileUploadIcon sx={{ color: '#1976d2' }} />
                      アップロード済みドキュメント
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={loadUploadedDocuments}
                      disabled={loadingDocuments}
                      sx={{
                        borderRadius: 2,
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        '&:hover': {
                          borderColor: '#1565c0',
                          bgcolor: 'rgba(25, 118, 210, 0.04)'
                        }
                      }}
                    >
                      更新
                    </Button>
                  </Box>

                  {loadingDocuments ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : uploadedDocuments.length > 0 ? (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>ファイル名</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>サイズ</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>アップロード日時</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>操作</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {uploadedDocuments.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>{doc.filename}</TableCell>
                              <TableCell>{(doc.size / 1024).toFixed(1)} KB</TableCell>
                              <TableCell>{new Date(doc.uploaded_at).toLocaleString()}</TableCell>
                              <TableCell>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<DownloadIcon />}
                                  onClick={() => handleDownload(doc.id, doc.filename)}
                                  sx={{
                                    borderRadius: 2,
                                    borderColor: '#1976d2',
                                    color: '#1976d2',
                                    '&:hover': {
                                      borderColor: '#1565c0',
                                      bgcolor: 'rgba(25, 118, 210, 0.04)'
                                    }
                                  }}
                                >
                                  ダウンロード
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center', py: 4 }}>
                      アップロードされたドキュメントはありません
                    </Typography>
                  )}
                </Paper>
              </Slide>
            </Grid>

            {/* ドキュメント検索 */}
            <Grid item xs={12}>
              <Slide direction="up" in timeout={900}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e5e5e7'
                  }}
                >
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600,
                    color: '#202123',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <SearchIcon sx={{ color: '#1976d2' }} />
                    ドキュメント検索
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                    <TextField
                      fullWidth
                      label="検索クエリ"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f9fafb',
                          '&:hover': {
                            bgcolor: '#f3f4f6'
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white'
                          }
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      disabled={searching}
                      startIcon={searching ? <CircularProgress size={20} /> : <SearchIcon />}
                      sx={{
                        borderRadius: 2,
                        bgcolor: '#1976d2',
                        '&:hover': {
                          bgcolor: '#1565c0'
                        },
                        minWidth: { xs: '100%', md: 120 }
                      }}
                    >
                      {searching ? '検索中...' : '検索'}
                    </Button>
                  </Box>

                  {searchResults.length > 0 && (
                    <Fade in={searchResults.length > 0}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 600,
                          color: '#374151',
                          mb: 2
                        }}>
                          検索結果 ({searchResults.length}件)
                        </Typography>
                        {searchResults.map((doc, index) => (
                          <Card 
                            key={index} 
                            sx={{ 
                              mb: 2,
                              borderRadius: 2,
                              border: '1px solid #e5e5e7',
                              '&:hover': {
                                boxShadow: 2
                              }
                            }}
                          >
                            <CardContent>
                              <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                                {doc.metadata.source} - {doc.metadata.title}
                              </Typography>
                              <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.6 }}>
                                {doc.text.substring(0, 200)}...
                              </Typography>
                              {doc.distance && (
                                <Chip
                                  label={`類似度: ${(1 - doc.distance).toFixed(3)}`}
                                  size="small"
                                  sx={{ 
                                    bgcolor: '#e3f2fd',
                                    color: '#1976d2',
                                    fontWeight: 500
                                  }}
                                />
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    </Fade>
                  )}
                </Paper>
              </Slide>
            </Grid>

            {/* RAGクエリ */}
            <Grid item xs={12}>
              <Slide direction="up" in timeout={1100}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e5e5e7'
                  }}
                >
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600,
                    color: '#202123',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <PsychologyIcon sx={{ color: '#1976d2' }} />
                    RAGクエリ
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                    <TextField
                      fullWidth
                      label="RAGクエリ"
                      multiline
                      rows={3}
                      value={ragQuery}
                      onChange={(e) => setRagQuery(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f9fafb',
                          '&:hover': {
                            bgcolor: '#f3f4f6'
                          },
                          '&.Mui-focused': {
                            bgcolor: 'white'
                          }
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleRAGQuery}
                      disabled={ragProcessing}
                      startIcon={ragProcessing ? <CircularProgress size={20} /> : <SearchIcon />}
                      sx={{
                        borderRadius: 2,
                        bgcolor: '#1976d2',
                        '&:hover': {
                          bgcolor: '#1565c0'
                        },
                        minWidth: { xs: '100%', md: 120 }
                      }}
                    >
                      {ragProcessing ? '処理中...' : 'RAG実行'}
                    </Button>
                  </Box>

                  {ragResults && (
                    <Fade in={!!ragResults}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 600,
                          color: '#374151',
                          mb: 2
                        }}>
                          RAG結果
                        </Typography>
                        <Card sx={{ 
                          borderRadius: 2,
                          border: '1px solid #e5e5e7'
                        }}>
                          <CardContent>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                              コンテキスト長: {ragResults.context_length}文字
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                              {ragResults.context.substring(0, 500)}...
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" sx={{ 
                              fontWeight: 600,
                              color: '#374151',
                              mb: 1
                            }}>
                              関連ドキュメント:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {ragResults.relevant_documents.map((doc: Document, index: number) => (
                                <Chip
                                  key={index}
                                  label={`${doc.metadata.title} (類似度: ${((1 - (doc.distance || 0)) * 100).toFixed(1)}%)`}
                                  size="small"
                                  sx={{ 
                                    bgcolor: '#e3f2fd',
                                    color: '#1976d2',
                                    fontWeight: 500
                                  }}
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    </Fade>
                  )}
                </Paper>
              </Slide>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* 情報ダイアログ */}
      <Dialog 
        open={infoDialogOpen} 
        onClose={() => setInfoDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          fontWeight: 600,
          color: '#202123',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <InfoIcon sx={{ color: '#1976d2' }} />
          RAG機能について
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            RAG（Retrieval-Augmented Generation）機能により、アップロードしたドキュメントを基にした
            高精度な回答生成が可能になります。
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
            主な機能:
          </Typography>
          <List dense>
            <ListItem sx={{ px: 0 }}>
              <ListItemText primary="• ドキュメントのアップロードとベクトル化" />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemText primary="• 類似ドキュメントの検索" />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemText primary="• コンテキストを考慮した回答生成" />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemText primary="• アップロード済みドキュメントのダウンロード" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setInfoDialogOpen(false)}
            sx={{
              borderRadius: 2,
              bgcolor: '#1976d2',
              color: 'white',
              '&:hover': {
                bgcolor: '#1565c0'
              }
            }}
          >
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RAGPage;
