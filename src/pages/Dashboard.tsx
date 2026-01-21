import React from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useApp } from '../contexts/AppContext'
import { useAuth } from '../contexts/AuthContext'
import {
  FileText,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
  Star,
  Plus
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export const Dashboard: React.FC = () => {
  const { projects, usageStats, currentPlan, upgradePlan } = useApp()
  const { user } = useAuth()
  const navigate = useNavigate()

  const stats = [
    {
      name: 'Documents Generated',
      value: usageStats.documentsGenerated.toString(),
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      name: 'Projects Analyzed',
      value: usageStats.projects.toString(),
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      name: 'Time Saved',
      value: `${Math.floor(usageStats.documentsGenerated * 2.5)}h`,
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      name: 'API Requests',
      value: usageStats.apiCalls.toString(),
      icon: Zap,
      color: 'text-orange-600'
    },
  ]

  const recentProjects = projects.slice(0, 4).map(project => ({
    name: project.name,
    language: project.language,
    generated: new Date(project.lastModified).toLocaleString(),
    rating: 5
  }))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return '1 day ago'
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  const handleUpgrade = () => {
    navigate('/billing')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-600 to-sky-600 rounded-2xl">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-8 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Transform your code into beautiful documentation with AI-powered analysis and generation.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="secondary"
                size="lg"
                className="!bg-white !text-teal-600 !border-0 hover:!bg-gray-100"
                onClick={() => navigate('/generate')}
              >
                Start Generating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="!bg-transparent !border-white !text-white hover:!bg-white/95 hover:!text-teal-700"
                onClick={() => navigate('/projects')}
              >
                View Projects
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6" hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Projects
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/projects')}
            >
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentProjects.length > 0 ? recentProjects.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{project.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {project.language} • {formatDate(project.generated)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < project.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No projects yet</p>
                <Button onClick={() => navigate('/generate')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Usage This Month
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">API Calls</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {usageStats.apiCalls} / {usageStats.maxApiCalls}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
                style={{ width: `${(usageStats.apiCalls / usageStats.maxApiCalls) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Storage Used</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {usageStats.storage}GB / {usageStats.maxStorage}GB
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                style={{ width: `${(usageStats.storage / usageStats.maxStorage) * 100}%` }}
              ></div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Current Plan: <span className="capitalize">{currentPlan}</span>
                </span>
                {currentPlan === 'free' && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full">
                    Limited
                  </span>
                )}
              </div>
              <Button className="w-full" onClick={handleUpgrade}>
                {currentPlan === 'free' ? 'Upgrade Plan' : 'Manage Billing'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}