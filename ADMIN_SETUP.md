# 🏛️ Civic Voice Admin Panel Setup Guide

## 📋 Overview

This admin panel is designed to work with your existing Civic Voice backend API. It provides a comprehensive dashboard for managing civic issues and users with role-based access control.

## 🚀 Quick Start

### 1. Environment Setup

Copy the environment example file and configure it:

```bash
cp .env.example .env.local
```

Update `.env.local` with your backend URL:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
# Change this to your hosted backend URL when deployed
# NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com

# JWT Configuration
NEXTAUTH_SECRET=your_super_secure_nextauth_secret_key_change_this_in_production_2024
NEXTAUTH_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The admin panel will be available at `http://localhost:3000`

## 🔐 Authentication & Access

### Default Admin Credentials

Use these credentials from your backend setup:

- **Super Admin:**
  - Email: `superadmin@civicvoice.com`
  - Password: `SuperAdmin123!`
  - Role: `superadmin`

### User Roles

| Role | Permissions |
|------|-------------|
| **user** | Submit reports, view own reports |
| **admin** | All user permissions + manage issues, view users, create admins |
| **superadmin** | All permissions + manage user roles, delete users/issues |

## 🎯 Features

### 📊 Dashboard Overview
- **Statistics Cards**: Total issues, pending issues, resolved issues, total users
- **Charts**: Issues by type and status visualization
- **Recent Issues**: Latest submitted civic issues

### 🔧 Issue Management
- **View All Issues**: Complete list with filtering and search
- **Status Updates**: Change issue status (Pending → Verified → In Progress → Resolved)
- **Detailed View**: Full issue details with AI validation results
- **Delete Issues**: Super admin only
- **Search & Filter**: By description, type, and status

### 👥 User Management
- **View All Users**: User list with role and status information
- **Activate/Deactivate**: Control user account status
- **Role Management**: Super admin can change user roles
- **Search Users**: Find users by username or email

### 🛡️ Security Features
- **Role-based Access Control**: Different permissions for different roles
- **JWT Authentication**: Secure token-based authentication
- **Route Protection**: AuthGuard component protects admin routes
- **Account Status Checks**: Inactive accounts are blocked

## 🏗️ Architecture

### Frontend Structure
```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx                 # Login page
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Main dashboard
│   │   ├── unauthorized/
│   │   │   └── page.tsx            # Access denied page
│   │   └── inactive/
│   │       └── page.tsx            # Inactive account page
├── components/
│   ├── AuthGuard.tsx               # Route protection
│   ├── IssueDetailsModal.tsx       # Issue details modal
│   └── ui/                         # UI components
├── hooks/
│   └── useAuth.ts                  # Authentication hook
└── lib/
    ├── api.ts                      # API client
    └── config.ts                   # Configuration
```

### API Integration

The admin panel connects to your backend API endpoints:

- **Authentication**: `/api/auth/*`
- **Admin Operations**: `/api/admin/*`
- **User Operations**: `/api/user/*`
- **Reports**: `/api/report`

## 🔧 Configuration

### Backend URL Configuration

Update the API base URL in `.env.local`:

```env
# For local development
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# For production (replace with your actual backend URL)
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
```

### CORS Configuration

Ensure your backend allows requests from your frontend domain. In your backend, the CORS origin should include your frontend URL:

```javascript
// In your backend
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
```

## 📱 Usage Guide

### 1. Login Process
1. Navigate to `/admin`
2. Enter admin credentials
3. Successful login redirects to `/admin/dashboard`

### 2. Dashboard Navigation
- **Dashboard Tab**: Overview statistics and charts
- **Issues Tab**: Manage all civic issues
- **Users Tab**: Manage user accounts

### 3. Issue Management
1. Click "Issues" tab
2. Use search/filter to find specific issues
3. Click eye icon to view full details
4. Update status using dropdown
5. Super admins can delete issues

### 4. User Management
1. Click "Users" tab
2. Search for specific users
3. Toggle user active/inactive status
4. Super admins can change user roles

## 🚨 Error Handling

### Common Issues

1. **Connection Error**: Check if backend is running and URL is correct
2. **Authentication Failed**: Verify credentials and JWT secret
3. **Access Denied**: Check user role and account status
4. **CORS Error**: Ensure backend CORS is configured correctly

### Error Pages

- `/admin/unauthorized`: Shown when user lacks required permissions
- `/admin/inactive`: Shown when user account is deactivated

## 🔄 Development

### Adding New Features

1. **New API Endpoints**: Add to `src/lib/api.ts`
2. **New Components**: Create in `src/components/`
3. **New Pages**: Add to `src/app/admin/`
4. **Authentication**: Use `AuthGuard` component for protection

### Type Safety

The project uses TypeScript with proper type definitions for:
- API responses
- User and Issue models
- Component props

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Update `.env.local` with production values:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-production-backend.com
NEXTAUTH_SECRET=your_production_secret_key
NEXTAUTH_URL=https://your-production-frontend.com
```

## 📞 Support

For issues or questions:
1. Check the error console in browser
2. Verify backend API is accessible
3. Check environment configuration
4. Review authentication credentials

## 🎉 Success!

Your Civic Voice Admin Panel is now ready to manage civic issues and users efficiently! The panel provides a modern, responsive interface for administrators to oversee the entire civic reporting system.
