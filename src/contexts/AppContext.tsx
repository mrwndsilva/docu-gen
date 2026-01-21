import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

interface Project {
  id: string
  name: string
  language: string
  createdAt: string
  lastModified: string
  status: 'completed' | 'processing' | 'failed'
  fileCount: number
  size: string
  documentation?: string
}

interface UsageStats {
  apiCalls: number
  maxApiCalls: number
  storage: number
  maxStorage: number
  projects: number
  documentsGenerated: number
}

interface AppContextType {
  projects: Project[]
  usageStats: UsageStats
  currentPlan: 'free' | 'pro' | 'enterprise'
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  incrementUsage: (type: 'apiCalls' | 'storage', amount: number) => void
  upgradePlan: (plan: 'free' | 'pro' | 'enterprise') => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'enterprise'>('free')
  const [usageStats, setUsageStats] = useState<UsageStats>({
    apiCalls: 23,
    maxApiCalls: 50,
    storage: 2.3,
    maxStorage: 10,
    projects: 4,
    documentsGenerated: 12
  })

  // Load data from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedProjects = localStorage.getItem(`projects_${user.id}`)
      const savedPlan = localStorage.getItem(`plan_${user.id}`)
      const savedUsage = localStorage.getItem(`usage_${user.id}`)

      if (savedProjects) {
        setProjects(JSON.parse(savedProjects))
      } else {
        // Initialize with sample data
        const sampleProjects: Project[] = [
          {
            id: '1',
            name: 'E-commerce API',
            language: 'Python',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            fileCount: 12,
            size: '2.4 MB'
          },
          {
            id: '2',
            name: 'React Dashboard',
            language: 'JavaScript',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            lastModified: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            fileCount: 8,
            size: '1.8 MB'
          },
          {
            id: '3',
            name: 'User Auth Service',
            language: 'Node.js',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            fileCount: 6,
            size: '1.2 MB'
          },
          {
            id: '4',
            name: 'Data Pipeline',
            language: 'Python',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            fileCount: 15,
            size: '3.1 MB'
          }
        ]
        setProjects(sampleProjects)
      }

      if (savedPlan) {
        setCurrentPlan(savedPlan as 'free' | 'pro' | 'enterprise')
      }

      if (savedUsage) {
        setUsageStats(JSON.parse(savedUsage))
      }
    }
  }, [user])

  // Save data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`projects_${user.id}`, JSON.stringify(projects))
    }
  }, [projects, user])

  useEffect(() => {
    if (user) {
      localStorage.setItem(`plan_${user.id}`, currentPlan)
    }
  }, [currentPlan, user])

  useEffect(() => {
    if (user) {
      localStorage.setItem(`usage_${user.id}`, JSON.stringify(usageStats))
    }
  }, [usageStats, user])

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setProjects(prev => [newProject, ...prev])
    setUsageStats(prev => ({
      ...prev,
      projects: prev.projects + 1,
      documentsGenerated: prev.documentsGenerated + 1
    }))
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, ...updates, lastModified: new Date().toISOString() }
        : project
    ))
  }

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id))
    setUsageStats(prev => ({
      ...prev,
      projects: Math.max(0, prev.projects - 1)
    }))
  }

  const incrementUsage = (type: 'apiCalls' | 'storage', amount: number) => {
    setUsageStats(prev => ({
      ...prev,
      [type]: prev[type] + amount
    }))
  }

  const upgradePlan = (plan: 'free' | 'pro' | 'enterprise') => {
    setCurrentPlan(plan)
    
    // Update usage limits based on plan
    const limits = {
      free: { maxApiCalls: 50, maxStorage: 10 },
      pro: { maxApiCalls: 5000, maxStorage: 50 },
      enterprise: { maxApiCalls: 999999, maxStorage: 500 }
    }
    
    setUsageStats(prev => ({
      ...prev,
      maxApiCalls: limits[plan].maxApiCalls,
      maxStorage: limits[plan].maxStorage
    }))
  }

  const value = {
    projects,
    usageStats,
    currentPlan,
    addProject,
    updateProject,
    deleteProject,
    incrementUsage,
    upgradePlan
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}