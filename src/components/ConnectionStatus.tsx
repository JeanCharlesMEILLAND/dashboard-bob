'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react'

export default function ConnectionStatus() {
  const [status, setStatus] = useState({
    strapi: 'checking',
    systemApi: 'checking',
    hostinger: 'not-configured'
  })

  useEffect(() => {
    checkConnections()
  }, [])

  const checkConnections = async () => {
    // Test Strapi
    try {
      const strapiResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/users`)
      setStatus(prev => ({
        ...prev,
        strapi: strapiResponse.ok ? 'connected' : 'error'
      }))
    } catch {
      setStatus(prev => ({
        ...prev,
        strapi: 'disconnected'
      }))
    }

    // Test System API
    try {
      const systemResponse = await fetch(`${process.env.NEXT_PUBLIC_SYSTEM_API_URL || 'http://localhost:3001'}/health`)
      setStatus(prev => ({
        ...prev,
        systemApi: systemResponse.ok ? 'connected' : 'error'
      }))
    } catch {
      setStatus(prev => ({
        ...prev,
        systemApi: 'disconnected'
      }))
    }

    // Test Hostinger (si configuré)
    if (process.env.HOSTINGER_API_TOKEN) {
      setStatus(prev => ({
        ...prev,
        hostinger: 'configured'
      }))
    }
  }

  const getStatusIcon = (connectionStatus: string) => {
    switch (connectionStatus) {
      case 'connected':
      case 'configured':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'disconnected':
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'checking':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'not-configured':
        return <WifiOff className="h-4 w-4 text-gray-400" />
      default:
        return <Wifi className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusText = (service: string, connectionStatus: string) => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connecté'
      case 'configured':
        return 'Configuré'
      case 'disconnected':
        return 'Déconnecté (utilise données de démonstration)'
      case 'error':
        return 'Erreur de connexion'
      case 'checking':
        return 'Vérification...'
      case 'not-configured':
        return 'Non configuré'
      default:
        return 'Inconnu'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">État des Connexions</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.strapi)}
            <span className="text-sm text-gray-600 dark:text-gray-300">Strapi BOB</span>
          </div>
          <span className="text-xs text-gray-500">{getStatusText('strapi', status.strapi)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.systemApi)}
            <span className="text-sm text-gray-600 dark:text-gray-300">API Système</span>
          </div>
          <span className="text-xs text-gray-500">{getStatusText('systemApi', status.systemApi)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.hostinger)}
            <span className="text-sm text-gray-600 dark:text-gray-300">Hostinger</span>
          </div>
          <span className="text-xs text-gray-500">{getStatusText('hostinger', status.hostinger)}</span>
        </div>
      </div>

      <button
        onClick={checkConnections}
        className="mt-3 w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
      >
        Actualiser
      </button>
    </div>
  )
}