import { Add as AddIcon } from '@mui/icons-material';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Task, TaskStatus } from '../../services/TaskService';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDropTask: (taskId: string, newStatus: TaskStatus) => void;
}

const getColumnColor = (status: TaskStatus): string => {
  switch (status) {
    case 'todo':
      return '#4b5563';
    case 'inProgress':
      return '#2563eb';
    case 'completed':
      return '#10b981';
    default:
      return '#4b5563';
  }
};

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDropTask,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string }) => {
      onDropTask(item.id, status);
      return { name: title };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  
  drop(ref);
  
  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: { xs: '300px', sm: '320px' },
        maxWidth: { xs: '100%', sm: '320px' },
        p: 1,
      }}
    >
      <Paper
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: isOver ? 'rgba(37, 99, 235, 0.05)' : 'background.paper',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          border: '1px solid',
          borderColor: isOver ? 'primary.main' : 'rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: getColumnColor(status),
              }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {title} {tasks.length > 0 && `(${tasks.length})`}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => onAddTask(status)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
              },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
      
      <Box
        sx={{
          flexGrow: 1,
          minHeight: '300px',
          maxHeight: { xs: 'auto', md: 'calc(100vh - 350px)' },
          overflowY: 'auto',
          px: 0.5,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '4px',
          },
        }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onDrop={(taskId, newStatus) => onDropTask(taskId, newStatus as TaskStatus)}
          />
        ))}
        
        {tasks.length === 0 && (
          <Box
            sx={{
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              border: '1px dashed',
              borderColor: 'rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(0,0,0,0.02)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No tasks
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TaskColumn; 