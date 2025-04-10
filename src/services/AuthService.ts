interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

// Mock user database - in a real app, this would be a database call
const USERS: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    password: 'password123'
  }
];

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private readonly USER_KEY = 'task_lyst_user';
  private readonly AUTH_KEY = 'task_lyst_auth';
  private readonly EXPIRY_KEY = 'task_lyst_expiry';

  private constructor() {
    this.loadUserFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private loadUserFromStorage(): void {
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      if (userJson) {
        const userData = JSON.parse(userJson);
        // Check if user data exists in our "database"
        const user = USERS.find(u => u.id === userData.id);
        if (user) {
          this.currentUser = user;
        }
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      // Clear potentially corrupted data
      this.clearStorage();
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
    localStorage.removeItem('userId');
    localStorage.removeItem('isAuthenticated');
  }

  private setAuthExpiry(): void {
    // Set session to expire in 24 hours
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 24);
    localStorage.setItem(this.EXPIRY_KEY, expiryTime.toISOString());
  }

  private isSessionExpired(): boolean {
    const expiryTimeStr = localStorage.getItem(this.EXPIRY_KEY);
    if (!expiryTimeStr) return true;
    
    try {
      const expiryTime = new Date(expiryTimeStr);
      return new Date() > expiryTime;
    } catch (error) {
      return true;
    }
  }

  public login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Validate inputs
      if (!email || !password) {
        resolve(false);
        return;
      }

      // Find user with matching email
      const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // Check if user exists and password matches
      if (user && user.password === password) {
        this.currentUser = user;
        
        // Store in localStorage with separate keys
        localStorage.setItem('userId', user.id);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Store user data without sensitive info
        const safeUser = {
          id: user.id,
          name: user.name,
          email: user.email
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(safeUser));
        localStorage.setItem(this.AUTH_KEY, 'true');
        this.setAuthExpiry();
        
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  public register(name: string, email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Validate inputs
      if (!name || !email || !password) {
        resolve(false);
        return;
      }

      // Check if email already exists
      const existingUser = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        resolve(false);
        return;
      }

      // In a real app, we would add to database
      // For this demo, we just update the array
      const newUser: User = {
        id: String(USERS.length + 1),
        name,
        email,
        password
      };

      USERS.push(newUser);
      this.currentUser = newUser;
      
      // Store in localStorage with multiple keys for redundancy
      localStorage.setItem('userId', newUser.id);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Store user data without sensitive info
      const safeUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(safeUser));
      localStorage.setItem(this.AUTH_KEY, 'true');
      this.setAuthExpiry();
      
      resolve(true);
    });
  }

  public logout(): void {
    this.currentUser = null;
    this.clearStorage();
  }

  public isAuthenticated(): boolean {
    // Check if session is expired
    if (this.isSessionExpired()) {
      this.clearStorage();
      return false;
    }

    // Check both auth indicators for redundancy
    const hasAuth = localStorage.getItem(this.AUTH_KEY) === 'true';
    const isLegacyAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    return hasAuth || isLegacyAuth;
  }

  public getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      // If session expired, clear storage and return null
      if (this.isSessionExpired()) {
        this.clearStorage();
        resolve(null);
        return;
      }

      if (this.currentUser) {
        resolve(this.currentUser);
        return;
      }

      // Try to get user ID from different sources
      const userId = localStorage.getItem('userId');
      if (!userId) {
        resolve(null);
        return;
      }

      const user = USERS.find(u => u.id === userId);
      if (user) {
        this.currentUser = user;
      }
      
      resolve(this.currentUser);
    });
  }

  // Utility to check if localStorage is available
  public isStorageAvailable(): boolean {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }
}

export default AuthService.getInstance(); 