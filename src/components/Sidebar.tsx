import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  FileText,
  Settings,
  CreditCard,
  BarChart3,
  Upload,
  Code,
  Sparkles
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Generate Docs', href: '/generate', icon: Sparkles },
  { name: 'My Projects', href: '/projects', icon: FileText },
  { name: 'Upload Code', href: '/upload', icon: Upload },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Code className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            DocuMind
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg p-4 text-white">
          <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
          <p className="text-sm opacity-90 mb-3">
            Unlock unlimited documentation generation
          </p>
          <button className="w-full bg-white text-purple-600 font-medium py-2 px-4 rounded-lg text-sm hover:bg-gray-100 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  )
}