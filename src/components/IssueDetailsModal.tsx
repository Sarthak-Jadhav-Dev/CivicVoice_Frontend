"use client";
import React from "react";
import { Issue } from "@/lib/api";
import {
  User,
  Tag,
  CheckCircle,
  AlertTriangle,
  ImageIcon,
  FileText,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IssueDetailsModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (issueId: string, status: Issue["status"]) => void;
  userRole: string;
}

const IssueDetailsModal: React.FC<IssueDetailsModalProps> = ({
  issue,
  isOpen,
  onClose,
  onUpdateStatus: _onUpdateStatus,
  userRole: _userRole,
}) => {
  if (!isOpen || !issue) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Verified":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Road":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Water":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Electricity":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Sanitation":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 sticky top-0 z-10">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <span className="text-gray-900 dark:text-white">Issue Details</span>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">
                Reported on {new Date(issue.createdAt).toLocaleDateString()}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 py-6">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-4">
              {/* Classification */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-md">
                      <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    Issue Classification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {issue.status}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                        issue.issueType
                      )}`}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {issue.issueType}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded-md">
                      <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                      {issue.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Reporter */}
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-md">
                      <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    Reported By
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {issue.userId.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {issue.userId.username}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {issue.userId.email}
                      </p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 mt-1">
                        {issue.userId.role || "User"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* More cards (Location, Timeline, AI Validation)... keep same structure */}
            </div>

            {/* Right Column */}
            <div className="xl:col-span-1 space-y-4">
              {/* Issue Image */}
              <Card className="border-l-4 border-l-indigo-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900 rounded-md">
                      <ImageIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    Issue Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative group max-h-[75vh] overflow-auto rounded-lg bg-black/5 dark:bg-white/5">
                    <img
                      src={issue.imageUrl}
                      alt="Issue"
                      className="w-full h-auto max-h-[75vh] object-contain rounded-lg shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Status + Admin Actions remain unchanged */}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 dark:bg-gray-800/50 sticky bottom-0 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Issue #{issue._id.slice(-6)}</span>
            </div>
            <Button variant="outline" onClick={onClose} className="min-w-24">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDetailsModal;
