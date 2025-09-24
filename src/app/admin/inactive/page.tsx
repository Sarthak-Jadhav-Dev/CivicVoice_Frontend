"use client";
import React from "react";
import { UserX, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const InactivePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <UserX className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Account Inactive
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your account has been deactivated. Please contact your administrator to reactivate your account.
          </p>
        </div>

        {user && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Account: <span className="font-medium text-gray-900 dark:text-white">{user.username}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Email: <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Status: <span className="font-medium text-orange-600 dark:text-orange-400">Inactive</span>
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
          
          <button
            onClick={logout}
            className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          Contact your administrator at admin@civicvoice.com for account reactivation.
        </div>
      </div>
    </div>
  );
};

export default InactivePage;
