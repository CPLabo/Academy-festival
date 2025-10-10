import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';

interface DocumentUploadProps {
  onUploadSuccess: () => void;
  onUploadError: (error: string) => void;
}

interface FileWithPreview {
  file: File;
  id: string;
  preview: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUploadSuccess,
  onUploadError,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles: FileWithPreview[] = selectedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: file.name,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      onUploadError('ファイルを選択してください');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      files.forEach(fileWithPreview => {
        formData.append('files', fileWithPreview.file);
      });
      
      formData.append('title', title);
      formData.append('source', source);

      const response = await fetch(`${API_BASE_URL}/api/v1/rag/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'アップロードに失敗しました');
      }

      await response.json();
      setUploadProgress(100);
      
      setTimeout(() => {
        setFiles([]);
        setTitle('');
        setSource('upload');
        setUploading(false);
        setUploadProgress(0);
        onUploadSuccess();
      }, 1000);

    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      onUploadError(error instanceof Error ? error.message : 'アップロードに失敗しました');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="ソース"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
      </Box>

      <Paper
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          accept=".txt,.md,.pdf,.doc,.docx"
        />
        <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          ファイルをドラッグ&ドロップまたはクリックして選択
        </Typography>
        <Typography variant="body2" color="text.secondary">
          対応形式: TXT, MD, PDF, DOC, DOCX
        </Typography>
      </Paper>

      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            選択されたファイル ({files.length})
          </Typography>
          <List>
            {files.map((fileWithPreview) => (
              <ListItem key={fileWithPreview.id} divider>
                <AttachFileIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <ListItemText
                  primary={fileWithPreview.preview}
                  secondary={formatFileSize(fileWithPreview.file.size)}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => removeFile(fileWithPreview.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {uploading && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>
            アップロード中...
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          startIcon={<UploadIcon />}
        >
          {uploading ? 'アップロード中...' : 'アップロード'}
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentUpload;
