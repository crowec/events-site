const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  theme: 'dark' | 'gold' | 'red' | 'blue';
  backgroundImage?: string;
  fontFamily?: string;
  backgroundColor?: string;
  dress_code?: string;
  details?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  event: Event;
  expiresIn: string;
}

export interface ApiError {
  error: string;
  details?: any[];
  retryAfter?: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      throw error;
    }
  }

  async login(password: string): Promise<LoginResponse> {
    try {
      const response = await this.makeRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password: password.trim() }),
      });

      if (response.success && response.token) {
        this.token = response.token;
        localStorage.setItem('authToken', response.token);
        
        setTimeout(() => {
          this.logout();
        }, this.parseExpiresIn(response.expiresIn));
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async verifyToken(): Promise<{ valid: boolean; event?: Event }> {
    if (!this.token) {
      return { valid: false };
    }

    try {
      const response = await this.makeRequest<{ valid: boolean; event: Event }>('/auth/verify');
      return response;
    } catch (error) {
      console.error('Token verification error:', error);
      this.logout();
      return { valid: false };
    }
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/(\d+)([hm])/);
    if (!match) return 3600000; // 1 hour default
    
    const [, value, unit] = match;
    const multiplier = unit === 'h' ? 3600000 : 60000; // hours or minutes to ms
    return parseInt(value) * multiplier;
  }
}

export default new ApiService();