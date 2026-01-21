import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useApp } from '../contexts/AppContext'
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Key,
  Trash2,
  Save,
  Moon,
  Sun
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export const Settings: React.FC = () => {
  const { user, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { currentPlan, usageStats } = useApp()
  
  const [profile, setProfile] = useState({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    company: '',
    timezone: 'UTC'
  })
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
    security: true
  })
  
  const [apiKey, setApiKey] = useState('sk-...' + Math.random().toString(36).substr(2, 20))
  const [showApiKey, setShowApiKey] = useState(false)

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    toast.success('Profile updated successfully!')
  }

  const handleSaveNotifications = () => {
    // In a real app, this would save to the backend
    toast.success('Notification preferences updated!')
  }

  const generateNewApiKey = () => {
    setApiKey('sk-...' + Math.random().toString(36).substr(2, 20))
    toast.success('New API key generated!')
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    toast.success('API key copied to clipboard!')
  }

  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, this would delete the account
      toast.success('Account deletion initiated. You will receive a confirmation email.')
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <User className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Profile Information
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              label="Display Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Your display name"
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="your@email.com"
            />
            <Input
              label="Company"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              placeholder="Your company name"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="GMT">Greenwich Mean Time</option>
              </select>
            </div>
          </div>
          
          <Button onClick={handleSaveProfile}>
            <Save className="h-4 w-4 mr-2" />
            Save Profile
          </Button>
        </Card>

        {/* Appearance Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Palette className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Appearance
            </h2>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Theme</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose between light and dark mode
              </p>
            </div>
            <Button
              variant="outline"
              onClick={toggleTheme}
              className="flex items-center space-x-2"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Notifications
            </h2>
          </div>
          
          <div className="space-y-4 mb-6">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {key === 'push' ? 'Push Notifications' : 
                     key === 'marketing' ? 'Marketing Emails' :
                     key === 'security' ? 'Security Alerts' : 'Email Notifications'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {key === 'email' ? 'Receive email notifications for important updates' :
                     key === 'push' ? 'Get push notifications in your browser' :
                     key === 'marketing' ? 'Receive updates about new features and offers' :
                     'Get notified about security-related events'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>
            ))}
          </div>
          
          <Button onClick={handleSaveNotifications}>
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </Card>

        {/* API Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Key className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              API Access
            </h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">API Key</h3>
              <div className="flex items-center space-x-2">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-mono text-sm"
                />
                <Button
                  variant="outline"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </Button>
                <Button
                  variant="outline"
                  onClick={copyApiKey}
                >
                  Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={generateNewApiKey}
                >
                  Regenerate
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Use this API key to access DocuMind programmatically. Keep it secure!
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Usage Limits</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                  <span className="ml-2 font-medium capitalize">{currentPlan}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">API Calls:</span>
                  <span className="ml-2 font-medium">{usageStats.apiCalls} / {usageStats.maxApiCalls}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Security
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Change Password</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your account password
                </p>
              </div>
              <Button variant="outline">
                Change Password
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline">
                Enable 2FA
              </Button>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-red-600">Delete Account</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={deleteAccount}
                  className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}