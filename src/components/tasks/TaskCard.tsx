import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Card, CardActions, CardContent, Chip, IconButton, Paper, Typography } from '@mui/material';
import { differenceInDays, format, isPast, isToday } from 'date-fns';
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Task } from '../../services/TaskService';

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDrop: (taskId: string, newStatus: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onDrop }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    hover: (item: { id: string; status: string }, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.id;
      const hoverIndex = task.id;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      const clientOffset = monitor.getClientOffset();
      
      if (!clientOffset) {
        return;
      }
      
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      if (item.status !== task.status) {
        item.status = task.status;
        onDrop(item.id, task.status);
      }
    },
  });

  const renderDeadline = () => {
    if (!task.deadline) return null;
    
    const deadlineDate = new Date(task.deadline);
    const isExpired = isPast(deadlineDate) && !isToday(deadlineDate);
    const daysLeft = differenceInDays(deadlineDate, new Date());
    
    let chipColor: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    
    if (isExpired) {
      chipColor = 'error';
    } else if (isToday(deadlineDate)) {
      chipColor = 'warning';
    } else if (daysLeft <= 2) {
      chipColor = 'warning';
    } else {
      chipColor = 'info';
    }
    
    return (
      <Chip
        icon={<AccessTimeIcon />}
        label={`Due: ${format(deadlineDate, 'MMM d, yyyy')}`}
        size="small"
        color={chipColor}
        variant="outlined"
        sx={{ 
          mt: 1, 
          fontWeight: 500,
          fontSize: '0.75rem'
        }}
      />
    );
  };

  drag(drop(ref));

  return (
    <Card 
      ref={ref}
      sx={{
        mb: 2,
        opacity: isDragging ? 0.5 : 1,
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
      }}
      component={Paper}
    >
      <CardContent sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
          {task.title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 1,
            whiteSpace: 'pre-wrap',
            maxHeight: '100px',
            overflow: 'auto'
          }}
        >
          {task.description}
        </Typography>
        
        {renderDeadline()}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ display: 'block', fontSize: '0.7rem' }}
          >
            Created: {new Date(task.createdAt).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 1 }}>
        <IconButton 
          size="small" 
          onClick={() => onEdit(task)}
          sx={{ 
            color: 'primary.main',
            '&:hover': { 
              backgroundColor: 'rgba(37, 99, 235, 0.1)' 
            } 
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          onClick={() => onDelete(task.id)}
          sx={{ 
            color: '#e11d48',
            '&:hover': { 
              backgroundColor: 'rgba(225, 29, 72, 0.1)' 
            } 
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default TaskCard; 