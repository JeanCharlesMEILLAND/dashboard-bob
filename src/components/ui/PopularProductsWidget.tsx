'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Star, ArrowUpRight, Package, Users, Clock, Award } from 'lucide-react'
import { strapiService } from '@/lib/api'
import Card from './Card'

interface PopularProductsWidgetProps {
  className?: string
}

export default function PopularProductsWidget({ className = '' }: PopularProductsWidgetProps) {
  const [products, setProducts] = useState<any[]>([])
  const [bobAnalytics, setBobAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Récupérer les produits et analytics en parallèle
        const [productsData, bobData] = await Promise.all([
          strapiService.getPopularProducts(),
          strapiService.getAllBobRequests()
        ])

        setProducts(productsData)

        // Analyser les données BOB pour créer des statistiques
        const analytics = analyzePopularProducts(bobData)
        setBobAnalytics(analytics)

      } catch (error) {
        console.error('Erreur chargement données produits:', error)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  // Analyser les données pour identifier les produits/services populaires
  const analyzePopularProducts = (bobData: any) => {
    const stats = {
      totalRequests: 0,
      mostRequestedCategories: [],
      topProducts: [],
      trends: {
        emprunts: bobData.emprunts?.length || 0,
        prets: bobData.prets?.length || 0,
        services: bobData.services?.length || 0
      }
    }

    stats.totalRequests = stats.trends.emprunts + stats.trends.prets + stats.trends.services

    // Catégories les plus demandées (simulé en attendant la vraie structure de données)
    stats.mostRequestedCategories = [
      { name: 'Électronique', count: Math.floor(stats.trends.emprunts * 0.4), trend: '+23%' },
      { name: 'Véhicules', count: Math.floor(stats.trends.emprunts * 0.3), trend: '+18%' },
      { name: 'Immobilier', count: Math.floor(stats.trends.prets * 0.6), trend: '+31%' },
      { name: 'Services Pro', count: Math.floor(stats.trends.services * 0.5), trend: '+12%' },
      { name: 'Bricolage', count: Math.floor(stats.trends.emprunts * 0.2), trend: '+8%' }
    ].sort((a, b) => b.count - a.count)

    // Produits populaires simulés
    stats.topProducts = [
      { name: 'iPhone 15 Pro', category: 'Électronique', requests: 45, type: 'emprunt', avgDuration: '7j' },
      { name: 'Tesla Model 3', category: 'Véhicules', requests: 23, type: 'emprunt', avgDuration: '3j' },
      { name: 'Prêt Immobilier', category: 'Immobilier', requests: 67, type: 'pret', avgDuration: '25 ans' },
      { name: 'MacBook Pro M3', category: 'Électronique', requests: 38, type: 'emprunt', avgDuration: '14j' },
      { name: 'Consultation Legal', category: 'Services Pro', requests: 29, type: 'service', avgDuration: '2h' }
    ]

    return stats
  }

  if (loading) {
    return (
      <Card className={`${className} bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-xl`} padding="lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`${className} bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-xl`} padding="lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            Produits & Services Populaires
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Les plus demandés par vos utilisateurs
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>Temps réel</span>
        </div>
      </div>

      {/* Statistiques rapides */}
      {bobAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{bobAnalytics.totalRequests}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total BOBs</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-700/50">
            <div className="flex items-center gap-3">
              <ArrowUpRight className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{bobAnalytics.trends.emprunts}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Emprunts</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/50">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{bobAnalytics.trends.prets}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Prêts</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 border border-orange-200/50 dark:border-orange-700/50">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{bobAnalytics.trends.services}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Services</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Catégories */}
      {bobAnalytics && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Top Catégories
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {bobAnalytics.mostRequestedCategories.slice(0, 5).map((category: any, index: number) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg p-3 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all duration-200"
              >
                <div className="text-center">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{category.name}</p>
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{category.count}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">{category.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Produits */}
      {bobAnalytics && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🏆 Produits les Plus Demandés
          </h4>
          <div className="space-y-3">
            {bobAnalytics.topProducts.map((product: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all duration-200"
              >
                {/* Rang */}
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                    'bg-gradient-to-r from-blue-400 to-indigo-500'
                  }`}>
                    {index + 1}
                  </div>
                </div>

                {/* Icône produit */}
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Infos produit */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-gray-900 dark:text-white truncate">{product.name}</h5>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      product.type === 'emprunt' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      product.type === 'pret' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                    }`}>
                      {product.type}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{product.requests}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">demandes</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">⏱️ {product.avgDuration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catalogue de produits */}
      {products.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📦 Catalogue Produits ({products.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {products.slice(0, 6).map((product: any, index: number) => (
              <div
                key={product.id || index}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg p-3 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all duration-200"
              >
                <h6 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                  {product.attributes?.name || product.name || `Produit #${product.id}`}
                </h6>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {product.attributes?.description || 'Pas de description'}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full">
                    {product.attributes?.category || 'Général'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(product.attributes?.createdAt || product.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}