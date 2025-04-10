import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Card, CardContent, Grid, LinearProgress, Typography } from '@mui/material';
import { addDays, format, isAfter, isBefore, isToday } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Task } from '../../services/TaskService';

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const [completionRate, setCompletionRate] = useState(0);
  const [projectEndDate, setProjectEndDate] = useState<Date | null>(null);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Task[]>([]);
  const [overdueDeadlines, setOverdueDeadlines] = useState<Task[]>([]);
  
  useEffect(() => {
    if (tasks.length > 0) {
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      setCompletionRate(Math.round((completedTasks / tasks.length) * 100));
    } else {
      setCompletionRate(0);
    }
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);
    setProjectEndDate(endDate);

    const today = new Date();
    const nextWeek = addDays(today, 7);
    
    const tasksWithDeadlines = tasks
      .filter(task => task.deadline && task.status !== 'completed')
      .map(task => ({ ...task, deadlineDate: new Date(task.deadline!) }));
    
    setOverdueDeadlines(
      tasksWithDeadlines
        .filter(task => isBefore(task.deadlineDate, today) && !isToday(task.deadlineDate))
        .sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime())
    );
    
    setUpcomingDeadlines(
      tasksWithDeadlines
        .filter(task => 
          (isToday(task.deadlineDate) || 
          (isAfter(task.deadlineDate, today) && isBefore(task.deadlineDate, nextWeek))))
        .sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime())
    );
  }, [tasks]);
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'todo':
        return '#64748b';
      case 'inProgress':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      default:
        return '#64748b';
    }
  };
  
  const getDaysRemaining = (): number => {
    if (!projectEndDate) return 0;
    
    const today = new Date();
    const differenceInTime = projectEndDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    
    return differenceInDays > 0 ? differenceInDays : 0;
  };
  
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            height: '100%',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                  borderRadius: '12px',
                  p: 1.5,
                  mr: 2
                }}
              >
                <AssignmentIcon sx={{ color: '#3b82f6' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Total Tasks
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {tasks.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All tasks in your project
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            height: '100%',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  borderRadius: '12px',
                  p: 1.5,
                  mr: 2
                }}
              >
                <TrendingUpIcon sx={{ color: '#10b981' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Completion
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {completionRate}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={completionRate} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                mb: 1,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#10b981',
                }
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Tasks completion rate
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            height: '100%',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  backgroundColor: 'rgba(100, 116, 139, 0.1)', 
                  borderRadius: '12px',
                  p: 1.5,
                  mr: 2
                }}
              >
                <AssignmentTurnedInIcon sx={{ color: '#64748b' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Status
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  To Do
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tasks.filter(task => task.status === 'todo').length}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={100} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  backgroundColor: 'rgba(100, 116, 139, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getStatusColor('todo'),
                  }
                }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  In Progress
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tasks.filter(task => task.status === 'inProgress').length}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={100} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getStatusColor('inProgress'),
                  }
                }}
              />
            </Box>
            
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Completed
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tasks.filter(task => task.status === 'completed').length}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={100} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getStatusColor('completed'),
                  }
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            height: '100%',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  backgroundColor: 'rgba(249, 115, 22, 0.1)', 
                  borderRadius: '12px',
                  p: 1.5,
                  mr: 2
                }}
              >
                <CalendarTodayIcon sx={{ color: '#f97316' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Deadlines
              </Typography>
            </Box>
            
            {overdueDeadlines.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WarningIcon sx={{ color: '#ef4444', fontSize: '1rem', mr: 0.5 }} />
                  <Typography variant="subtitle2" color="error" sx={{ fontWeight: 600 }}>
                    Overdue ({overdueDeadlines.length})
                  </Typography>
                </Box>
                {overdueDeadlines.slice(0, 2).map(task => (
                  <Box key={task.id} sx={{ mb: 1, pl: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                      {task.title}
                    </Typography>
                    <Typography variant="caption" color="error.main">
                      Due: {format(new Date(task.deadline!), 'MMM d, yyyy')}
                    </Typography>
                  </Box>
                ))}
                {overdueDeadlines.length > 2 && (
                  <Typography variant="caption" color="text.secondary">
                    +{overdueDeadlines.length - 2} more overdue
                  </Typography>
                )}
              </Box>
            )}
            
            {upcomingDeadlines.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Upcoming ({upcomingDeadlines.length})
                </Typography>
                {upcomingDeadlines.slice(0, 3).map(task => (
                  <Box key={task.id} sx={{ mb: 1, pl: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                      {task.title}
                    </Typography>
                    <Typography variant="caption" color="primary.main">
                      Due: {format(new Date(task.deadline!), 'MMM d, yyyy')}
                    </Typography>
                  </Box>
                ))}
                {upcomingDeadlines.length > 3 && (
                  <Typography variant="caption" color="text.secondary">
                    +{upcomingDeadlines.length - 3} more upcoming
                  </Typography>
                )}
              </Box>
            )}
            
            {upcomingDeadlines.length === 0 && overdueDeadlines.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No upcoming deadlines
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TaskStats; 