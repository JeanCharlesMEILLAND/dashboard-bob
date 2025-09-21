'use client'

import { Bell, Settings, User, Search, Sun, Moon, LogOut, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth'

interface HeaderProps {
  mode: 'data' | 'devops'
  onModeToggle: () => void
  notifications: number
  onNotificationsClick: () => void
}

export default function Header({ mode, onModeToggle, notifications, onNotificationsClick }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre - Gauche */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div className="space-y-0.5">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none">
                BOB Dashboard
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-none">
                Mode {mode === 'data' ? 'Analytics' : 'DevOps'}
              </p>
            </div>
          </div>

          {/* Mode Toggle - Centre */}
          <div className="flex-1 flex justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-1 flex gap-1 shadow-inner">
              <button
                onClick={onModeToggle}
                className={`px-6 py-2.5 text-sm font-medium  transition-all duration-200 ${
                  mode === 'data'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                📊 Data Analytics
              </button>
              <button
                onClick={onModeToggle}
                className={`px-6 py-2.5 text-sm font-medium  transition-all duration-200 ${
                  mode === 'devops'
                    ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                ⚙️ DevOps System
              </button>
            </div>
          </div>

          {/* Actions - Droite */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-56 px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200  hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <button
              onClick={onNotificationsClick}
              className="relative p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200  hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs  flex items-center justify-center font-semibold">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200  hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            {/* Profile avec menu déroulant */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.username || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || 'admin@bob.com'}
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Menu déroulant */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.username || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || 'admin@bob.com'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      // Vous pouvez ajouter d'autres actions ici
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Mon profil
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      // Vous pouvez ajouter d'autres actions ici
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Paramètres
                  </button>

                  <hr className="my-2 border-gray-200 dark:border-gray-700" />

                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      logout()
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}