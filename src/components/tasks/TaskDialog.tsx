import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useState } from 'react';
import { Task, TaskStatus } from '../../services/TaskService';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: { title: string; description: string; status: TaskStatus; deadline: string | null }) => void;
  initialTask?: Task;
  initialStatus?: TaskStatus;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onClose,
  onSave,
  initialTask,
  initialStatus = 'todo',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [titleError, setTitleError] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (initialTask) {
        setTitle(initialTask.title);
        setDescription(initialTask.description);
        setStatus(initialTask.status);
        setDeadline(initialTask.deadline ? new Date(initialTask.deadline) : null);
      } else {
        setTitle('');
        setDescription('');
        setStatus(initialStatus);
        setDeadline(null);
      }
      setTitleError(false);
    }
  }, [open, initialTask, initialStatus]);

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      status,
      deadline: deadline ? deadline.toISOString() : null,
    });

    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>
          {initialTask ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Task Title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) {
                setTitleError(false);
              }
            }}
            error={titleError}
            helperText={titleError ? 'Title is required' : ''}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              label="Status"
            >
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="inProgress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          
          <DatePicker
            label="Deadline (Optional)"
            value={deadline}
            onChange={(newValue) => setDeadline(newValue)}
            sx={{ width: '100%' }}
            slotProps={{
              textField: {
                variant: 'outlined',
                fullWidth: true,
                sx: { mb: 2 }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ 
              px: 3,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            sx={{ 
              px: 3,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {initialTask ? 'Update' : 'Add'} Task
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default TaskDialog; 