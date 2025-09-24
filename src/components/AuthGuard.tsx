"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'superadmin';
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole = 'admin',
  redirectTo = '/admin'
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Authenticated but insufficient role
      if (user && requiredRole) {
        const hasRequiredRole = 
          requiredRole === 'admin' 
            ? (user.role === 'admin' || user.role === 'superadmin')
            : user.role === requiredRole;

        if (!hasRequiredRole) {
          router.push('/admin/unauthorized');
          return;
        }
      }

      // User is inactive
      if (user && !user.isActive) {
        router.push('/admin/inactive');
        return;
      }
    }
  }, [user, isLoading, isAuthenticated, requiredRole, redirectTo, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated or insufficient role
  if (!isAuthenticated || !user) {
    return null;
  }

  if (requiredRole) {
    const hasRequiredRole = 
      requiredRole === 'admin' 
        ? (user.role === 'admin' || user.role === 'superadmin')
        : user.role === requiredRole;

    if (!hasRequiredRole || !user.isActive) {
      return null;
    }
  }

  return <>{children}</>;
};

export default AuthGuard;
