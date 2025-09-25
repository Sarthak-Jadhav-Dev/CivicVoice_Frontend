import { API_CONFIG, getApiUrl } from './config';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  _id: string;
  id?: string; // For backward compatibility
  username: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  isActive: boolean;
  createdAt: string;
}

export interface Issue {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    role: string;
  };
  description: string;
  issueType: 'Road' | 'Sanitation' | 'Electricity' | 'Water' | 'Other';
  status: 'Pending' | 'Verified' | 'In Progress' | 'Resolved';
  location?: {
    address?: string;
    coordinates?: [number, number];
  };
  imageUrl: string;
  geminiValidation: {
    isValid: boolean;
    confidence: number;
    analysis: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  overview: {
    totalIssues: number;
    pendingIssues: number;
    resolvedIssues: number;
    totalUsers: number;
    adminUsers: number;
  };
  charts: {
    issuesByType: Array<{ _id: string; count: number }>;
    issuesByStatus: Array<{ _id: string; count: number }>;
  };
  recentIssues: Issue[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// API Client class
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  // Remove authentication token
  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Get authentication headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = getApiUrl(endpoint);
      
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'An error occurred',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.request<User>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
  }

  async logout(): Promise<void> {
    this.removeToken();
  }

  // Admin - Issue management
  async getIssues(): Promise<ApiResponse<Issue[]>> {
    return this.request<Issue[]>(API_CONFIG.ENDPOINTS.ADMIN.ISSUES);
  }

  async getIssue(id: string): Promise<ApiResponse<Issue>> {
    return this.request<Issue>(API_CONFIG.ENDPOINTS.ADMIN.ISSUE_BY_ID(id));
  }

  async updateIssueStatus(
    id: string,
    status: Issue['status']
  ): Promise<ApiResponse<Issue>> {
    return this.request<Issue>(
      API_CONFIG.ENDPOINTS.ADMIN.UPDATE_ISSUE_STATUS(id),
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }
    );
  }

  async deleteIssue(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_CONFIG.ENDPOINTS.ADMIN.DELETE_ISSUE(id), {
      method: 'DELETE',
    });
  }

  // Admin - User management
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>(API_CONFIG.ENDPOINTS.ADMIN.USERS);
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(API_CONFIG.ENDPOINTS.ADMIN.USER_BY_ID(id));
  }

  async createAdmin(userData: {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'superadmin';
  }): Promise<ApiResponse<User>> {
    return this.request<User>(API_CONFIG.ENDPOINTS.ADMIN.CREATE_ADMIN, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUserRole(
    id: string,
    role: User['role']
  ): Promise<ApiResponse<User>> {
    return this.request<User>(API_CONFIG.ENDPOINTS.ADMIN.UPDATE_USER_ROLE(id), {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async updateUserStatus(
    id: string,
    isActive: boolean
  ): Promise<ApiResponse<User>> {
    return this.request<User>(
      API_CONFIG.ENDPOINTS.ADMIN.UPDATE_USER_STATUS(id),
      {
        method: 'PUT',
        body: JSON.stringify({ isActive }),
      }
    );
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_CONFIG.ENDPOINTS.ADMIN.DELETE_USER(id), {
      method: 'DELETE',
    });
  }

  // Dashboard
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>(
      API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_STATS
    );
  }

  // User reports
  async getMyReports(): Promise<ApiResponse<Issue[]>> {
    return this.request<Issue[]>(API_CONFIG.ENDPOINTS.USER.MY_REPORTS);
  }

  // Submit report
  async submitReport(reportData: FormData): Promise<ApiResponse<Issue>> {
    return this.request<Issue>(API_CONFIG.ENDPOINTS.REPORT, {
      method: 'POST',
      body: reportData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        Authorization: this.token ? `Bearer ${this.token}` : '',
      },
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export convenience methods
export const {
  login,
  register,
  logout,
  getProfile,
  getIssues,
  getIssue,
  updateIssueStatus,
  deleteIssue,
  getUsers,
  getUser,
  createAdmin,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getDashboardStats,
  getMyReports,
  submitReport,
} = apiClient;
