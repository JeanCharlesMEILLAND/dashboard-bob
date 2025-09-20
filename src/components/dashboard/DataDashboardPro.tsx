'use client'

import { useState } from 'react'
import { Users, TrendingUp, Eye, Globe, Star, Target, Clock, ArrowUpRight, CreditCard, Banknote, Calendar, Briefcase, PieChart, Search } from 'lucide-react'
import MetricCardPro from '@/components/ui/MetricCardPro'
import Card from '@/components/ui/Card'
import UserSearchModal from '@/components/ui/UserSearchModal'
import PopularProductsWidget from '@/components/ui/PopularProductsWidget'
import {
  useBusinessMetrics,
  useUsers,
  formatNumber
} from '@/hooks/useSystemData'

export default function DataDashboardPro() {
  const { data: businessMetrics, loading } = useBusinessMetrics()
  const { users, pagination, loading: usersLoading } = useUsers(1, 10)
  const [showUserSearch, setShowUserSearch] = useState(false)

  if (loading || !businessMetrics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  // Données simulées pour les sparklines
  const userSparkline = [120, 132, 151, 134, 190, 230, 210, 273, 280, 290, 273, 285, 273, 290]
  const revenueSparkline = [65, 78, 66, 44, 56, 67, 75, 65, 78, 66, 44, 56, 67, 75]
  const engagementSparkline = [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 45, 52, 38]

  return (
    <div className="space-y-8">
      {/* Hero Section - Performance Globale */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Background Graphics */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-cyan-400/20 to-transparent full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              BOB Financial Hub
            </h2>
            <p className="text-xl text-blue-100 font-medium">
              Tableau de bord exécutif • Performance en temps réel
            </p>
          </div>

          {/* Hero KPIs - Les 3 métriques les plus importantes */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm">
              <div className="text-6xl font-black text-green-300 mb-2">
                {formatNumber(businessMetrics.bobiesGeneres || 17350)}
              </div>
              <div className="text-lg font-semibold text-green-200 mb-1">Bobies Générés ! 💎</div>
              <div className="text-sm text-green-100">+{businessMetrics.requests?.recentGrowth || 18}% ce mois</div>
              <div className="mt-3 h-2 bg-white/20 overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-green-400 to-emerald-300 animate-pulse"></div>
              </div>
            </div>

            <div className="text-center p-6 bg-white/10 backdrop-blur-sm">
              <div className="text-6xl font-black text-blue-300 mb-2">
                {formatNumber(businessMetrics.clientsActifs)}
              </div>
              <div className="text-lg font-semibold text-blue-200 mb-1">Clients Actifs</div>
              <div className="text-sm text-blue-100">+{businessMetrics.users.growth}% ce mois</div>
              <div className="mt-3 h-2 bg-white/20 overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-blue-400 to-cyan-300"></div>
              </div>
            </div>

            <div className="text-center p-6 bg-white/10 backdrop-blur-sm">
              <div className="text-6xl font-black text-purple-300 mb-2">
                {formatNumber(businessMetrics.invitationsEnCours)}
              </div>
              <div className="text-lg font-semibold text-purple-200 mb-1">Invitations en Cours 📨</div>
              <div className="text-sm text-purple-100">Utilisateurs non confirmés</div>
              <div className="mt-3 h-2 bg-white/20 overflow-hidden">
                <div className="h-full w-3/5 bg-gradient-to-r from-purple-400 to-pink-300 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex justify-center items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-400 full animate-pulse"></div>
              <span className="text-green-200 font-medium">Tous les systèmes opérationnels</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-200" />
              <span className="text-blue-200">Dernière sync: {new Date().toLocaleTimeString()}</span>
            </div>
            <button
              onClick={() => setShowUserSearch(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-medium shadow-lg"
            >
              <Search className="h-4 w-4" />
              Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* Section Activité Opérationnelle */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Activité Opérationnelle
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Suivi des prêts, emprunts, services et événements
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 opacity-50 blur-lg group-hover:opacity-100 transition duration-500"></div>
            <MetricCardPro
              title="Prêts Actifs"
              value={formatNumber(businessMetrics.requests?.prets || 3)}
              subtitle={`${businessMetrics.requests?.prets || 3} demandes • Taux moy. 4.2%`}
              icon={<CreditCard />}
              variant="success"
              trend={{ value: businessMetrics.requests?.recentGrowth || 15, isPositive: true, timeframe: '30d' }}
              animated={true}
              gradient={true}
              sparkline={userSparkline}
              showMenu={true}
            />
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-50 blur-lg group-hover:opacity-100 transition duration-500"></div>
            <MetricCardPro
              title="Emprunts Traités"
              value={formatNumber(businessMetrics.requests?.emprunts || 25)}
              subtitle={`${businessMetrics.requests?.emprunts || 25} demandes • Délai moy. 3.2j`}
              icon={<Banknote />}
              variant="info"
              trend={{ value: businessMetrics.requests?.recentGrowth || 12, isPositive: true, timeframe: '7d' }}
              animated={true}
              gradient={true}
              sparkline={revenueSparkline}
              showMenu={true}
            />
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-violet-600 opacity-50 blur-lg group-hover:opacity-100 transition duration-500"></div>
            <MetricCardPro
              title="Services Actifs"
              value={formatNumber(businessMetrics.requests?.services || 2)}
              subtitle={`${businessMetrics.requests?.services || 2} demandes • Assurances, placements, conseils`}
              icon={<Briefcase />}
              variant="purple"
              trend={{ value: businessMetrics.requests?.recentGrowth || 8, isPositive: true, timeframe: '30d' }}
              animated={true}
              gradient={true}
              showMenu={true}
            />
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 opacity-50 blur-lg group-hover:opacity-100 transition duration-500"></div>
            <MetricCardPro
              title="Événements"
              value={formatNumber(businessMetrics.requests?.evenements || 3)}
              subtitle={`${businessMetrics.requests?.evenements || 3} événements collectifs • Webinaires, formations`}
              icon={<Calendar />}
              variant="warning"
              trend={{ value: businessMetrics.requests?.recentGrowth || 25, isPositive: true, timeframe: '24h' }}
              animated={true}
              gradient={true}
          sparkline={engagementSparkline}
          showMenu={true}
        />
          </div>
        </div>
      </div>

      {/* KPIs détaillés par service */}
      <div className="grid grid-cols-6 gap-2">
        <MetricCardPro
          title="Taux Approbation"
          value="94.2%"
          icon={<Target />}
          variant="success"
          size="sm"
          animated={true}
        />

        <MetricCardPro
          title="Délai Moyen"
          value="3.2 jours"
          icon={<Clock />}
          variant="info"
          size="sm"
          animated={true}
        />

        <MetricCardPro
          title="Satisfaction"
          value="4.8/5"
          icon={<Star />}
          variant="warning"
          size="sm"
          animated={true}
        />

        <MetricCardPro
          title="Renouvellements"
          value="78%"
          icon={<ArrowUpRight />}
          variant="success"
          size="sm"
          animated={true}
        />

        <MetricCardPro
          title="Nouveaux Clients"
          value="+45"
          icon={<Users />}
          variant="indigo"
          size="sm"
          animated={true}
        />

        <MetricCardPro
          title="Couverture Geo"
          value="12 régions"
          icon={<Globe />}
          variant="purple"
          size="sm"
          animated={true}
        />
      </div>

      {/* Analytics avancées - Colonne simple */}
      <div className="grid grid-cols-1 gap-6">
        {/* Chart principal */}
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-xl" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Répartition des Services
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Performance des prêts, emprunts et services sur 30 jours
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 lg font-medium">
                7j
              </button>
              <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">
                30j
              </button>
              <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">
                90j
              </button>
            </div>
          </div>

          <div className="h-80 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 2xl flex items-center justify-center relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-16 h-16 bg-indigo-500 full blur-xl"></div>
              <div className="absolute bottom-4 right-4 w-20 h-20 bg-blue-500 full blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-cyan-500 full blur-lg"></div>
            </div>

            <div className="text-center z-10 w-full flex flex-col items-center">
              <PieChart className="h-16 w-16 text-indigo-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                Répartition Services
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Graphique circulaire des prêts/emprunts/services/événements
              </p>
              <div className="mt-4 flex items-center justify-center gap-4 text-xs flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-500 full"></div>
                  <span>Prêts (35%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-blue-500 full"></div>
                  <span>Emprunts (25%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-purple-500 full"></div>
                  <span>Services (25%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-orange-500 full"></div>
                  <span>Événements (15%)</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Métriques détaillées */}
        <Card padding="lg" className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-xl">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Insights Avancés
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 xl border border-indigo-200/50 dark:border-indigo-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 lg flex items-center justify-center">
                      <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Pages vues</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Aujourd&apos;hui</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(businessMetrics.engagement.sessions * 3.2)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">+12.5%</span>
                  <span className="text-gray-500">vs hier</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 xl border border-green-200/50 dark:border-green-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 lg flex items-center justify-center">
                      <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Sessions</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Durée moyenne</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(businessMetrics.engagement.sessions)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.floor(businessMetrics.engagement.duration / 60)}m {businessMetrics.engagement.duration % 60}s
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 xl border border-yellow-200/50 dark:border-yellow-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900/30 lg flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Conversions</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Taux: {businessMetrics.conversions.rate}%</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(businessMetrics.conversions.count)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Activité récente - Version moderne */}
      <Card padding="lg" className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Activité Utilisateurs en Temps Réel
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Dernières actions sur la plateforme
            </p>
          </div>
          <button className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
            Voir tout →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Utilisateur</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Inscription</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Rôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {usersLoading ? (
                // Skeleton loading
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                    </td>
                    <td className="py-4 px-4"><div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div></td>
                    <td className="py-4 px-4"><div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div></td>
                    <td className="py-4 px-4"><div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div></td>
                    <td className="py-4 px-4"><div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div></td>
                  </tr>
                ))
              ) : (
                users.map((user, index) => (
                  <tr key={user.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {user.username || user.firstname || user.email?.split('@')[0] || 'Utilisateur'}
                          </div>
                          {user.firstname && user.lastname && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.firstname} {user.lastname}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-900 dark:text-white">{user.email}</div>
                      {user.phone && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        user.confirmed ?
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {user.confirmed ? 'Confirmé' : 'En attente'}
                      </span>
                      {user.blocked && (
                        <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          Bloqué
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {user.role?.name || user.role?.type || 'Utilisateur'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination si disponible */}
        {pagination && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Affichage de {pagination.start + 1} à {Math.min(pagination.start + pagination.limit, pagination.total)} sur {pagination.total} utilisateurs
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {pagination.page} sur {pagination.pageCount}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Widget Produits Populaires */}
      <PopularProductsWidget />

      {/* Modal de recherche utilisateur */}
      <UserSearchModal
        isOpen={showUserSearch}
        onClose={() => setShowUserSearch(false)}
      />
    </div>
  )
}