"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity, 
  Calendar,
  Bell,
  Search,
  Settings,
  Star,
  Github,
  Linkedin,
  Mail
} from "lucide-react";

export default function Home() {
  const stats = [
    { title: "Total Users", value: "2,847", icon: Users, trend: "+12%" },
    { title: "Revenue", value: "$45,231", icon: TrendingUp, trend: "+8%" },
    { title: "Active Projects", value: "156", icon: Activity, trend: "+23%" },
    { title: "Growth Rate", value: "89%", icon: BarChart3, trend: "+5%" },
  ];

  const recentActivities = [
    { user: "Sarah Chen", action: "completed project review", time: "2 hours ago", avatar: "/avatars/sarah.jpg" },
    { user: "Mike Johnson", action: "updated design system", time: "4 hours ago", avatar: "/avatars/mike.jpg" },
    { user: "Emily Rodriguez", action: "published new article", time: "6 hours ago", avatar: "/avatars/emily.jpg" },
    { user: "David Kim", action: "launched feature update", time: "8 hours ago", avatar: "/avatars/david.jpg" },
  ];

  const projects = [
    { name: "E-commerce Platform", progress: 85, status: "In Progress", priority: "High" },
    { name: "Mobile App Redesign", progress: 92, status: "Review", priority: "Medium" },
    { name: "Analytics Dashboard", progress: 67, status: "Development", priority: "High" },
    { name: "User Authentication", progress: 100, status: "Completed", priority: "Low" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold">Nexium Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <ThemeToggle />
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Abdul Raheem! 👋</h2>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your projects today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-green-600 bg-green-100 dark:bg-green-900/20">
                    {stat.trend}
                  </Badge>
                  <span className="ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Project Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Project Overview
              </CardTitle>
              <CardDescription>Track your current projects and their progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={project.status === "Completed" ? "default" : "secondary"}
                          >
                            {project.status}
                          </Badge>
                          <Badge 
                            variant={project.priority === "High" ? "destructive" : project.priority === "Medium" ? "secondary" : "outline"}
                          >
                            {project.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.avatar} alt={activity.user} />
                      <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{' '}
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analytics & Insights</CardTitle>
            <CardDescription>Detailed views of your performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Total Engagement</h4>
                    <p className="text-2xl font-bold">94.5%</p>
                    <p className="text-sm text-muted-foreground">+2.1% from last week</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Conversion Rate</h4>
                    <p className="text-2xl font-bold">3.24%</p>
                    <p className="text-sm text-muted-foreground">+0.5% from last week</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Customer Satisfaction</h4>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="text-2xl font-bold ml-1">4.8</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Based on 1,024 reviews</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="mt-4">
                <div className="p-8 text-center border rounded-lg">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="font-medium mb-2">Advanced Analytics</h4>
                  <p className="text-muted-foreground">Detailed analytics dashboard would be implemented here</p>
                </div>
              </TabsContent>
              <TabsContent value="reports" className="mt-4">
                <div className="p-8 text-center border rounded-lg">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="font-medium mb-2">Reports & Exports</h4>
                  <p className="text-muted-foreground">Generate and download custom reports</p>
                </div>
              </TabsContent>
              <TabsContent value="settings" className="mt-4">
                <div className="p-8 text-center border rounded-lg">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="font-medium mb-2">Dashboard Settings</h4>
                  <p className="text-muted-foreground">Customize your dashboard preferences</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Section */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h3 className="font-semibold mb-2">Built with Modern Technologies</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Next.js 15</Badge>
                <Badge variant="outline">ShadCN UI</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">Lucide Icons</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}