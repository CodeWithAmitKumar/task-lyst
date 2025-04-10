export type TaskStatus = 'todo' | 'inProgress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  deadline: string | null;
  userId: string;
}

class TaskService {
  private static instance: TaskService;
  private readonly TASKS_KEY = 'task_lyst_tasks';
  
  private constructor() {}
  
  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  private getTasksFromStorage(): Task[] {
    try {
      const tasks = localStorage.getItem(this.TASKS_KEY);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  }

  private saveTasksToStorage(tasks: Task[]): void {
    try {
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }

  public getTasks(userId: string): Task[] {
    const tasks = this.getTasksFromStorage();
    return tasks.filter(task => task.userId === userId);
  }

  public getTasksByStatus(userId: string, status: TaskStatus): Task[] {
    const tasks = this.getTasks(userId);
    return tasks.filter(task => task.status === status);
  }

  public addTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
    const tasks = this.getTasksFromStorage();
    
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...tasks, newTask];
    this.saveTasksToStorage(updatedTasks);
    
    return newTask;
  }

  public updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'userId'>>): Task | null {
    const tasks = this.getTasksFromStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      return null;
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...updates
    };
    
    tasks[taskIndex] = updatedTask;
    this.saveTasksToStorage(tasks);
    
    return updatedTask;
  }

  public deleteTask(taskId: string): boolean {
    const tasks = this.getTasksFromStorage();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    
    if (filteredTasks.length === tasks.length) {
      return false;
    }
    
    this.saveTasksToStorage(filteredTasks);
    return true;
  }

  public updateTaskStatus(taskId: string, newStatus: TaskStatus): Task | null {
    return this.updateTask(taskId, { status: newStatus });
  }
}

export default TaskService.getInstance(); 