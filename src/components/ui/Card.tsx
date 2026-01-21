import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 ${className}`}
    >
      {children}
    </motion.div>
  )
}