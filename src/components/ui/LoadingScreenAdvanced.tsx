'use client'

import { Rocket, Zap } from 'lucide-react'

export default function LoadingScreenAdvanced() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
      {/* Particules de fond animées */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 bg-white full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Cercles concentriques animés */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="h-64 w-64 border-2 border-white/20 full animate-spin" style={{ animationDuration: '8s' }}></div>
          <div className="absolute inset-4 h-56 w-56 border-2 border-white/30 full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-8 h-48 w-48 border-2 border-white/40 full animate-spin" style={{ animationDuration: '4s' }}></div>
          <div className="absolute inset-12 h-40 w-40 border border-white/50 full animate-pulse"></div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center space-y-8">
        {/* Logo avec fusée animée */}
        <div className="relative">
          <div className="h-24 w-24 bg-white 2xl flex items-center justify-center mx-auto shadow-2xl">
            <Rocket className="h-12 w-12 text-blue-600 animate-bounce" />
          </div>

          {/* Traînée de la fusée */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-orange-400 full animate-ping" style={{ animationDelay: '0s' }}></div>
              <div className="h-1 w-1 bg-red-400 full animate-ping" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-1 w-1 bg-yellow-400 full animate-ping" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          {/* Éclats d'énergie */}
          <div className="absolute -top-2 -right-2">
            <Zap className="h-8 w-8 text-yellow-300 animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Zap className="h-6 w-6 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Texte avec effet néon */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg">
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Dashboard BOB
            </span>
          </h2>
          <p className="text-xl text-blue-100 drop-shadow-md">
            Initialisation des systèmes...
          </p>
        </div>

        {/* Barre de progression futuriste */}
        <div className="w-80 mx-auto space-y-2">
          <div className="bg-white/20 backdrop-blur-sm full h-3 overflow-hidden shadow-inner">
            <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 h-full full animate-pulse shadow-lg"
                 style={{ width: '75%', animation: 'progress 3s ease-in-out infinite' }}>
            </div>
          </div>
          <div className="flex justify-between text-xs text-blue-200">
            <span>Connexion données...</span>
            <span>75%</span>
          </div>
        </div>

        {/* Points de chargement avec effet vague */}
        <div className="flex justify-center space-x-3">
          <div className="h-3 w-3 bg-white full animate-bounce shadow-lg"></div>
          <div className="h-3 w-3 bg-blue-200 full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}></div>
          <div className="h-3 w-3 bg-purple-200 full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-3 w-3 bg-pink-200 full animate-bounce shadow-lg" style={{ animationDelay: '0.3s' }}></div>
        </div>

        {/* Indicateurs de status */}
        <div className="grid grid-cols-3 gap-4 text-xs text-blue-100">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-2 w-2 bg-green-400 full animate-pulse"></div>
            <span>Strapi ✓</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="h-2 w-2 bg-yellow-400 full animate-pulse"></div>
            <span>Système ⟳</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="h-2 w-2 bg-blue-400 full animate-pulse"></div>
            <span>UI ⟳</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0%, 100% { width: 65%; }
          50% { width: 85%; }
        }
      `}</style>
    </div>
  )
}