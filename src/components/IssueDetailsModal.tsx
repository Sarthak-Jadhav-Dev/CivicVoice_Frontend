"use client";
import React from "react";
import { Issue } from "@/lib/api";
import { X, MapPin, Calendar, User, Tag, CheckCircle, AlertTriangle } from "lucide-react";

interface IssueDetailsModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (issueId: string, status: Issue['status']) => void;
  userRole: string;
}

const IssueDetailsModal: React.FC<IssueDetailsModalProps> = ({
  issue,
  isOpen,
  onClose,
  onUpdateStatus,
  userRole
}) => {
  if (!isOpen || !issue) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Verified':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Road':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Water':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Electricity':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Sanitation':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Issue Details
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Issue Details */}
            <div className="space-y-6">
              {/* Status and Type */}
              <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(issue.issueType)}`}>
                  <Tag className="h-4 w-4 inline mr-1" />
                  {issue.issueType}
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Reporter Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Reported By
                </h4>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {issue.userId.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {issue.userId.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              {issue.location && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Location
                  </h4>
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                    <div>
                      {issue.location.address && (
                        <p className="text-gray-700 dark:text-gray-300">
                          {issue.location.address}
                        </p>
                      )}
                      {issue.location.coordinates && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Coordinates: {issue.location.coordinates[0]}, {issue.location.coordinates[1]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Timeline
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Reported: {new Date(issue.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Last Updated: {new Date(issue.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* AI Validation */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  AI Validation
                </h4>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    {issue.geminiValidation.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={`font-medium ${
                      issue.geminiValidation.isValid 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {issue.geminiValidation.isValid ? 'Valid Issue' : 'Invalid Issue'}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      (Confidence: {Math.round(issue.geminiValidation.confidence * 100)}%)
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {issue.geminiValidation.analysis}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Image and Actions */}
            <div className="space-y-6">
              {/* Issue Image */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Issue Image
                </h4>
                <div className="relative">
                  <img
                    src={issue.imageUrl}
                    alt="Issue"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg'; // Fallback image
                    }}
                  />
                </div>
              </div>

              {/* Status Management */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Update Status
                </h4>
                <div className="space-y-3">
                  {['Pending', 'Verified', 'In Progress', 'Resolved'].map((status) => (
                    <button
                      key={status}
                      onClick={() => onUpdateStatus(issue._id, status as Issue['status'])}
                      disabled={issue.status === status}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        issue.status === status
                          ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                      } ${issue.status === status ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{status}</span>
                        {issue.status === status && (
                          <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {status === 'Pending' && 'Issue is waiting for review'}
                        {status === 'Verified' && 'Issue has been verified as legitimate'}
                        {status === 'In Progress' && 'Work is being done to resolve this issue'}
                        {status === 'Resolved' && 'Issue has been completely resolved'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Actions */}
              {userRole === 'superadmin' && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Admin Actions
                  </h4>
                  <button className="w-full p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 dark:bg-red-900 dark:border-red-700 dark:text-red-200 dark:hover:bg-red-800 transition-colors">
                    Delete Issue
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailsModal;
