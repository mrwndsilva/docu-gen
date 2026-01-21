import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useApp } from '../contexts/AppContext'
import {
  Check,
  CreditCard,
  Calendar,
  TrendingUp,
  Download,
  Crown
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '50 API calls per month',
      '1GB storage',
      'Basic documentation templates',
      'Community support',
      'Standard processing speed'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    period: 'per month',
    features: [
      '5,000 API calls per month',
      '50GB storage',
      'Advanced documentation templates',
      'Priority support',
      'Fast processing speed',
      'Custom branding',
      'API access'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$99',
    period: 'per month',
    features: [
      'Unlimited API calls',
      '500GB storage',
      'Custom documentation templates',
      'Dedicated support',
      'Fastest processing speed',
      'Custom branding',
      'API access',
      'Advanced analytics',
      'Team collaboration'
    ]
  }
]

const billingHistory = [
  { date: '2024-01-15', amount: '$29.00', status: 'Paid', invoice: 'INV-001', plan: 'Pro' },
  { date: '2023-12-15', amount: '$29.00', status: 'Paid', invoice: 'INV-002', plan: 'Pro' },
  { date: '2023-11-15', amount: '$29.00', status: 'Paid', invoice: 'INV-003', plan: 'Pro' },
  { date: '2023-10-15', amount: '$29.00', status: 'Paid', invoice: 'INV-004', plan: 'Pro' }
]

export const Billing: React.FC = () => {
  const { currentPlan, usageStats, upgradePlan } = useApp()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleUpgrade = (plan: typeof plans[0]) => {
    setSelectedPlan(plan)
    setShowUpgradeModal(true)
  }

  const confirmUpgrade = async () => {
    if (!selectedPlan) return

    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      upgradePlan(selectedPlan.id as 'free' | 'pro' | 'enterprise')
      toast.success(`Successfully upgraded to ${selectedPlan.name} plan!`)
      setShowUpgradeModal(false)
      setSelectedPlan(null)
      setProcessing(false)
    }, 2000)
  }

  const downloadInvoice = (invoice: string) => {
    // Simulate invoice download
    toast.success(`Invoice ${invoice} downloaded!`)
  }

  const getCurrentPlanDetails = () => {
    return plans.find(plan => plan.id === currentPlan) || plans[0]
  }

  const currentPlanDetails = getCurrentPlanDetails()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Billing & Plans
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Current Plan
          </h2>
          <div className="flex items-center space-x-2">
            {currentPlan !== 'free' && <Crown className="h-5 w-5 text-yellow-500" />}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentPlan === 'free'
                ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
              {currentPlan === 'free' ? 'Free Plan' : 'Active'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              {currentPlanDetails.name} Plan
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {currentPlanDetails.price}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentPlanDetails.period}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Usage This Month</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">API Calls</span>
                <span className="font-medium">{usageStats.apiCalls} / {usageStats.maxApiCalls}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${Math.min((usageStats.apiCalls / usageStats.maxApiCalls) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Storage</span>
                <span className="font-medium">{usageStats.storage}GB / {usageStats.maxStorage}GB</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${Math.min((usageStats.storage / usageStats.maxStorage) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Next Billing</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {currentPlan === 'free'
                ? 'No upcoming charges'
                : 'February 15, 2024'
              }
            </p>
            {currentPlan !== 'free' && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Auto-renewal enabled
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Subscription Plans */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Subscription Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-6 relative ${plan.popular ? 'ring-2 ring-purple-500' : ''} ${currentPlan === plan.id ? 'ring-2 ring-green-500' : ''
                }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                {currentPlan === plan.id && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Current
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(plan)}
                  variant={currentPlan === plan.id ? 'outline' : plan.popular ? 'primary' : 'secondary'}
                  className="w-full"
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id
                    ? 'Current Plan'
                    : currentPlan === 'free'
                      ? `Upgrade to ${plan.name}`
                      : `Switch to ${plan.name}`
                  }
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      {currentPlan !== 'free' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Billing History
            </h2>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Plan</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{item.date}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{item.plan}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">{item.amount}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadInvoice(item.invoice)}
                      >
                        {item.invoice}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Upgrade Subscription"
        maxWidth="max-w-md"
      >
        {selectedPlan && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {selectedPlan.name} Plan
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {selectedPlan.price}
                <span className="text-lg font-normal text-gray-500 ml-2">
                  {selectedPlan.period}
                </span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  Payment method: **** **** **** 4242
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  Next billing: {selectedPlan.id === 'free' ? 'No billing' : 'February 15, 2024'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedPlan.id === 'free'
                  ? 'You will be downgraded to the free plan. Your usage will be limited according to the free plan limits.'
                  : `You'll be charged ${selectedPlan.price} ${selectedPlan.period} starting immediately. You can cancel anytime from your billing settings.`
                }
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1"
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmUpgrade}
                className="flex-1"
                loading={processing}
              >
                {selectedPlan.id === 'free' ? 'Downgrade' : 'Confirm Upgrade'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}