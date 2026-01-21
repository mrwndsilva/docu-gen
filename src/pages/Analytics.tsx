import React from 'react'
import { Card } from '../components/ui/Card'
import { useApp } from '../contexts/AppContext'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText,
  Clock,
  Zap
} from 'lucide-react'

export const Analytics: React.FC = () => {
  const { projects, usageStats, currentPlan } = useApp()

  // Generate usage data based on current stats
  const usageData = [
    { date: '2024-01-01', requests: Math.max(0, usageStats.apiCalls - 30), storage: Math.max(0, usageStats.storage - 0.5) },
    { date: '2024-01-02', requests: Math.max(0, usageStats.apiCalls - 25), storage: Math.max(0, usageStats.storage - 0.4) },
    { date: '2024-01-03', requests: Math.max(0, usageStats.apiCalls - 20), storage: Math.max(0, usageStats.storage - 0.3) },
    { date: '2024-01-04', requests: Math.max(0, usageStats.apiCalls - 15), storage: Math.max(0, usageStats.storage - 0.2) },
    { date: '2024-01-05', requests: Math.max(0, usageStats.apiCalls - 10), storage: Math.max(0, usageStats.storage - 0.1) },
    { date: '2024-01-06', requests: Math.max(0, usageStats.apiCalls - 5), storage: usageStats.storage },
    { date: '2024-01-07', requests: usageStats.apiCalls, storage: usageStats.storage },
  ]

  // Generate language data from projects
  const languageStats = projects.reduce((acc, project) => {
    acc[project.language] = (acc[project.language] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const languageData = Object.entries(languageStats).map(([name, value], index) => ({
    name,
    value,
    color: ['#f7df1e', '#3776ab', '#3178c6', '#ed8b00', '#6b7280'][index % 5]
  }))

  // Generate project data over time
  const projectData = [
    { name: 'Jan', projects: Math.max(0, usageStats.projects - 3) },
    { name: 'Feb', projects: Math.max(0, usageStats.projects - 2) },
    { name: 'Mar', projects: Math.max(0, usageStats.projects - 1) },
    { name: 'Apr', projects: usageStats.projects },
    { name: 'May', projects: usageStats.projects + 2 },
    { name: 'Jun', projects: usageStats.projects + 4 },
  ]

  const stats = [
    {
      name: 'Total Requests',
      value: usageStats.apiCalls.toString(),
      change: '+12%',
      trend: 'up',
      icon: Zap,
      color: 'blue'
    },
    {
      name: 'Projects',
      value: usageStats.projects.toString(),
      change: '+8%',
      trend: 'up',
      icon: FileText,
      color: 'green'
    },
    {
      name: 'Storage Used',
      value: `${usageStats.storage}GB`,
      change: '-2%',
      trend: 'down',
      icon: Users,
      color: 'purple'
    },
    {
      name: 'Avg. Response Time',
      value: '2.3s',
      change: '+15%',
      trend: 'up',
      icon: Clock,
      color: 'orange'
    }
  ]

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600',
      green: 'bg-green-100 dark:bg-green-900 text-green-600',
      purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600',
      orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your documentation generation usage and performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <div className={`flex items-center text-sm mt-1 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            API Usage Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Projects by Month
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="projects" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {languageData.length > 0 ? (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Programming Languages
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        ) : (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Programming Languages
            </h3>
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No projects yet</p>
                <p className="text-sm">Create projects to see language distribution</p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Storage Usage
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="storage" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Plan Usage Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Plan Usage Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Current Plan</h4>
            <p className="text-2xl font-bold text-purple-600 capitalize">{currentPlan}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentPlan === 'free' ? 'Limited features' : 'Full access'}
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">API Usage</h4>
            <p className="text-2xl font-bold text-blue-600">
              {((usageStats.apiCalls / usageStats.maxApiCalls) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {usageStats.apiCalls} / {usageStats.maxApiCalls} calls
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Storage Usage</h4>
            <p className="text-2xl font-bold text-green-600">
              {((usageStats.storage / usageStats.maxStorage) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {usageStats.storage}GB / {usageStats.maxStorage}GB
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}