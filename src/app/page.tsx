'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { useRequireAuth } from '@/lib/auth'

// Components
import Header from '@/components/layout/Header'
import LoadingScreenAdvanced from '@/components/ui/LoadingScreenAdvanced'
import DataDashboardPro from '@/components/dashboard/DataDashboardPro'
import DevOpsDashboardPro from '@/components/dashboard/DevOpsDashboardPro'

export default function Dashboard() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth()
  const [mode, setMode] = useState<'data' | 'devops'>('devops')
  const [notifications] = useState<number>(3)
  const [isLoading, setIsLoading] = useState(true)
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(loadingTimer)
  }, [])

  const toggleMode = () => {
    setMode(prev => prev === 'data' ? 'devops' : 'data')
  }

  // Afficher le loading si l'auth est en cours ou si le dashboard charge
  if (authLoading || isLoading) {
    return <LoadingScreenAdvanced />
  }

  // Si pas authentifié, le useRequireAuth redirige automatiquement
  if (!isAuthenticated) {
    return <LoadingScreenAdvanced />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      {/* Header fixe */}
      <Header
        mode={mode}
        onModeToggle={toggleMode}
        notifications={notifications}
        onNotificationsClick={() => setShowNotificationPanel(true)}
      />



      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="w-full">
          {/* Mode indicator avec animation */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg px-6 py-3 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-900/5">
              <div className={`h-3 w-3 animate-pulse ${
                mode === 'data' ? 'bg-blue-500' : 'bg-green-500'
              }`}></div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {mode === 'data' ? '📊 Data Analytics Mode' : '⚙️ DevOps System Mode'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500 animate-bounce" />
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="relative">
            {/* Animation de transition */}
            <div className="transition-all duration-500 ease-in-out">
              {mode === 'data' ? <DataDashboardPro /> : <DevOpsDashboardPro />}
            </div>
          </div>
        </div>
      </main>

      {/* Notification Panel - Version améliorée */}
      {showNotificationPanel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] animate-in fade-in duration-200">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  3 nouvelles notifications
                </p>
              </div>
              <button
                onClick={() => setShowNotificationPanel(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Nouveau utilisateur inscrit',
                  time: 'Il y a 2 min',
                  type: 'info',
                  description: 'Jean-Charles M. vient de créer un compte'
                },
                {
                  title: 'Utilisation CPU élevée détectée',
                  time: 'Il y a 5 min',
                  type: 'warning',
                  description: 'Serveur principal à 87% d\'utilisation'
                },
                {
                  title: 'Sauvegarde complétée avec succès',
                  time: 'Il y a 10 min',
                  type: 'success',
                  description: 'Base de données sauvegardée (2.3 GB)'
                }
              ].map((notif, index) => (
                <div key={index} className={`p-4 border-l-4 transition-all duration-200 hover:shadow-md ${
                  notif.type === 'warning' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-400' :
                  notif.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-400' :
                  'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-400'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{notif.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notif.description}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                      {notif.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}