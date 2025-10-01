/**
 * 学園祭データ編集コンポーネント
 */

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Alert,
  Box,

  TextField,
  Button,
  Grid,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { adminService } from '../services/adminService';
import { FestivalDataUpdate } from '../types/admin';

const FestivalDataEditor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 編集用の状態
  const [schedule, setSchedule] = useState<Record<string, string>>({});
  const [locations, setLocations] = useState<Record<string, string>>({});
  const [food, setFood] = useState<string[]>([]);
  const [access, setAccess] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<string[]>([]);

  // 新しいアイテム用の状態
  const [newScheduleTime, setNewScheduleTime] = useState('');
  const [newScheduleEvent, setNewScheduleEvent] = useState('');
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationDesc, setNewLocationDesc] = useState('');
  const [newFoodItem, setNewFoodItem] = useState('');
  const [newAccessMethod, setNewAccessMethod] = useState('');
  const [newAccessDesc, setNewAccessDesc] = useState('');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadFestivalData();
  }, []);

  const loadFestivalData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getFestivalData();
      if (response.success && response.data) {
        setSchedule(response.data.schedule || {});
        setLocations(response.data.locations || {});
        setFood(response.data.food || []);
        setAccess(response.data.access || {});
        setNotes(response.data.notes || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '学園祭データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updateData: FestivalDataUpdate = {
        schedule,
        locations,
        food,
        access,
        notes,
      };

      const response = await adminService.updateFestivalData(updateData);
      if (response.success) {
        setSuccess('学園祭データを正常に更新しました');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '学園祭データの更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const addScheduleItem = () => {
    if (newScheduleTime && newScheduleEvent) {
      setSchedule(prev => ({ ...prev, [newScheduleTime]: newScheduleEvent }));
      setNewScheduleTime('');
      setNewScheduleEvent('');
    }
  };

  const removeScheduleItem = (time: string) => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      delete newSchedule[time];
      return newSchedule;
    });
  };

  const addLocationItem = () => {
    if (newLocationName && newLocationDesc) {
      setLocations(prev => ({ ...prev, [newLocationName]: newLocationDesc }));
      setNewLocationName('');
      setNewLocationDesc('');
    }
  };

  const removeLocationItem = (name: string) => {
    setLocations(prev => {
      const newLocations = { ...prev };
      delete newLocations[name];
      return newLocations;
    });
  };

  const addFoodItem = () => {
    if (newFoodItem) {
      setFood(prev => [...prev, newFoodItem]);
      setNewFoodItem('');
    }
  };

  const removeFoodItem = (index: number) => {
    setFood(prev => prev.filter((_, i) => i !== index));
  };

  const addAccessItem = () => {
    if (newAccessMethod && newAccessDesc) {
      setAccess(prev => ({ ...prev, [newAccessMethod]: newAccessDesc }));
      setNewAccessMethod('');
      setNewAccessDesc('');
    }
  };

  const removeAccessItem = (method: string) => {
    setAccess(prev => {
      const newAccess = { ...prev };
      delete newAccess[method];
      return newAccess;
    });
  };

  const addNoteItem = () => {
    if (newNote) {
      setNotes(prev => [...prev, newNote]);
      setNewNote('');
    }
  };

  const removeNoteItem = (index: number) => {
    setNotes(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">学園祭データ編集</Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? '保存中...' : '保存'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* スケジュール */}
        <Grid item xs={12} md={6}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">スケジュール</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="時間"
                      value={newScheduleTime}
                      onChange={(e) => setNewScheduleTime(e.target.value)}
                      placeholder="例: 10:00"
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="イベント"
                      value={newScheduleEvent}
                      onChange={(e) => setNewScheduleEvent(e.target.value)}
                      placeholder="例: 開会式"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={addScheduleItem} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
              <List>
                {Object.entries(schedule).map(([time, event]) => (
                  <ListItem key={time}>
                    <ListItemText primary={`${time}: ${event}`} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => removeScheduleItem(time)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* 場所 */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">場所</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="場所名"
                      value={newLocationName}
                      onChange={(e) => setNewLocationName(e.target.value)}
                      placeholder="例: 体育館"
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="説明"
                      value={newLocationDesc}
                      onChange={(e) => setNewLocationDesc(e.target.value)}
                      placeholder="例: ステージ発表"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={addLocationItem} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
              <List>
                {Object.entries(locations).map(([name, desc]) => (
                  <ListItem key={name}>
                    <ListItemText primary={`${name}: ${desc}`} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => removeLocationItem(name)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* 飲食 */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">飲食</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid item xs={10}>
                    <TextField
                      fullWidth
                      size="small"
                      label="飲食アイテム"
                      value={newFoodItem}
                      onChange={(e) => setNewFoodItem(e.target.value)}
                      placeholder="例: たこ焼き"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={addFoodItem} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
              <List>
                {food.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={item} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => removeFoodItem(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* アクセス */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">アクセス</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="交通手段"
                      value={newAccessMethod}
                      onChange={(e) => setNewAccessMethod(e.target.value)}
                      placeholder="例: 電車"
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="説明"
                      value={newAccessDesc}
                      onChange={(e) => setNewAccessDesc(e.target.value)}
                      placeholder="例: JR線○○駅から徒歩10分"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={addAccessItem} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
              <List>
                {Object.entries(access).map(([method, desc]) => (
                  <ListItem key={method}>
                    <ListItemText primary={`${method}: ${desc}`} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => removeAccessItem(method)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* 注意事項 */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">注意事項</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid item xs={10}>
                    <TextField
                      fullWidth
                      size="small"
                      label="注意事項"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="例: ゴミは分別して捨ててください"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={addNoteItem} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
              <List>
                {notes.map((note, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={note} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => removeNoteItem(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FestivalDataEditor;
