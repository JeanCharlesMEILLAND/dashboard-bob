'use client'

import { useState, useEffect } from 'react'
import {
  Users, TrendingUp, DollarSign, Activity, Server, Cpu, HardDrive, Wifi,
  Shield, AlertTriangle, CheckCircle, Clock, Terminal, Database,
  Bell, Settings, Eye, Globe, Star, Zap, RefreshCw
} from 'lucide-react'

// Components
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import LoadingScreen from '@/components/ui/LoadingScreen'
import DataDashboard from '@/components/dashboard/DataDashboard'
import DevOpsDashboard from '@/components/dashboard/DevOpsDashboard'
import {
  useBusinessMetrics,
  useSystemMetrics,
  useLiveLogs,
  useSystemAlerts,
  usePerformanceMetrics,
  formatNumber,
  formatCurrency,
  formatBytes,
  formatUptime,
  type LogEntry,
  type AlertInfo,
  type ServiceInfo,
  type ProcessInfo
} from '@/hooks/useSystemData'
import {
  useNotifications,
  useAlertThresholds,
  usePushNotifications,
  type NotificationConfig,
  type AlertThreshold,
  type NotificationHistory
} from '@/hooks/useNotifications'
import {
  usePM2Control,
  useRedisControl,
  useBackupControl,
  type PM2Process,
  type RedisInfo,
  type BackupInfo,
  type InfrastructureCommand
} from '@/hooks/useInfrastructure'
import {
  useSecurityAlerts,
  useFirewall,
  useFail2Ban,
  useSystemUpdates,
  useSecurityScans,
  useSecurityMetrics,
  type SecurityAlert,
  type FirewallRule,
  type SystemUpdate,
  type SecurityScan
} from '@/hooks/useSecurity'
import {
  useReports,
  useKPIs,
  useCustomDashboards,
  useDataExports,
  useIntegrations,
  type AnalyticsReport,
  type KPIMetric,
  type DataExport
} from '@/hooks/useAnalytics'

export default function Dashboard() {
  const [mode, setMode] = useState<'data' | 'devops'>('data')
  const [notifications, setNotifications] = useState<number>(3)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(loadingTimer)
  }, [])

  const toggleMode = () => {
    setMode(prev => prev === 'data' ? 'devops' : 'data')
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        mode={mode}
        onModeToggle={toggleMode}
        notifications={notifications}
        onNotificationsClick={() => setShowNotificationPanel(true)}
      />

      {/* Sidebar */}
      <Sidebar
        mode={mode}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      } pt-16`}>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

              {/* Notifications */}
              <button className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Settings */}
              <button
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mode === 'data' ? <DataMode /> : <DevOpsMode />}
      </main>

      {/* Notification Settings Panel */}
      {showNotificationPanel && (
        <NotificationSettingsPanel onClose={() => setShowNotificationPanel(false)} />
      )}
    </div>
  )
}

// Loading Screen avec animations avancées
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-blue-500/30 rounded-full animate-spin border-t-blue-500"></div>
          <div className="absolute inset-0 w-32 h-32 border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-500 animation-delay-150"></div>
          <div className="absolute inset-2 w-28 h-28 border-4 border-pink-500/30 rounded-full animate-spin border-t-pink-500 animation-delay-300"></div>
          <Rocket className="absolute inset-0 m-auto h-12 w-12 text-white animate-pulse" />
        </div>
        <h2 className="mt-8 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Initialisation du Dashboard BOB
        </h2>
        <p className="mt-2 text-gray-300 animate-pulse">Chargement des modules avancés...</p>
      </div>
    </div>
  )
}

function DataMode() {
  const { data: businessData, loading, error } = useBusinessMetrics()
  const { kpis } = useKPIs()
  const { reports, generateReport, deleteReport } = useReports()
  const { exports, createExport, deleteExport } = useDataExports()
  const { integrations, toggleIntegration } = useIntegrations()
  const [showAnalytics, setShowAnalytics] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Chargement des données...</span>
      </div>
    )
  }

  if (error || !businessData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error || 'Erreur de chargement'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec contrôles analytics */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bob-secondary">
          Analytics & Business Intelligence
        </h2>
        <button
          onClick={() => setShowAnalytics(true)}
          className="flex items-center space-x-2 px-4 py-2 bob-gradient text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <BarChart3 className="h-5 w-5" />
          <span>Centre Analytics</span>
        </button>
      </div>

      {/* KPIs personnalisés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.slice(0, 4).map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Utilisateurs Actifs"
          value={formatNumber(businessData.users.active)}
          change={`+${businessData.users.growth}%`}
          icon={<Users className="h-6 w-6 bob-primary" />}
          trend="up"
        />
        <MetricCard
          title="Revenus Mensuels"
          value={formatCurrency(businessData.revenue.current)}
          change={`+${businessData.revenue.growth}%`}
          icon={<TrendingUp className="h-6 w-6 text-green-600" />}
          trend="up"
        />
        <MetricCard
          title="Taux d'Engagement"
          value={`${businessData.engagement.rate}%`}
          change={`${Math.floor(businessData.engagement.sessions / 1000)}K sessions`}
          icon={<Heart className="h-6 w-6 text-pink-600" />}
          trend="up"
        />
        <MetricCard
          title="Conversions"
          value={formatNumber(businessData.conversions.count)}
          change={`${businessData.conversions.rate}% taux`}
          icon={<Star className="h-6 w-6 text-purple-600" />}
          trend="up"
        />
      </div>

      {/* Graphiques et détails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={businessData} />
        </div>
        <div className="space-y-6">
          <UserGrowthCard data={businessData} />
          <QuickStats data={businessData} />
        </div>
      </div>

      {/* Rapports et exports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsPanel reports={reports} generateReport={generateReport} deleteReport={deleteReport} />
        <DataExportsPanel exports={exports} createExport={createExport} deleteExport={deleteExport} />
      </div>

      {/* Tableau de bord détaillé */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementDetails data={businessData} />
        <IntegrationsPanel integrations={integrations} toggleIntegration={toggleIntegration} />
      </div>

      {/* Centre Analytics */}
      {showAnalytics && (
        <AnalyticsCenterPanel onClose={() => setShowAnalytics(false)} />
      )}
    </div>
  )
}

function DevOpsMode() {
  const { data: systemData, loading, error } = useSystemMetrics()
  const logs = useLiveLogs()
  const alerts = useSystemAlerts()
  const performanceMetrics = usePerformanceMetrics()
  const [showInfraControls, setShowInfraControls] = useState(false)
  const [showSecurityCenter, setShowSecurityCenter] = useState(false)

  // Security hooks
  const { unresolvedAlerts } = useSecurityAlerts()
  const securityMetrics = useSecurityMetrics()
  const { pendingUpdates } = useSystemUpdates()
  const { runningScan } = useSecurityScans()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Chargement des métriques système...</span>
      </div>
    )
  }

  if (error || !systemData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error || 'Erreur de chargement'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bob-secondary">
          Infrastructure & DevOps
        </h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSecurityCenter(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Centre Sécurité</span>
          </button>
          <button
            onClick={() => setShowInfraControls(true)}
            className="flex items-center space-x-2 px-4 py-2 bob-gradient text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Terminal className="h-5 w-5" />
            <span>Contrôles Infrastructure</span>
          </button>
        </div>
      </div>

      {/* Métriques de sécurité */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Score de Sécurité</p>
              <p className="text-2xl font-semibold mt-2">{securityMetrics.securityScore}/100</p>
            </div>
            <ShieldCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Menaces Actives</p>
              <p className="text-2xl font-semibold mt-2">{securityMetrics.totalThreats}</p>
            </div>
            <AlertOctagon className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">IPs Bloquées</p>
              <p className="text-2xl font-semibold mt-2">{securityMetrics.blockedIps}</p>
            </div>
            <Ban className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mises à jour en attente</p>
              <p className="text-2xl font-semibold mt-2">{securityMetrics.pendingUpdates}</p>
            </div>
            <RefreshCw className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Métriques système principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="CPU Usage"
          value={`${systemData.cpu}%`}
          change="Normal"
          icon={<Cpu className="h-6 w-6 text-green-600" />}
          trend="stable"
        />
        <MetricCard
          title="Mémoire"
          value={formatBytes(systemData.memory.used * 1024 * 1024 * 1024)}
          change={`/${formatBytes(systemData.memory.total * 1024 * 1024 * 1024)}`}
          icon={<Monitor className="h-6 w-6 bob-primary" />}
          trend="stable"
        />
        <MetricCard
          title="Stockage"
          value={formatBytes(systemData.disk.used * 1024 * 1024 * 1024)}
          change={`/${formatBytes(systemData.disk.total * 1024 * 1024 * 1024)}`}
          icon={<Database className="h-6 w-6 text-purple-600" />}
          trend="stable"
        />
        <MetricCard
          title="Uptime"
          value={formatUptime(systemData.uptime)}
          change="En ligne"
          icon={<Server className="h-6 w-6 text-green-600" />}
          trend="up"
        />
      </div>

      {/* Métriques de performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Temps de Réponse"
          value={`${performanceMetrics.responseTime}ms`}
          change="Optimal"
          icon={<Zap className="h-6 w-6 text-yellow-600" />}
          trend="stable"
        />
        <MetricCard
          title="Requêtes/sec"
          value={`${performanceMetrics.requestsPerSecond}`}
          change="Stable"
          icon={<Activity className="h-6 w-6 bob-primary" />}
          trend="up"
        />
        <MetricCard
          title="Taux d'Erreur"
          value={`${performanceMetrics.errorRate.toFixed(2)}%`}
          change="Faible"
          icon={<Shield className="h-6 w-6 text-green-600" />}
          trend="down"
        />
        <MetricCard
          title="Throughput"
          value={`${performanceMetrics.throughput} MB/h`}
          change="Élevé"
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          trend="up"
        />
      </div>

      {/* Alertes et logs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <LiveLogsPanel logs={logs} />
        </div>
        <div className="space-y-6">
          <SystemAlertsCard alerts={alerts} />
        </div>
      </div>

      {/* Services et processus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <SystemServicesCard services={systemData.services} />
        </div>
        <div>
          <ProcessMonitorCard processes={systemData.processes} />
        </div>
        <div className="space-y-6">
          <NetworkStatsCard data={systemData} />
          <SystemResourcesChart data={systemData} />
        </div>
      </div>

      {/* Panneau de contrôles d'infrastructure */}
      {showInfraControls && (
        <InfrastructureControlPanel onClose={() => setShowInfraControls(false)} />
      )}

      {/* Centre de sécurité */}
      {showSecurityCenter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Centre de Sécurité</h3>
              <button onClick={() => setShowSecurityCenter(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Panel de sécurité en développement...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// COMPOSANTS PROFESSIONNELS

// Carte de métrique simple et épurée
function MetricCard({ title, value, change, icon, trend }: {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  trend: 'up' | 'down' | 'stable'
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon}
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold bob-secondary">{value}</p>
          </div>
        </div>
        <div className={`text-sm font-medium ${
          trend === 'up' ? 'text-green-600 dark:text-green-400' :
          trend === 'down' ? 'text-red-600 dark:text-red-400' :
          'text-gray-600 dark:text-gray-400'
        }`}>
          {change}
        </div>
      </div>
    </div>
  )
}

// Graphique de revenus
function RevenueChart({ data }: { data: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold bob-secondary">Évolution des Revenus</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Objectif: {formatCurrency(data.revenue.target)}
        </div>
      </div>

      {/* Graphique simple en barres */}
      <div className="h-64 flex items-end space-x-2">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-t">
            <div
              className="bg-blue-500 rounded-t transition-all duration-1000"
              style={{
                height: `${Math.random() * 80 + 20}%`,
                animationDelay: `${i * 100}ms`
              }}
            ></div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-semibold bob-secondary">
            {formatCurrency(data.revenue.current)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Ce mois</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-green-600">
            +{data.revenue.growth}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Croissance</div>
        </div>
        <div>
          <div className="text-lg font-semibold bob-secondary">
            {Math.round((data.revenue.current / data.revenue.target) * 100)}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">de l'objectif</div>
        </div>
      </div>
    </div>
  )
}

// Carte de croissance utilisateur
function UserGrowthCard({ data }: { data: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold bob-secondary mb-4">Utilisateurs</h4>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Actifs</span>
            <span className="font-medium bob-secondary">{formatNumber(data.users.active)}</span>
          </div>
          <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(data.users.active / data.users.total) * 100}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total</span>
            <span className="font-medium bob-secondary">{formatNumber(data.users.total)}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-green-600 font-medium">
            +{data.users.growth}% cette semaine
          </div>
        </div>
      </div>
    </div>
  )
}

// Statistiques rapides
function QuickStats({ data }: { data: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold bob-secondary mb-4">Statistiques</h4>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sessions</span>
          <span className="text-sm font-medium bob-secondary">
            {formatNumber(data.engagement.sessions)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Durée moyenne</span>
          <span className="text-sm font-medium bob-secondary">
            {Math.floor(data.engagement.duration / 60)}min {data.engagement.duration % 60}s
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Taux de conversion</span>
          <span className="text-sm font-medium bob-secondary">
            {data.conversions.rate}%
          </span>
        </div>
      </div>
    </div>
  )
}

// Détails engagement
function EngagementDetails({ data }: { data: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold bob-secondary mb-6">Engagement Détaillé</h4>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium bob-secondary">Taux d'engagement</span>
            <span className="text-lg font-bold bob-primary">{data.engagement.rate}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${data.engagement.rate}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold bob-secondary">
              {formatNumber(data.engagement.sessions)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Sessions actives</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold bob-secondary">
              {Math.floor(data.engagement.duration / 60)}m
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Durée moyenne</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Activité récente
function RecentActivity() {
  const activities = [
    { user: "Alice Martin", action: "a créé un nouveau projet", time: "Il y a 2 minutes" },
    { user: "Bob Dupont", action: "a publié un article", time: "Il y a 5 minutes" },
    { user: "Clara Durand", action: "a rejoint l'équipe", time: "Il y a 12 minutes" },
    { user: "David Laurent", action: "a complété une tâche", time: "Il y a 18 minutes" }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold bob-secondary mb-4">Activité Récente</h4>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium bob-primary dark:text-blue-400">
                {activity.user.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm bob-secondary">
                <span className="font-medium">{activity.user}</span> {activity.action}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// COMPOSANTS DEVOPS

// Panneau de logs en temps réel
function LiveLogsPanel({ logs }: { logs: any[] }) {
  const getLogColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-500'
      case 'WARN': return 'text-yellow-500'
      case 'INFO': return 'text-green-500'
      case 'DEBUG': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold bob-secondary">Logs Système</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Live</span>
        </div>
      </div>
      <div className="p-6 bg-gray-900 h-80 overflow-y-auto font-mono text-sm">
        {logs.slice(0, 20).map((log, index) => (
          <div key={index} className="mb-1">
            <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span className={`ml-2 ${getLogColor(log.level)}`}>[{log.level}]</span>
            <span className="ml-2 text-blue-300">{log.service}:</span>
            <span className="ml-2 text-gray-300">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Carte des services système
function SystemServicesCard({ services }: { services: ServiceInfo[] }) {

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold bob-secondary mb-4">Services</h4>

      <div className="space-y-3">
        {services.map((service, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                service.status === 'online' ? 'bg-green-500' :
                service.status === 'errored' ? 'bg-red-500' :
                service.status === 'stopped' ? 'bg-gray-500' : 'bg-yellow-500'
              }`}></div>
              <div>
                <p className="text-sm font-medium bob-secondary">{service.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {service.port ? `Port ${service.port}` : 'Service Manager'} | {service.restarts} restart(s)
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm bob-secondary">{formatUptime(service.uptime)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {service.memory ? `${service.memory}MB` : 'Uptime'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Statistiques réseau
function NetworkStatsCard({ data }: { data: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold bob-secondary mb-4">Réseau</h4>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Download</span>
            <span className="font-medium bob-secondary">{data.network.download} MB/s</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(data.network.download, 100)}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Upload</span>
            <span className="font-medium bob-secondary">{data.network.upload} MB/s</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(data.network.upload, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Graphique ressources système
function SystemResourcesChart({ data }: { data: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold bob-secondary mb-6">Ressources Système</h4>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium bob-secondary">CPU</span>
            <span className="text-lg font-bold bob-primary">{data.cpu}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${data.cpu}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium bob-secondary">Mémoire</span>
            <span className="text-lg font-bold text-green-600">
              {Math.round((data.memory.used / data.memory.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(data.memory.used / data.memory.total) * 100}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium bob-secondary">Stockage</span>
            <span className="text-lg font-bold text-purple-600">
              {Math.round((data.disk.used / data.disk.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-purple-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(data.disk.used / data.disk.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Carte de monitoring des processus
function ProcessMonitorCard({ processes }: { processes: ProcessInfo[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold bob-secondary mb-4">Processus</h4>

      <div className="space-y-3">
        {processes.map((process, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                process.status === 'running' ? 'bg-green-500' :
                process.status === 'sleeping' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <div>
                <p className="text-sm font-medium bob-secondary">{process.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PID: {process.pid}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm bob-secondary">{process.cpu.toFixed(1)}% CPU</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{process.memory.toFixed(0)}MB RAM</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Carte des alertes système
function SystemAlertsCard({ alerts }: { alerts: AlertInfo[] }) {
  const unresolvedAlerts = alerts.filter(alert => !alert.resolved).slice(0, 5)

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold bob-secondary">Alertes</h4>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{unresolvedAlerts.length}</span>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {unresolvedAlerts.map((alert) => (
          <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
            alert.type === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
            alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
            'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm bob-secondary font-medium">{alert.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {alert.service} • {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                alert.type === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {alert.type.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
        {unresolvedAlerts.length === 0 && (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Aucune alerte active</p>
          </div>
        )}
      </div>
    </div>
  )
}

// PANNEAU DE CONFIGURATION DES NOTIFICATIONS
function NotificationSettingsPanel({ onClose }: { onClose: () => void }) {
  const { configs, history, updateConfig, addConfig, removeConfig } = useNotifications()
  const { thresholds, updateThreshold, addThreshold, removeThreshold } = useAlertThresholds()
  const { permission, requestPermission, sendPushNotification } = usePushNotifications()
  const [activeTab, setActiveTab] = useState<'channels' | 'thresholds' | 'history'>('channels')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold bob-secondary">
            Configuration des Notifications
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'channels', name: 'Canaux', icon: <Bell className="h-5 w-5" /> },
            { id: 'thresholds', name: 'Seuils', icon: <AlertTriangle className="h-5 w-5" /> },
            { id: 'history', name: 'Historique', icon: <Clock className="h-5 w-5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bob-primary border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'channels' && <NotificationChannelsTab configs={configs} updateConfig={updateConfig} />}
          {activeTab === 'thresholds' && <AlertThresholdsTab thresholds={thresholds} updateThreshold={updateThreshold} />}
          {activeTab === 'history' && <NotificationHistoryTab history={history} />}
        </div>
      </div>
    </div>
  )
}

// Onglet des canaux de notification
function NotificationChannelsTab({
  configs,
  updateConfig
}: {
  configs: NotificationConfig[]
  updateConfig: (id: string, updates: Partial<NotificationConfig>) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold bob-secondary">
          Canaux de notification
        </h3>
        <button className="flex items-center space-x-2 px-4 py-2 bob-gradient text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Ajouter</span>
        </button>
      </div>

      <div className="grid gap-4">
        {configs.map((config) => (
          <div key={config.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {config.type === 'email' && <Mail className="h-5 w-5 bob-primary" />}
                {config.type === 'webhook' && <MessageSquare className="h-5 w-5 text-green-600" />}
                {config.type === 'sms' && <Phone className="h-5 w-5 text-purple-600" />}
                <h4 className="font-medium bob-secondary">{config.name}</h4>
              </div>
              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => updateConfig(config.id, { enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bob-gradient"></div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Destinataire
                </label>
                <input
                  type="text"
                  value={config.config.email || config.config.webhookUrl || config.config.phoneNumber || ''}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 bob-secondary"
                  placeholder={
                    config.type === 'email' ? 'email@example.com' :
                    config.type === 'webhook' ? 'https://hooks.slack.com/...' :
                    '+33123456789'
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Déclencher pour :</span>
              {['critical', 'warning', 'info'].map((level) => (
                <label key={level} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.triggers[level as keyof typeof config.triggers]}
                    onChange={(e) => updateConfig(config.id, {
                      triggers: { ...config.triggers, [level]: e.target.checked }
                    })}
                    className="rounded border-gray-300 bob-primary focus:ring-blue-500"
                  />
                  <span className={`text-sm capitalize ${
                    level === 'critical' ? 'text-red-600' :
                    level === 'warning' ? 'text-yellow-600' : 'bob-primary'
                  }`}>
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Onglet des seuils d'alerte
function AlertThresholdsTab({
  thresholds,
  updateThreshold
}: {
  thresholds: AlertThreshold[]
  updateThreshold: (index: number, updates: Partial<AlertThreshold>) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold bob-secondary">
          Seuils d'alerte
        </h3>
        <button className="flex items-center space-x-2 px-4 py-2 bob-gradient text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Ajouter</span>
        </button>
      </div>

      <div className="space-y-4">
        {thresholds.map((threshold, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Métrique
                </label>
                <select
                  value={threshold.metric}
                  onChange={(e) => updateThreshold(index, { metric: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 bob-secondary"
                >
                  <option value="cpu">CPU %</option>
                  <option value="memory_percent">Mémoire %</option>
                  <option value="disk_percent">Disque %</option>
                  <option value="response_time">Temps réponse (ms)</option>
                  <option value="error_rate">Taux erreur %</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Opérateur
                </label>
                <select
                  value={threshold.operator}
                  onChange={(e) => updateThreshold(index, { operator: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 bob-secondary"
                >
                  <option value=">">{'>'}</option>
                  <option value="<">{'<'}</option>
                  <option value=">=">{'>='}</option>
                  <option value="<=">{'<='}</option>
                  <option value="=">{'='}</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Valeur
                </label>
                <input
                  type="number"
                  value={threshold.value}
                  onChange={(e) => updateThreshold(index, { value: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 bob-secondary"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Sévérité
                </label>
                <select
                  value={threshold.severity}
                  onChange={(e) => updateThreshold(index, { severity: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 bob-secondary"
                >
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
              </div>

              <div className="flex items-center justify-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={threshold.enabled}
                    onChange={(e) => updateThreshold(index, { enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bob-gradient"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Onglet de l'historique des notifications
function NotificationHistoryTab({ history }: { history: NotificationHistory[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold bob-secondary">
        Historique des notifications
      </h3>

      <div className="space-y-3">
        {history.map((notif) => (
          <div key={notif.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {notif.type === 'email' && <Mail className="h-4 w-4 bob-primary" />}
                  {notif.type === 'webhook' && <MessageSquare className="h-4 w-4 text-green-600" />}
                  {notif.type === 'sms' && <Phone className="h-4 w-4 text-purple-600" />}
                  <span className="font-medium bob-secondary">{notif.subject}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{notif.message}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>À: {notif.recipient}</span>
                  <span>{new Date(notif.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                notif.status === 'sent' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                notif.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {notif.status === 'sent' && <CheckCircle className="inline h-3 w-3 mr-1" />}
                {notif.status === 'failed' && <XCircle className="inline h-3 w-3 mr-1" />}
                {notif.status === 'pending' && <Clock className="inline h-3 w-3 mr-1" />}
                {notif.status.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Aucune notification envoyée</p>
          </div>
        )}
      </div>
    </div>
  )
}

// PANNEAU DE CONTRÔLES D'INFRASTRUCTURE
function InfrastructureControlPanel({ onClose }: { onClose: () => void }) {
  const pm2Control = usePM2Control()
  const redisControl = useRedisControl()
  const backupControl = useBackupControl()
  const [activeTab, setActiveTab] = useState<'pm2' | 'redis' | 'backup'>('pm2')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold bob-secondary">
            Contrôles d'Infrastructure
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'pm2', name: 'PM2 Manager', icon: <Server className="h-5 w-5" /> },
            { id: 'redis', name: 'Redis Control', icon: <Database className="h-5 w-5" /> },
            { id: 'backup', name: 'Backups', icon: <Archive className="h-5 w-5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bob-primary border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {activeTab === 'pm2' && <PM2ControlTab {...pm2Control} />}
          {activeTab === 'redis' && <RedisControlTab {...redisControl} />}
          {activeTab === 'backup' && <BackupControlTab {...backupControl} />}
        </div>
      </div>
    </div>
  )
}

// Onglet de contrôle PM2
function PM2ControlTab({
  processes,
  commands,
  startProcess,
  stopProcess,
  restartProcess,
  reloadProcess,
  scaleProcess
}: ReturnType<typeof usePM2Control>) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold bob-secondary">
          Gestionnaire de processus PM2
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {processes.filter(p => p.status === 'online').length} / {processes.length} en ligne
          </span>
        </div>
      </div>

      {/* Liste des processus */}
      <div className="grid gap-4">
        {processes.map((process) => (
          <div key={process.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${
                  process.status === 'online' ? 'bg-green-500' :
                  process.status === 'stopped' ? 'bg-gray-500' :
                  process.status === 'errored' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <h4 className="font-medium bob-secondary">{process.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {process.mode} • {process.instances} instance(s) • {process.env}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium bob-secondary">
                  CPU: {process.cpu.toFixed(1)}% | RAM: {process.memory}MB
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {process.restarts} restart(s) • Uptime: {Math.floor(process.uptime / 3600000)}h
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => startProcess(process.name)}
                disabled={process.status === 'online'}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="h-3 w-3" />
                <span>Start</span>
              </button>
              <button
                onClick={() => stopProcess(process.name)}
                disabled={process.status === 'stopped'}
                className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Square className="h-3 w-3" />
                <span>Stop</span>
              </button>
              <button
                onClick={() => restartProcess(process.name)}
                className="flex items-center space-x-1 px-3 py-1 bob-gradient text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Restart</span>
              </button>
              <button
                onClick={() => reloadProcess(process.name)}
                className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reload</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Logs des commandes */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">Logs des commandes</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-sm">
          {commands.slice(0, 10).map((cmd) => (
            <div key={cmd.id} className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">[{new Date(cmd.startTime).toLocaleTimeString()}]</span>
                <span className="text-blue-300">$</span>
                <span className="text-white">{cmd.command}</span>
                <div className={`px-2 py-1 rounded text-xs ${
                  cmd.status === 'completed' ? 'bg-green-900 text-green-200' :
                  cmd.status === 'failed' ? 'bg-red-900 text-red-200' :
                  'bg-yellow-900 text-yellow-200'
                }`}>
                  {cmd.status.toUpperCase()}
                </div>
              </div>
              {cmd.output.slice(-2).map((line, i) => (
                <div key={i} className="text-gray-300 ml-4">{line}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Onglet de contrôle Redis
function RedisControlTab({
  redisInfo,
  commands,
  flushDB,
  flushAll,
  getInfo,
  getKeys,
  getMemoryUsage
}: ReturnType<typeof useRedisControl>) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold bob-secondary">
          Contrôle Redis
        </h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
          redisInfo.connected
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          <div className={`w-2 h-2 rounded-full ${redisInfo.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{redisInfo.connected ? 'Connecté' : 'Déconnecté'}</span>
        </div>
      </div>

      {/* Informations Redis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium bob-secondary mb-2">Informations</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Version</span>
              <span className="bob-secondary">{redisInfo.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Uptime</span>
              <span className="bob-secondary">{Math.floor(redisInfo.uptime / 3600000)}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Connexions</span>
              <span className="bob-secondary">{redisInfo.stats.totalConnections}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium bob-secondary mb-2">Mémoire</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Utilisée</span>
              <span className="bob-secondary">{redisInfo.memory.used}MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Peak</span>
              <span className="bob-secondary">{redisInfo.memory.peak}MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Fragmentation</span>
              <span className="bob-secondary">{redisInfo.memory.fragmentation}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium bob-secondary mb-2">Statistiques</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Commandes</span>
              <span className="bob-secondary">{redisInfo.stats.totalCommands.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Hit Rate</span>
              <span className="bob-secondary">{redisInfo.stats.hitRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Clés DB0</span>
              <span className="bob-secondary">{redisInfo.stats.keyspace.db0 || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Redis */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => getInfo()}
          className="flex items-center justify-center space-x-2 px-4 py-3 bob-gradient text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileText className="h-4 w-4" />
          <span>Info</span>
        </button>
        <button
          onClick={() => getKeys()}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Key className="h-4 w-4" />
          <span>Keys</span>
        </button>
        <button
          onClick={() => flushDB()}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Flush DB</span>
        </button>
        <button
          onClick={() => flushAll()}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <X className="h-4 w-4" />
          <span>Flush All</span>
        </button>
      </div>

      {/* Logs des commandes Redis */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">Logs Redis</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-sm">
          {commands.slice(0, 10).map((cmd) => (
            <div key={cmd.id} className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">[{new Date(cmd.startTime).toLocaleTimeString()}]</span>
                <span className="text-red-300">redis-cli</span>
                <span className="text-white">{cmd.command.replace('redis-cli ', '')}</span>
                <div className={`px-2 py-1 rounded text-xs ${
                  cmd.status === 'completed' ? 'bg-green-900 text-green-200' :
                  cmd.status === 'failed' ? 'bg-red-900 text-red-200' :
                  'bg-yellow-900 text-yellow-200'
                }`}>
                  {cmd.status.toUpperCase()}
                </div>
              </div>
              {cmd.output.slice(-2).map((line, i) => (
                <div key={i} className="text-gray-300 ml-4">{line}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Onglet de contrôle des sauvegardes
function BackupControlTab({
  backups,
  commands,
  createBackup,
  deleteBackup,
  restoreBackup
}: ReturnType<typeof useBackupControl>) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold bob-secondary">
          Gestion des sauvegardes
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => createBackup('database')}
            className="flex items-center space-x-2 px-4 py-2 bob-gradient text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Database className="h-4 w-4" />
            <span>DB Backup</span>
          </button>
          <button
            onClick={() => createBackup('files')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <HardDrive className="h-4 w-4" />
            <span>Files Backup</span>
          </button>
          <button
            onClick={() => createBackup('full')}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Archive className="h-4 w-4" />
            <span>Full Backup</span>
          </button>
        </div>
      </div>

      {/* Liste des sauvegardes */}
      <div className="grid gap-4">
        {backups.map((backup) => (
          <div key={backup.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                {backup.type === 'database' && <Database className="h-5 w-5 bob-primary" />}
                {backup.type === 'files' && <HardDrive className="h-5 w-5 text-green-600" />}
                {backup.type === 'full' && <Archive className="h-5 w-5 text-purple-600" />}
                <div>
                  <h4 className="font-medium bob-secondary">{backup.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{backup.description}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                backup.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                backup.status === 'running' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                backup.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {backup.status.toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Taille: </span>
                <span className="bob-secondary font-medium">{backup.size.toFixed(1)} GB</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Créé: </span>
                <span className="bob-secondary font-medium">
                  {new Date(backup.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Durée: </span>
                <span className="bob-secondary font-medium">
                  {backup.duration ? `${Math.floor(backup.duration / 1000)}s` : 'En cours...'}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Type: </span>
                <span className="bob-secondary font-medium capitalize">{backup.type}</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              📁 {backup.location}
            </div>

            {backup.status === 'completed' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => restoreBackup(backup.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  <Upload className="h-3 w-3" />
                  <span>Restore</span>
                </button>
                <button
                  onClick={() => deleteBackup(backup.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Logs des commandes de sauvegarde */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">Logs de sauvegarde</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-sm">
          {commands.slice(0, 10).map((cmd) => (
            <div key={cmd.id} className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">[{new Date(cmd.startTime).toLocaleTimeString()}]</span>
                <span className="text-purple-300">backup</span>
                <span className="text-white">{cmd.command.replace(/^backup-/, '').replace(/^restore backup /, 'restore ').replace(/^rm backup /, 'delete ')}</span>
                <div className={`px-2 py-1 rounded text-xs ${
                  cmd.status === 'completed' ? 'bg-green-900 text-green-200' :
                  cmd.status === 'failed' ? 'bg-red-900 text-red-200' :
                  'bg-yellow-900 text-yellow-200'
                }`}>
                  {cmd.status.toUpperCase()}
                </div>
              </div>
              {cmd.output.slice(-2).map((line, i) => (
                <div key={i} className="text-gray-300 ml-4">{line}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// COMPOSANTS ANALYTICS

// Carte KPI personnalisée
function KPICard({ kpi }: { kpi: KPIMetric }) {
  const getTrendIcon = () => {
    switch (kpi.trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Target className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = () => {
    switch (kpi.trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const progressPercentage = kpi.target ? (kpi.value / kpi.target) * 100 : 0

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${kpi.color}20` }}>
            <div className="h-5 w-5" style={{ color: kpi.color }}>
              {kpi.icon === 'users' && <Users className="h-5 w-5" />}
              {kpi.icon === 'trending-up' && <TrendingUp className="h-5 w-5" />}
              {kpi.icon === 'target' && <Target className="h-5 w-5" />}
              {kpi.icon === 'clock' && <Clock className="h-5 w-5" />}
              {kpi.icon === 'zap' && <Zap className="h-5 w-5" />}
              {kpi.icon === 'heart' && <Heart className="h-5 w-5" />}
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{kpi.name}</h3>
        </div>
        {getTrendIcon()}
      </div>

      <div className="mb-2">
        <span className="text-3xl font-bold bob-secondary">
          {kpi.value.toLocaleString()}{kpi.unit}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        <span className={`font-medium ${getTrendColor()}`}>
          vs précédent: {kpi.previousValue.toLocaleString()}{kpi.unit}
        </span>
      </div>

      {kpi.target && (
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Objectif</span>
            <span className="bob-secondary">{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(progressPercentage, 100)}%`,
                backgroundColor: kpi.color
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}

// Panneau des rapports
function ReportsPanel({
  reports,
  generateReport,
  deleteReport
}: {
  reports: AnalyticsReport[]
  generateReport: (type: 'daily' | 'weekly' | 'monthly', metrics: string[], format: 'pdf' | 'csv' | 'excel') => Promise<string>
  deleteReport: (reportId: string) => void
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold bob-secondary">Rapports Automatiques</h3>
        <button
          onClick={() => generateReport('daily', ['users', 'revenue'], 'pdf')}
          className="flex items-center space-x-2 px-3 py-1 bob-gradient text-white rounded text-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Générer</span>
        </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {reports.map((report) => (
          <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {report.format === 'pdf' && <FileText className="h-5 w-5 text-red-600" />}
                {report.format === 'excel' && <FileSpreadsheet className="h-5 w-5 text-green-600" />}
                {report.format === 'csv' && <BarChart className="h-5 w-5 bob-primary" />}
                <div>
                  <p className="text-sm font-medium bob-secondary">{report.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(report.createdAt).toLocaleDateString()} • {report.size.toFixed(1)} MB
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                report.status === 'generated' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                report.status === 'generating' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {report.status === 'generated' && <CheckCircle className="inline h-3 w-3 mr-1" />}
                {report.status === 'generating' && <Clock className="inline h-3 w-3 mr-1" />}
                {report.status.toUpperCase()}
              </div>
              {report.status === 'generated' && (
                <>
                  <button className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded">
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Panneau des exports de données
function DataExportsPanel({
  exports,
  createExport,
  deleteExport
}: {
  exports: DataExport[]
  createExport: (name: string, type: DataExport['type'], format: DataExport['format']) => Promise<string>
  deleteExport: (exportId: string) => void
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold bob-secondary">Exports de Données</h3>
        <button
          onClick={() => createExport('Export Users', 'users', 'csv')}
          className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Exporter</span>
        </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {exports.map((exportItem) => (
          <div key={exportItem.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {exportItem.type === 'users' && <Users className="h-5 w-5 bob-primary" />}
                {exportItem.type === 'revenue' && <TrendingUp className="h-5 w-5 text-green-600" />}
                {exportItem.type === 'logs' && <FileText className="h-5 w-5 text-gray-600" />}
                <div>
                  <p className="text-sm font-medium bob-secondary">{exportItem.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(exportItem.createdAt).toLocaleDateString()} •
                    {exportItem.status === 'completed' && ` ${exportItem.recordCount.toLocaleString()} lignes • ${exportItem.size.toFixed(1)} MB`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                exportItem.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                exportItem.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {exportItem.status === 'completed' && <CheckCircle className="inline h-3 w-3 mr-1" />}
                {exportItem.status === 'processing' && <Clock className="inline h-3 w-3 mr-1" />}
                {exportItem.status.toUpperCase()}
              </div>
              {exportItem.status === 'completed' && (
                <>
                  <button className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteExport(exportItem.id)}
                    className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Panneau des intégrations
function IntegrationsPanel({
  integrations,
  toggleIntegration
}: {
  integrations: any[]
  toggleIntegration: (id: string) => void
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold bob-secondary">Intégrations</h3>
        <button className="flex items-center space-x-2 px-3 py-1 bob-gradient text-white rounded text-sm hover:bg-blue-700 transition-colors">
          <Link className="h-4 w-4" />
          <span>Ajouter</span>
        </button>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              {integration.id === 'slack' && <MessageSquare className="h-5 w-5 text-purple-600" />}
              {integration.id === 'discord' && <MessageSquare className="h-5 w-5 text-indigo-600" />}
              {integration.id === 'google-analytics' && <BarChart className="h-5 w-5 text-orange-600" />}
              {integration.id === 'stripe' && <TrendingUp className="h-5 w-5 text-green-600" />}
              <div>
                <p className="text-sm font-medium bob-secondary">{integration.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{integration.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                integration.status === 'connected'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {integration.status === 'connected' ? 'Connecté' : 'Déconnecté'}
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={integration.status === 'connected'}
                  onChange={() => toggleIntegration(integration.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bob-gradient"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Centre Analytics principal
function AnalyticsCenterPanel({ onClose }: { onClose: () => void }) {
  const { dashboards, activeDashboard, setActiveDashboard, createDashboard } = useCustomDashboards()
  const { kpis, addKPI, removeKPI } = useKPIs()
  const [activeTab, setActiveTab] = useState<'dashboards' | 'kpis' | 'reports'>('dashboards')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold bob-secondary">
            Centre Analytics BOB
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'dashboards', name: 'Dashboards', icon: <Layers className="h-5 w-5" /> },
            { id: 'kpis', name: 'KPIs Personnalisés', icon: <Gauge className="h-5 w-5" /> },
            { id: 'reports', name: 'Rapports Avancés', icon: <FileText className="h-5 w-5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bob-primary border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {activeTab === 'dashboards' && (
            <DashboardsTab
              dashboards={dashboards}
              activeDashboard={activeDashboard}
              setActiveDashboard={setActiveDashboard}
              createDashboard={createDashboard}
            />
          )}
          {activeTab === 'kpis' && (
            <KPIsTab
              kpis={kpis}
              addKPI={addKPI}
              removeKPI={removeKPI}
            />
          )}
          {activeTab === 'reports' && <AdvancedReportsTab />}
        </div>
      </div>
    </div>
  )
}

// Onglet des dashboards personnalisés
function DashboardsTab({
  dashboards,
  activeDashboard,
  setActiveDashboard,
  createDashboard
}: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold bob-secondary">
          Dashboards Personnalisés
        </h3>
        <button
          onClick={() => createDashboard('Nouveau Dashboard', 'Dashboard personnalisé')}
          className="flex items-center space-x-2 px-4 py-2 bob-gradient text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Créer Dashboard</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboards.map((dashboard: any) => (
          <div key={dashboard.id} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            activeDashboard === dashboard.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
          onClick={() => setActiveDashboard(dashboard.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium bob-secondary">{dashboard.name}</h4>
              {dashboard.isDefault && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                  Défaut
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{dashboard.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{dashboard.widgets.length} widgets</span>
              <span>{new Date(dashboard.lastModified).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Onglet des KPIs personnalisés
function KPIsTab({ kpis, addKPI, removeKPI }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold bob-secondary">
          KPIs Personnalisés
        </h3>
        <button className="flex items-center space-x-2 px-4 py-2 bob-gradient text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Ajouter KPI</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kpis.map((kpi: KPIMetric) => (
          <div key={kpi.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${kpi.color}20` }}>
                  <div className="h-5 w-5" style={{ color: kpi.color }}>
                    {kpi.icon === 'users' && <Users className="h-5 w-5" />}
                    {kpi.icon === 'trending-up' && <TrendingUp className="h-5 w-5" />}
                    {kpi.icon === 'target' && <Target className="h-5 w-5" />}
                    {kpi.icon === 'clock' && <Clock className="h-5 w-5" />}
                    {kpi.icon === 'zap' && <Zap className="h-5 w-5" />}
                    {kpi.icon === 'heart' && <Heart className="h-5 w-5" />}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium bob-secondary">{kpi.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Catégorie: {kpi.category}</p>
                </div>
              </div>
              <button
                onClick={() => removeKPI(kpi.id)}
                className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Valeur actuelle:</span>
                <p className="font-semibold bob-secondary">{kpi.value.toLocaleString()}{kpi.unit}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Objectif:</span>
                <p className="font-semibold bob-secondary">
                  {kpi.target ? `${kpi.target.toLocaleString()}${kpi.unit}` : 'Non défini'}
                </p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Tendance:</span>
                <p className={`font-semibold ${
                  kpi.trend === 'up' ? 'text-green-600' :
                  kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {kpi.trend === 'up' ? '↗️ Hausse' : kpi.trend === 'down' ? '↘️ Baisse' : '→ Stable'}
                </p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Couleur:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: kpi.color }}></div>
                  <span className="text-xs font-mono">{kpi.color}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Onglet des rapports avancés
function AdvancedReportsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold bob-secondary">
          Rapports Avancés
        </h3>
        <button className="flex items-center space-x-2 px-4 py-2 bob-gradient text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FileText className="h-4 w-4" />
          <span>Nouveau Rapport</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Rapport Complet Mensuel', type: 'monthly', format: 'PDF', status: 'Programmé' },
          { name: 'Analytics Utilisateurs', type: 'weekly', format: 'Excel', status: 'Actif' },
          { name: 'Revenus et Performances', type: 'daily', format: 'CSV', status: 'Actif' },
          { name: 'Rapport d\'Engagement', type: 'weekly', format: 'PDF', status: 'Programmé' }
        ].map((report, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium bob-secondary">{report.name}</h4>
              <div className={`px-2 py-1 rounded text-xs ${
                report.status === 'Actif'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {report.status}
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Fréquence:</span>
                <span className="bob-secondary capitalize">{report.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="bob-secondary">{report.format}</span>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                Configurer
              </button>
              <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}





