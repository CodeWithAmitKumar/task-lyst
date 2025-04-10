import AddIcon from '@mui/icons-material/Add';
import { Alert, Box, Button, Grid, Paper, Snackbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AuthService from '../../services/AuthService';
import TaskService, { Task, TaskStatus } from '../../services/TaskService';
import TaskColumn from './TaskColumn';
import TaskDialog from './TaskDialog';
import TaskStats from './TaskStats';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [initialStatus, setInitialStatus] = useState<TaskStatus>('todo');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const loadUserAndTasks = async () => {
      const user = await AuthService.getCurrentUser();
      if (user) {
        setUserId(user.id);
        const userTasks = TaskService.getTasks(user.id);
        setTasks(userTasks);
      }
    };

    loadUserAndTasks();
  }, []);

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inProgress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const handleAddTask = (status: TaskStatus) => {
    setCurrentTask(undefined);
    setInitialStatus(status);
    setOpenDialog(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setOpenDialog(true);
  };

  const handleDeleteTask = (taskId: string) => {
    const deleted = TaskService.deleteTask(taskId);
    if (deleted) {
      setTasks(tasks.filter(task => task.id !== taskId));
      showNotification('Task deleted successfully', 'success');
    }
  };

  const handleSaveTask = (taskData: { 
    title: string; 
    description: string; 
    status: TaskStatus;
    deadline: string | null;
  }) => {
    if (currentTask) {
      const updatedTask = TaskService.updateTask(currentTask.id, taskData);
      if (updatedTask) {
        setTasks(tasks.map(task => (task.id === currentTask.id ? updatedTask : task)));
        showNotification('Task updated successfully', 'success');
      }
    } else {
      const newTask = TaskService.addTask({
        ...taskData,
        userId,
      });
      setTasks([...tasks, newTask]);
      showNotification('Task added successfully', 'success');
    }
  };

  const handleDropTask = (taskId: string, newStatus: TaskStatus) => {
    const updatedTask = TaskService.updateTaskStatus(taskId, newStatus);
    if (updatedTask) {
      setTasks(tasks.map(task => (task.id === taskId ? updatedTask : task)));
      showNotification(`Task moved to ${getStatusLabel(newStatus)}`, 'success');
    }
  };

  const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'inProgress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <TaskStats tasks={tasks} />
      
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: '16px',
          backgroundColor: '#f8faff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Task Board
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleAddTask('todo')}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: '0 4px 8px rgba(37, 99, 235, 0.2)',
            }}
          >
            Add Task
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ overflowX: 'auto', flexWrap: { xs: 'nowrap', lg: 'wrap' } }}>
          <Grid item xs={12} sm={6} md={4}>
            <TaskColumn
              title="To Do"
              status="todo"
              tasks={todoTasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onDropTask={handleDropTask}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TaskColumn
              title="In Progress"
              status="inProgress"
              tasks={inProgressTasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onDropTask={handleDropTask}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TaskColumn
              title="Completed"
              status="completed"
              tasks={completedTasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onDropTask={handleDropTask}
            />
          </Grid>
        </Grid>
      </Paper>

      <TaskDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveTask}
        initialTask={currentTask}
        initialStatus={initialStatus}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          variant="filled"
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </DndProvider>
  );
};

export default TaskBoard; 