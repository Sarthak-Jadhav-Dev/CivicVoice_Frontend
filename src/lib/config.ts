// API Configuration
export const API_CONFIG = {
  // Backend API base URL - change port to 5000 to avoid conflict with Next.js
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  
  // API endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile',
    },
    
    // Admin endpoints
    ADMIN: {
      // Issues
      ISSUES: '/api/admin/issues',
      ISSUE_BY_ID: (id: string) => `/api/admin/issues/${id}`,
      UPDATE_ISSUE_STATUS: (id: string) => `/api/admin/issues/${id}/status`,
      DELETE_ISSUE: (id: string) => `/api/admin/issues/${id}`,
      
      // Users
      USERS: '/api/admin/users',
      USER_BY_ID: (id: string) => `/api/admin/users/${id}`,
      CREATE_ADMIN: '/api/admin/users/create-admin',
      UPDATE_USER_ROLE: (id: string) => `/api/admin/users/${id}/role`,
      UPDATE_USER_STATUS: (id: string) => `/api/admin/users/${id}/status`,
      DELETE_USER: (id: string) => `/api/admin/users/${id}`,
      
      // Dashboard
      DASHBOARD_STATS: '/api/admin/dashboard/stats',
    },
    
    // User endpoints
    USER: {
      MY_REPORTS: '/api/user/my-reports',
    },
    
    // Reports
    REPORT: '/api/report',
  },
  
  // Request timeout
  TIMEOUT: 10000,
};

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
