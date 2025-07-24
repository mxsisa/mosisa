import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  CreditCard,
  Clock,
  DollarSign,
  TrendingUp,
  UserCheck,
  Calendar,
  Download,
  Eye,
  AlertCircle,
  RefreshCw,
  Stethoscope,
  FileText,
  UserX,
} from "lucide-react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserData {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  lastLogin?: Date;
  subscriptionStatus?: "trial" | "active" | "cancelled" | "expired";
  plan?: "individual" | "clinic";
  trialStarted?: Date;
  trialEnded?: Date;
  subscriptionStarted?: Date;
  totalSOAPGenerated?: number;
  lastActivity?: Date;
}

interface AnalyticsData {
  totalUsers: number;
  activeTrials: number;
  activeSubscriptions: number;
  totalRevenue: number;
  signupsToday: number;
  signupsThisWeek: number;
  signupsThisMonth: number;
  conversionRate: number;
  averageSOAPPerUser: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Admin() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Generate mock data for testing
  const generateMockData = () => {
    const mockUsers: UserData[] = [
      {
        id: currentUser?.uid || "admin-user",
        email: currentUser?.email || "admin@example.com",
        displayName: currentUser?.displayName || "Admin User",
        createdAt: new Date(),
        subscriptionStatus: "active",
        plan: "individual",
        totalSOAPGenerated: 15,
        lastActivity: new Date(),
      },
      {
        id: "user-2",
        email: "doctor.smith@clinic.com",
        displayName: "Dr. Smith",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        subscriptionStatus: "trial",
        plan: "clinic",
        totalSOAPGenerated: 8,
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: "user-3",
        email: "nurse.johnson@hospital.com",
        displayName: "Nurse Johnson",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        subscriptionStatus: "active",
        plan: "individual",
        totalSOAPGenerated: 22,
        lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ];

    console.log("🧪 Admin - Using mock data for testing");
    setUsers(mockUsers);
    calculateAnalytics(mockUsers);
  };

  // Check if user is admin (only Mosisa Saba)
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const adminEmails = ["mosisasaba04@gmail.com", "mosisa@autosoapai.com"];
    if (!adminEmails.includes(currentUser.email?.toLowerCase() || "")) {
      navigate("/app"); // Redirect non-admin users to regular app
      return;
    }
  }, [currentUser, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔍 Admin - Fetching user data from Firestore...");
      console.log("🔍 Admin - Firebase config:", {
        projectId: db.app.options.projectId,
      });

      // Try a simple query first without ordering to test permissions
      try {
        const usersRef = collection(db, "users");
        console.log("📊 Admin - Testing basic collection access...");

        // First try without ordering
        let usersSnapshot;
        try {
          usersSnapshot = await getDocs(
            query(usersRef, orderBy("createdAt", "desc")),
          );
          console.log("✅ Admin - Ordered query successful");
        } catch (orderError) {
          console.warn(
            "⚠️ Admin - Ordered query failed, trying basic query:",
            orderError,
          );
          usersSnapshot = await getDocs(usersRef);
          console.log("✅ Admin - Basic query successful");
        }

        console.log("📊 Admin - Found", usersSnapshot.size, "user documents");

        if (usersSnapshot.empty) {
          console.log("📊 Admin - No users found in database");
          setUsers([]);
          calculateAnalytics([]);
          return;
        }

        const usersData: UserData[] = [];
        usersSnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("👤 Admin - Processing user:", doc.id, data.email, data);

          usersData.push({
            id: doc.id,
            email: data.email || "No email",
            displayName: data.displayName || data.name || "",
            createdAt: data.createdAt?.toDate() || new Date(),
            lastLogin: data.lastLogin?.toDate(),
            subscriptionStatus:
              data.subscriptionStatus || data.status || "none",
            plan: data.plan || data.planType || "none",
            trialStarted: data.trialStarted?.toDate(),
            trialEnded: data.trialEnded?.toDate(),
            subscriptionStarted: data.subscriptionStarted?.toDate(),
            totalSOAPGenerated: data.totalSOAPGenerated || 0,
            lastActivity: data.lastActivity?.toDate(),
          });
        });

        console.log(
          "✅ Admin - Processed",
          usersData.length,
          "users successfully",
        );
        setUsers(usersData);
        calculateAnalytics(usersData);
      } catch (firestoreError) {
        console.error("❌ Admin - Firestore access error:", firestoreError);
        throw new Error(
          `Firestore Error: ${firestoreError instanceof Error ? firestoreError.message : "Unknown error"}`,
        );
      }
    } catch (err) {
      console.error("❌ Admin - Error fetching user data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load user data. Check console for details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (usersData: UserData[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalUsers = usersData.length;
    const activeTrials = usersData.filter(
      (u) => u.subscriptionStatus === "trial",
    ).length;
    const activeSubscriptions = usersData.filter(
      (u) => u.subscriptionStatus === "active",
    ).length;

    // Calculate revenue (estimates based on plan pricing)
    const totalRevenue = usersData.reduce((total, user) => {
      if (user.subscriptionStatus === "active") {
        return total + (user.plan === "clinic" ? 399 : 99);
      }
      return total;
    }, 0);

    const signupsToday = usersData.filter((u) => u.createdAt >= today).length;
    const signupsThisWeek = usersData.filter(
      (u) => u.createdAt >= weekAgo,
    ).length;
    const signupsThisMonth = usersData.filter(
      (u) => u.createdAt >= monthAgo,
    ).length;

    const trialsStarted = usersData.filter((u) => u.trialStarted).length;
    const conversionRate =
      trialsStarted > 0 ? (activeSubscriptions / trialsStarted) * 100 : 0;

    const totalSOAP = usersData.reduce(
      (total, user) => total + (user.totalSOAPGenerated || 0),
      0,
    );
    const averageSOAPPerUser = totalUsers > 0 ? totalSOAP / totalUsers : 0;

    setAnalytics({
      totalUsers,
      activeTrials,
      activeSubscriptions,
      totalRevenue,
      signupsToday,
      signupsThisWeek,
      signupsThisMonth,
      conversionRate,
      averageSOAPPerUser,
    });
  };

  const exportUsersToCSV = () => {
    if (users.length === 0) {
      alert("No users to export");
      return;
    }

    const csvHeaders = [
      "ID",
      "Email",
      "Name",
      "Status",
      "Plan",
      "Joined",
      "SOAP Notes Generated",
      "Last Activity",
    ];

    const csvData = users.map((user) => [
      user.id,
      user.email,
      user.displayName || "",
      user.subscriptionStatus || "none",
      user.plan || "none",
      user.createdAt.toISOString(),
      user.totalSOAPGenerated || 0,
      user.lastActivity?.toISOString() || "",
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `autosoap-users-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const chartData = users
    .slice(0, 30)
    .reverse()
    .map((user, index) => ({
      day: `Day ${index + 1}`,
      signups: users.filter(
        (u) => u.createdAt.toDateString() === user.createdAt.toDateString(),
      ).length,
    }));

  const subscriptionPieData = analytics
    ? [
        {
          name: "Active Subscriptions",
          value: analytics.activeSubscriptions,
          color: "#00C49F",
        },
        {
          name: "Active Trials",
          value: analytics.activeTrials,
          color: "#0088FE",
        },
        {
          name: "Expired/Cancelled",
          value:
            analytics.totalUsers -
            analytics.activeSubscriptions -
            analytics.activeTrials,
          color: "#FF8042",
        },
      ]
    : [];

  if (
    !currentUser ||
    !["mosisasaba04@gmail.com", "mosisa@autosoapai.com"].includes(
      currentUser.email?.toLowerCase() || "",
    )
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. This page is restricted to administrators only.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* Navigation */}
      <nav className="border-b border-teal-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fd4bb3b0714a54197a5434d0a880db38b%2F770326a6339b45a491c03f11547cff14?format=webp&width=800"
                alt="AutoSOAP AI Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-gray-900">
                AutoSOAP AI
              </span>
              <Badge variant="secondary" className="ml-2">
                Admin
              </Badge>
            </Link>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={generateMockData}
                disabled={loading}
                className="text-orange-600 hover:text-orange-700 border-orange-200"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Test Data
              </Button>
              <Button
                variant="ghost"
                onClick={fetchUserData}
                disabled={loading}
                className="text-gray-600 hover:text-primary"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/app">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Open App
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor user activity, subscriptions, and platform analytics
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {analytics && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            Total Users
                          </p>
                          <p className="text-3xl font-bold text-gray-900">
                            {loading ? "..." : analytics?.totalUsers || 0}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">
                          +{analytics?.signupsToday || 0} today
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            Active Trials
                          </p>
                          <p className="text-3xl font-bold text-blue-600">
                            {loading ? "..." : analytics?.activeTrials || 0}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-blue-500" />
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <Calendar className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-blue-600">7-day trials</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            Paid Subscriptions
                          </p>
                          <p className="text-3xl font-bold text-green-600">
                            {loading
                              ? "..."
                              : analytics?.activeSubscriptions || 0}
                          </p>
                        </div>
                        <CreditCard className="w-8 h-8 text-green-500" />
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <UserCheck className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">
                          {(analytics?.conversionRate || 0).toFixed(1)}%
                          conversion
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            Monthly Revenue
                          </p>
                          <p className="text-3xl font-bold text-primary">
                            ${loading ? "..." : analytics?.totalRevenue || 0}
                          </p>
                        </div>
                        <DollarSign className="w-8 h-8 text-primary" />
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-primary mr-1" />
                        <span className="text-primary">Recurring revenue</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Signups (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="signups"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={subscriptionPieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {subscriptionPieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchUserData}
                    disabled={loading}
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportUsersToCSV}
                    disabled={users.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading users...</span>
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No users found</p>
                    <p className="text-sm">
                      Users will appear here once they sign up
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="mb-4 text-sm text-gray-600">
                      Showing {users.length} user{users.length !== 1 ? "s" : ""}
                    </div>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium text-gray-600">
                            User
                          </th>
                          <th className="text-left p-3 font-medium text-gray-600">
                            Status
                          </th>
                          <th className="text-left p-3 font-medium text-gray-600">
                            Plan
                          </th>
                          <th className="text-left p-3 font-medium text-gray-600">
                            Joined
                          </th>
                          <th className="text-left p-3 font-medium text-gray-600">
                            SOAP Notes
                          </th>
                          <th className="text-left p-3 font-medium text-gray-600">
                            Last Activity
                          </th>
                          <th className="text-left p-3 font-medium text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-3">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {user.displayName || "No name"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {user.email}
                                </div>
                                <div className="text-xs text-gray-400">
                                  ID: {user.id.substring(0, 8)}...
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <Badge
                                variant={
                                  user.subscriptionStatus === "active"
                                    ? "default"
                                    : user.subscriptionStatus === "trial"
                                      ? "secondary"
                                      : "outline"
                                }
                                className={
                                  user.subscriptionStatus === "active"
                                    ? "bg-green-100 text-green-800"
                                    : user.subscriptionStatus === "trial"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-600"
                                }
                              >
                                {user.subscriptionStatus || "none"}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge variant="outline">
                                {user.plan === "individual"
                                  ? "Individual"
                                  : user.plan === "clinic"
                                    ? "Clinic"
                                    : "None"}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm text-gray-600">
                              <div>{user.createdAt.toLocaleDateString()}</div>
                              <div className="text-xs text-gray-400">
                                {user.createdAt.toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="text-sm font-medium">
                                {user.totalSOAPGenerated || 0}
                              </div>
                              <div className="text-xs text-gray-400">
                                generated
                              </div>
                            </td>
                            <td className="p-3 text-sm text-gray-600">
                              {user.lastActivity ? (
                                <div>
                                  <div>
                                    {user.lastActivity.toLocaleDateString()}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {user.lastActivity.toLocaleTimeString()}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">
                                  No activity
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="View SOAP Notes"
                                >
                                  <FileText className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Today</span>
                        <span className="font-medium">
                          {analytics?.signupsToday} signups
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">This Week</span>
                        <span className="font-medium">
                          {analytics?.signupsThisWeek} signups
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          This Month
                        </span>
                        <span className="font-medium">
                          {analytics?.signupsThisMonth} signups
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Usage Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Avg SOAP/User
                        </span>
                        <span className="font-medium">
                          {analytics?.averageSOAPPerUser.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total SOAP Notes
                        </span>
                        <span className="font-medium">
                          {users.reduce(
                            (total, user) =>
                              total + (user.totalSOAPGenerated || 0),
                            0,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Trial → Paid
                        </span>
                        <span className="font-medium">
                          {analytics?.conversionRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Trials Started
                        </span>
                        <span className="font-medium">
                          {users.filter((u) => u.trialStarted).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Individual Plans</span>
                      <span className="text-lg font-bold">
                        $
                        {users.filter(
                          (u) =>
                            u.subscriptionStatus === "active" &&
                            u.plan === "individual",
                        ).length * 99}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Clinic Plans</span>
                      <span className="text-lg font-bold">
                        $
                        {users.filter(
                          (u) =>
                            u.subscriptionStatus === "active" &&
                            u.plan === "clinic",
                        ).length * 399}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                      <span className="font-bold text-primary">
                        Total Monthly Revenue
                      </span>
                      <span className="text-xl font-bold text-primary">
                        ${analytics?.totalRevenue}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Individual
                        </span>
                        <span className="font-medium">
                          {users.filter((u) => u.plan === "individual").length}{" "}
                          users
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(users.filter((u) => u.plan === "individual").length / analytics?.totalUsers!) * 100 || 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Clinic</span>
                        <span className="font-medium">
                          {users.filter((u) => u.plan === "clinic").length}{" "}
                          users
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${(users.filter((u) => u.plan === "clinic").length / analytics?.totalUsers!) * 100 || 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
