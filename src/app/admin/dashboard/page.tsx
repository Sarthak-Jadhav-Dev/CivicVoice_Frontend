"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient, DashboardStats, Issue, User } from "@/lib/api";
import { motion } from "motion/react";
import IssueDetailsModal from "@/components/IssueDetailsModal";
import AuthGuard from "@/components/AuthGuard";
import { CivicNavbar } from "@/components/ui/civic-navbar";
import { Footer } from "@/components/ui/footer";
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3,
  Settings,
  LogOut,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Shield,
  X,
  MoreHorizontal,
  Calendar,
  MapPin,
  User as UserIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminDashboard = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [createAdminData, setCreateAdminData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'superadmin'
  });

  // Analytics Filters (State / City / Area)
  const [filterState, setFilterState] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterArea, setFilterArea] = useState<string>("all");

  // Helpers to parse address -> { area, city, state }
  const parseAddress = (address?: string) => {
    if (!address) return { area: "", city: "", state: "" };
    const parts = address.split(",").map(p => p.trim()).filter(Boolean);
    // Heuristic: last = state, second last = city, third last = area
    const state = parts[parts.length - 1] || "";
    const city = parts[parts.length - 2] || "";
    const area = parts[parts.length - 3] || "";
    return { area, city, state };
  };

  // Build unique option lists from current issues
  const locationLists = React.useMemo(() => {
    const states = new Set<string>();
    const cities = new Set<string>();
    const areas = new Set<string>();
    issues.forEach(i => {
      const { area, city, state } = parseAddress(i.location?.address);
      if (state) states.add(state);
      if (city) cities.add(city);
      if (area) areas.add(area);
    });
    return {
      states: Array.from(states).sort(),
      cities: Array.from(cities).sort(),
      areas: Array.from(areas).sort(),
    };
  }, [issues]);

  // Apply location filters to issues globally
  const filteredIssuesGlobal = React.useMemo(() => {
    return issues.filter(i => {
      const { area, city, state } = parseAddress(i.location?.address);
      const matchState = filterState === "all" || state === filterState;
      const matchCity = filterCity === "all" || city === filterCity;
      const matchArea = filterArea === "all" || area === filterArea;
      return matchState && matchCity && matchArea;
    });
  }, [issues, filterState, filterCity, filterArea]);

  // Recompute dashboard stats from filtered issues (client-side)
  const computedStatsFromIssues = (iss: Issue[]): DashboardStats | null => {
    if (!dashboardStats) return null;
    const overview = {
      totalIssues: iss.length,
      pendingIssues: iss.filter(i => i.status === 'Pending').length,
      resolvedIssues: iss.filter(i => i.status === 'Resolved').length,
      totalUsers: dashboardStats.overview.totalUsers,
      adminUsers: dashboardStats.overview.adminUsers,
    };
    const byTypeMap = new Map<string, number>();
    const byStatusMap = new Map<string, number>();
    iss.forEach(i => {
      byTypeMap.set(i.issueType, (byTypeMap.get(i.issueType) || 0) + 1);
      byStatusMap.set(i.status, (byStatusMap.get(i.status) || 0) + 1);
    });
    const charts = {
      issuesByType: Array.from(byTypeMap.entries()).map(([k, v]) => ({ _id: k, count: v })),
      issuesByStatus: Array.from(byStatusMap.entries()).map(([k, v]) => ({ _id: k, count: v })),
    };
    // Recent issues: sort by createdAt desc
    const recentIssues = [...iss].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return { overview, charts, recentIssues };
  };

  const displayStats = React.useMemo(() => {
    // If any filter is active, show computed stats; else original
    const anyFilter = filterState !== 'all' || filterCity !== 'all' || filterArea !== 'all';
    return anyFilter ? computedStatsFromIssues(filteredIssuesGlobal) : dashboardStats;
  }, [dashboardStats, filteredIssuesGlobal, filterState, filterCity, filterArea]);

  // Analytics charts computed from filtered issues
  const analyticsCharts = React.useMemo(() => {
    const byType = new Map<string, number>();
    const byStatus = new Map<string, number>();
    const byUser = new Map<string, number>();
    filteredIssuesGlobal.forEach(i => {
      byType.set(i.issueType, (byType.get(i.issueType) || 0) + 1);
      byStatus.set(i.status, (byStatus.get(i.status) || 0) + 1);
      const uname = i.userId?.username || 'Unknown';
      byUser.set(uname, (byUser.get(uname) || 0) + 1);
    });
    return {
      issuesByType: Array.from(byType.entries()).map(([k, v]) => ({ _id: k, count: v })),
      issuesByStatus: Array.from(byStatus.entries()).map(([k, v]) => ({ _id: k, count: v })),
      issuesByUser: Array.from(byUser.entries()).map(([k, v]) => ({ _id: k, count: v }))
        .sort((a, b) => b.count - a.count),
    };
  }, [filteredIssuesGlobal]);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'admin' && user.role !== 'superadmin'))) {
      window.location.href = "/admin";
    }
  }, [user, authLoading]);

  // Load dashboard data
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsResponse, issuesResponse, usersResponse] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getIssues(),
        apiClient.getUsers()
      ]);

      if (statsResponse.success && statsResponse.data) {
        setDashboardStats(statsResponse.data);
      }
      
      if (issuesResponse.success && issuesResponse.data) {
        setIssues(issuesResponse.data);
      }
      
      if (usersResponse.success && usersResponse.data) {
        setUsers(usersResponse.data);
      }
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIssueStatus = async (issueId: string, newStatus: Issue['status']) => {
    try {
      const response = await apiClient.updateIssueStatus(issueId, newStatus);
      if (response.success) {
        setIssues(prev => prev.map(issue => 
          issue._id === issueId ? { ...issue, status: newStatus } : issue
        ));
      } else {
        alert(response.error || "Failed to update issue status");
      }
    } catch (err) {
      alert("Failed to update issue status");
    }
  };

  const handleDeleteIssue = async (issueId: string) => {
    if (!confirm("Are you sure you want to delete this issue?")) return;
    
    try {
      const response = await apiClient.deleteIssue(issueId);
      if (response.success) {
        setIssues(prev => prev.filter(issue => issue._id !== issueId));
      } else {
        alert(response.error || "Failed to delete issue");
      }
    } catch (err) {
      alert("Failed to delete issue");
    }
  };

  const handleUpdateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await apiClient.updateUserStatus(userId, isActive);
      if (response.success) {
        setUsers(prev => prev.map(user => 
          (user._id || user.id) === userId ? { ...user, isActive } : user
        ));
      } else {
        alert(response.error || "Failed to update user status");
      }
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;
    
    try {
      const response = await apiClient.deleteUser(userId);
      if (response.success) {
        setUsers(prev => prev.filter(user => (user._id || user.id) !== userId));
        alert("User deleted successfully");
      } else {
        alert(response.error || "Failed to delete user");
      }
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createAdminData.username || !createAdminData.email || !createAdminData.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await apiClient.createAdmin(createAdminData);
      if (response.success) {
        // Reload users to show the new admin
        const usersResponse = await apiClient.getUsers();
        if (usersResponse.success && usersResponse.data) {
          setUsers(usersResponse.data);
        }
        
        setShowCreateAdminModal(false);
        setCreateAdminData({ username: '', email: '', password: '', role: 'admin' });
        alert(`${createAdminData.role} created successfully!`);
      } else {
        alert(response.error || "Failed to create admin");
      }
    } catch (err) {
      alert("Failed to create admin");
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: User['role']) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    try {
      const response = await apiClient.updateUserRole(userId, newRole);
      if (response.success) {
        setUsers(prev => prev.map(user => 
          (user._id || user.id) === userId ? { ...user, role: newRole } : user
        ));
        alert("User role updated successfully");
      } else {
        alert(response.error || "Failed to update user role");
      }
    } catch (err) {
      alert("Failed to update user role");
    }
  };

  const handleViewIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIssue(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CivicNavbar variant="dashboard" onLogout={logout} user={user} />
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Civic Voice Admin
              </h1>
              <span className="ml-4 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                {user?.role}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user?.username}
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'issues', label: 'Issues', icon: AlertTriangle },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              ...(user?.role === 'superadmin' ? [{ id: 'admin-management', label: 'Admin Management', icon: Shield }] : []),
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <DashboardOverview stats={displayStats} />
          </div>
        )}

        {/* Issues Management */}
        {activeTab === 'issues' && (
          <div className="space-y-6">
            <IssuesManagement 
              issues={filteredIssuesGlobal} 
              onUpdateStatus={handleUpdateIssueStatus}
              onDelete={handleDeleteIssue}
              onView={handleViewIssue}
              userRole={user?.role || 'admin'}
            />
          </div>
        )}

        {/* Analytics Panel */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <BarChart3 className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Analytics Filters</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  Filter reports by State, City and Area. Filters apply across Dashboard and Issues.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                {/* Mobile-first filter layout */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* State */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                      <Select value={filterState} onValueChange={setFilterState}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All States</SelectItem>
                          {locationLists.states.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* City */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                      <Select value={filterCity} onValueChange={setFilterCity}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cities</SelectItem>
                          {locationLists.cities.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Area */}
                    <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Area</label>
                      <Select value={filterArea} onValueChange={setFilterArea}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Areas</SelectItem>
                          {locationLists.areas.map((a) => (
                            <SelectItem key={a} value={a}>{a}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Active filters and clear button */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {filterState !== 'all' && (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        State: {filterState}
                      </span>
                    )}
                    {filterCity !== 'all' && (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        City: {filterCity}
                      </span>
                    )}
                    {filterArea !== 'all' && (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Area: {filterArea}
                      </span>
                    )}
                    {(filterState !== 'all' || filterCity !== 'all' || filterArea !== 'all') && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-7 px-3 text-xs"
                        onClick={() => { setFilterState('all'); setFilterCity('all'); setFilterArea('all'); }}
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>

                {/* Summary stats - mobile optimized */}
                <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 sm:p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">Filtered Issues</p>
                        <p className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{filteredIssuesGlobal.length}</p>
                      </div>
                      <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-lg">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 sm:p-6 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</p>
                        <p className="text-xl sm:text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">{filteredIssuesGlobal.filter(i => i.status === 'Pending').length}</p>
                      </div>
                      <div className="p-2 bg-yellow-200 dark:bg-yellow-800 rounded-lg">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 sm:p-6 border border-green-200 dark:border-green-800 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">Resolved</p>
                        <p className="text-xl sm:text-2xl font-bold text-green-900 dark:text-green-100 mt-1">{filteredIssuesGlobal.filter(i => i.status === 'Resolved').length}</p>
                      </div>
                      <div className="p-2 bg-green-200 dark:bg-green-800 rounded-lg">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts - mobile responsive */}
                <div className="mt-8 sm:mt-10 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                  <div className="lg:col-span-1">
                    <ChartCard title="Issues by Type (Filtered)" data={analyticsCharts.issuesByType} />
                  </div>
                  <div className="lg:col-span-1">
                    <ChartCard title="Issues by Status (Filtered)" data={analyticsCharts.issuesByStatus} />
                  </div>
                </div>

                {/* Reports by Users - mobile optimized */}
                <div className="mt-8 sm:mt-10">
                  <Card>
                    <CardHeader className="px-4 sm:px-6 pb-4">
                      <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        Reports by Users (Filtered)
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Top contributors in the filtered area
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                      {analyticsCharts.issuesByUser.length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">No reports match current filters.</p>
                        </div>
                      ) : (
                        <div className="space-y-3 sm:space-y-4">
                          {analyticsCharts.issuesByUser.slice(0, 8).map((item, index) => (
                            <div key={item._id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="relative">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                                    {item._id.charAt(0).toUpperCase()}
                                  </div>
                                  {index < 3 && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-bold text-yellow-900">{index + 1}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item._id}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.count} report{item.count !== 1 ? 's' : ''}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="w-16 sm:w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${(item.count / Math.max(1, Math.max(...analyticsCharts.issuesByUser.map(d => d.count)))) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[2rem] text-right">{item.count}</span>
                              </div>
                            </div>
                          ))}
                          {analyticsCharts.issuesByUser.length > 8 && (
                            <div className="text-center pt-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Showing top 8 of {analyticsCharts.issuesByUser.length} users
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Actual Reports Section - mobile optimized */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Filtered Reports</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredIssuesGlobal.length} report{filteredIssuesGlobal.length !== 1 ? 's' : ''}
                </div>
              </div>
              <IssuesManagement 
                issues={filteredIssuesGlobal}
                onUpdateStatus={handleUpdateIssueStatus}
                onDelete={handleDeleteIssue}
                onView={handleViewIssue}
                userRole={user?.role || 'admin'}
              />
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <UsersManagement 
              users={users}
              onUpdateStatus={handleUpdateUserStatus}
              onDeleteUser={handleDeleteUser}
              onUpdateRole={handleUpdateUserRole}
              userRole={user?.role || 'admin'}
            />
          </div>
        )}

        {/* Admin Management (SuperAdmin Only) */}
        {activeTab === 'admin-management' && user?.role === 'superadmin' && (
          <div className="space-y-6">
            <AdminManagement 
              users={users.filter(u => u.role === 'admin' || u.role === 'superadmin')}
              onCreateAdmin={() => setShowCreateAdminModal(true)}
              onUpdateStatus={handleUpdateUserStatus}
              onDeleteUser={handleDeleteUser}
              onUpdateRole={handleUpdateUserRole}
            />
          </div>
        )}
      </div>

      {/* Issue Details Modal */}
      <IssueDetailsModal
        issue={selectedIssue}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateIssueStatus}
        userRole={user?.role || 'admin'}
      />

      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={showCreateAdminModal}
        onClose={() => setShowCreateAdminModal(false)}
        onSubmit={handleCreateAdmin}
        formData={createAdminData}
        setFormData={setCreateAdminData}
      />
      </div>
      <Footer />
    </AuthGuard>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ stats }: { stats: DashboardStats | null }) => {
  if (!stats) {
    return <div>Loading statistics...</div>;
  }

  const { overview, charts, recentIssues } = stats;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Issues"
          value={overview.totalIssues}
          icon={AlertTriangle}
          color="blue"
        />
        <StatCard
          title="Pending Issues"
          value={overview.pendingIssues}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Resolved Issues"
          value={overview.resolvedIssues}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Total Users"
          value={overview.totalUsers}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Issues by Type" data={charts.issuesByType} />
        <ChartCard title="Issues by Status" data={charts.issuesByStatus} />
      </div>

      {/* Recent Issues */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Issues
        </h3>
        <div className="space-y-4">
          {recentIssues.slice(0, 5).map((issue) => (
            <div key={issue._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {issue.description.substring(0, 60)}...
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Type: {issue.issueType} • Status: {issue.status}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                issue.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {issue.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Issues Management Component
const IssuesManagement = ({ 
  issues, 
  onUpdateStatus, 
  onDelete, 
  onView,
  userRole 
}: { 
  issues: Issue[]; 
  onUpdateStatus: (id: string, status: Issue['status']) => void;
  onDelete: (id: string) => void;
  onView: (issue: Issue) => void;
  userRole: string;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.issueType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Verified': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Road': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Water': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Electricity': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Sanitation': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Issues Management
          </CardTitle>
          <CardDescription>
            View and manage all reported issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Issues Grid */}
          <div className="grid gap-4">
            {filteredIssues.map((issue) => (
              <Card key={issue._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Issue Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {issue.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(issue.issueType)}`}>
                              {issue.issueType}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                              {issue.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          <span>{issue.userId?.username || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <Select 
                        value={issue.status} 
                        onValueChange={(value) => onUpdateStatus(issue._id, value as Issue['status'])}
                      >
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="Verified">Verified</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onView(issue)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {userRole === 'superadmin' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onDelete(issue._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIssues.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No issues found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

// Users Management Component
const UsersManagement = ({ 
  users, 
  onUpdateStatus, 
  onDeleteUser,
  onUpdateRole,
  userRole 
}: { 
  users: User[]; 
  onUpdateStatus: (id: string, isActive: boolean) => void;
  onDeleteUser: (id: string) => void;
  onUpdateRole: (id: string, role: User['role']) => void;
  userRole: string;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'admin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Users Management
        </CardTitle>
        <CardDescription>
          Manage user accounts and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users Grid */}
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user._id || user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* User Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {user.username}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* User Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {/* Role Selector for SuperAdmin */}
                    {userRole === 'superadmin' && (
                      <Select 
                        value={user.role} 
                        onValueChange={(value) => onUpdateRole((user._id || user.id)!, value as User['role'])}
                      >
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">SuperAdmin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant={user.isActive ? "outline" : "default"}
                        size="sm"
                        onClick={() => onUpdateStatus((user._id || user.id)!, !user.isActive)}
                        className={user.isActive ? "text-red-600 hover:text-red-700 hover:bg-red-50" : ""}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      {userRole === 'superadmin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteUser((user._id || user.id)!)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No users found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Stat Card Component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  color: string; 
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex items-center">
        <div className={`${colorClasses[color as keyof typeof colorClasses]} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Chart Card Component
const ChartCard = ({ 
  title, 
  data 
}: { 
  title: string; 
  data: Array<{ _id: string; count: number }>; 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item._id} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{item._id}</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(item.count / Math.max(...data.map(d => d.count))) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Admin Management Component (SuperAdmin Only)
const AdminManagement = ({ 
  users, 
  onCreateAdmin,
  onUpdateStatus, 
  onDeleteUser,
  onUpdateRole
}: { 
  users: User[]; 
  onCreateAdmin: () => void;
  onUpdateStatus: (id: string, isActive: boolean) => void;
  onDeleteUser: (id: string) => void;
  onUpdateRole: (id: string, role: User['role']) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Create Admin Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Admin Management
        </h2>
        <button
          onClick={onCreateAdmin}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          <span>Create Admin</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search admins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Admins List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user._id || user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.username}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => onUpdateRole((user._id || user.id)!, e.target.value as User['role'])}
                      className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">SuperAdmin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onUpdateStatus((user._id || user.id)!, !user.isActive)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          user.isActive
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => onDeleteUser((user._id || user.id)!)}
                        className="px-3 py-1 rounded text-xs font-medium bg-red-600 text-white hover:bg-red-700"
                        title="Delete Admin"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No admins found.
          </div>
        )}
      </div>
    </div>
  );
};

// Create Admin Modal Component
const CreateAdminModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'superadmin';
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'superadmin';
  }>>;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create New Admin
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'superadmin' }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">SuperAdmin</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
