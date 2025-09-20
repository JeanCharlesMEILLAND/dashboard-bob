'use client'

import { Rocket } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Logo animé */}
        <div className="relative">
          <div className="h-20 w-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
            <Rocket className="h-10 w-10 text-white" />
          </div>
          <div className="absolute inset-0 h-20 w-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl animate-ping opacity-20 mx-auto"></div>
        </div>

        {/* Texte de chargement */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard BOB
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Chargement des données en cours...
          </p>
        </div>

        {/* Barre de progression */}
        <div className="w-64 mx-auto">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>

        {/* Points de chargement */}
        <div className="flex justify-center space-x-2">
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}