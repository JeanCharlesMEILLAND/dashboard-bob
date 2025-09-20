'use client'

import { Users, TrendingUp, DollarSign, Activity, Eye, Globe, Star } from 'lucide-react'
import MetricCard from '@/components/ui/MetricCard'
import Card from '@/components/ui/Card'
import {
  useBusinessMetrics,
  formatCurrency,
  formatNumber
} from '@/hooks/useSystemData'

export default function DataDashboard() {
  const { data: businessMetrics, loading } = useBusinessMetrics()

  if (loading || !businessMetrics) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Vue d'ensemble Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Métriques business et analytics en temps réel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Exporter
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Configurer
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Utilisateurs Total"
          value={formatNumber(businessMetrics.users.total)}
          subtitle="Utilisateurs inscrits"
          icon={<Users className="h-8 w-8" />}
          trend={{ value: businessMetrics.users.growth, isPositive: true }}
          variant="info"
        />

        <MetricCard
          title="Utilisateurs Actifs"
          value={formatNumber(businessMetrics.users.active)}
          subtitle="Utilisateurs confirmés"
          icon={<Activity className="h-8 w-8" />}
          trend={{ value: 8.2, isPositive: true }}
          variant="success"
        />

        <MetricCard
          title="Revenus"
          value={formatCurrency(businessMetrics.revenue.current)}
          subtitle={`Objectif: ${formatCurrency(businessMetrics.revenue.target)}`}
          icon={<DollarSign className="h-8 w-8" />}
          trend={{ value: businessMetrics.revenue.growth, isPositive: true }}
          variant="warning"
        />

        <MetricCard
          title="Taux Engagement"
          value={`${businessMetrics.engagement.rate}%`}
          subtitle={`${formatNumber(businessMetrics.engagement.sessions)} sessions`}
          icon={<TrendingUp className="h-8 w-8" />}
          trend={{ value: 5.4, isPositive: true }}
          variant="success"
        />
      </div>

      {/* Graphiques et détails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Graphique principal */}
        <Card className="lg:col-span-2" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Évolution des Utilisateurs
            </h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                7j
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                30j
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                90j
              </button>
            </div>
          </div>

          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Graphique des tendances
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Integration Chart.js en cours...
              </p>
            </div>
          </div>
        </Card>

        {/* Statistiques détaillées */}
        <Card padding="lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Métriques Détaillées
          </h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Pages vues</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aujourd'hui</p>
                </div>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatNumber(businessMetrics.engagement.sessions * 3)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Sessions</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Durée moy.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white">
                  {formatNumber(businessMetrics.engagement.sessions)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.floor(businessMetrics.engagement.duration / 60)}m {businessMetrics.engagement.duration % 60}s
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Conversions</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Taux: {businessMetrics.conversions.rate}%</p>
                </div>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatNumber(businessMetrics.conversions.count)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Tableau des utilisateurs récents */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Activité Récente
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Voir tout →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Utilisateur</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Action</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { name: 'Jean-Charles M.', action: 'Connexion', date: 'Il y a 2 min', status: 'success' },
                { name: 'Samy K.', action: 'Inscription', date: 'Il y a 5 min', status: 'info' },
                { name: 'Elie M.', action: 'Achat Bobies', date: 'Il y a 8 min', status: 'warning' },
                { name: 'Margot T.', action: 'Mise à jour profil', date: 'Il y a 12 min', status: 'success' }
              ].map((user, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.action}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.date}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      user.status === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {user.status === 'success' ? 'Actif' : user.status === 'warning' ? 'Attente' : 'Nouveau'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}