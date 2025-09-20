'use client'

import { Server, Cpu, HardDrive, Wifi, Shield, AlertTriangle, CheckCircle, Terminal, Database, Activity, Zap, Clock, Users, Globe } from 'lucide-react'
import MetricCardPro from '@/components/ui/MetricCardPro'
import Card from '@/components/ui/Card'
import {
  useSystemMetrics,
  useSystemAlerts,
  useLiveLogs,
  usePerformanceMetrics,
  formatBytes,
  formatUptime
} from '@/hooks/useSystemData'

export default function DevOpsDashboardPro() {
  const { data: systemMetrics, loading: systemLoading } = useSystemMetrics()
  const alerts = useSystemAlerts()
  const logs = useLiveLogs()
  const performanceMetrics = usePerformanceMetrics()

  if (systemLoading || !systemMetrics) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const getVariantFromValue = (value: number, thresholds: { warning: number, danger: number }) => {
    if (value >= thresholds.danger) return 'danger'
    if (value >= thresholds.warning) return 'warning'
    return 'success'
  }

  // Données simulées pour les sparklines
  const cpuSparkline = [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40]
  const memorySparkline = [28, 48, 40, 19, 86, 27, 90, 28, 48, 40, 19, 86, 27, 90]
  const networkSparkline = [12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3, 12, 19]

  return (
    <div className="space-y-2">
      {/* Header avec gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-2 py-4 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold">
                DevOps Command Center
              </h2>
              <p className="text-blue-100 text-lg">
                Supervision système et infrastructure en temps réel
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-400 full animate-pulse"></div>
                  <span className="text-sm">Tous les systèmes opérationnels</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Dernière mise à jour: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white xl hover:bg-white/30 transition-all duration-200 font-medium">
                🚀 Actions Rapides
              </button>
              <button className="px-6 py-3 bg-red-500 text-white xl hover:bg-red-600 transition-all duration-200 font-medium shadow-lg">
                🚨 Alertes ({alerts.filter(a => !a.resolved).length})
              </button>
            </div>
          </div>
        </div>
        {/* Decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400/20 full blur-2xl"></div>
      </div>

      {/* Métriques système principales avec MetricCardPro */}
      <div className="grid grid-cols-4 gap-2">
        <MetricCardPro
          title="CPU Usage"
          value={`${systemMetrics.cpu}%`}
          subtitle={`Processeur Intel Xeon • ${systemMetrics.cpu < 70 ? 'Performance optimale' : 'Charge élevée'}`}
          icon={<Cpu />}
          variant={getVariantFromValue(systemMetrics.cpu, { warning: 70, danger: 85 })}
          trend={{ value: -2.1, isPositive: false, timeframe: '24h' }}
          animated={true}
          gradient={true}
          sparkline={cpuSparkline}
          showMenu={true}
        />

        <MetricCardPro
          title="Memory"
          value={`${Math.round((systemMetrics.memory.used / systemMetrics.memory.total) * 100)}%`}
          subtitle={`${formatBytes(systemMetrics.memory.used * 1024 * 1024 * 1024)} / ${formatBytes(systemMetrics.memory.total * 1024 * 1024 * 1024)}`}
          icon={<Server />}
          variant={getVariantFromValue((systemMetrics.memory.used / systemMetrics.memory.total) * 100, { warning: 75, danger: 90 })}
          trend={{ value: 1.8, isPositive: true, timeframe: '1h' }}
          animated={true}
          gradient={true}
          sparkline={memorySparkline}
          showMenu={true}
        />

        <MetricCardPro
          title="Storage"
          value={`${Math.round((systemMetrics.disk.used / systemMetrics.disk.total) * 100)}%`}
          subtitle={`${formatBytes(systemMetrics.disk.used * 1024 * 1024 * 1024)} utilisés • SSD NVMe`}
          icon={<HardDrive />}
          variant={getVariantFromValue((systemMetrics.disk.used / systemMetrics.disk.total) * 100, { warning: 80, danger: 95 })}
          trend={{ value: 0.5, isPositive: true, timeframe: '7d' }}
          animated={true}
          gradient={true}
          showMenu={true}
        />

        <MetricCardPro
          title="Network"
          value={`${systemMetrics.network.download.toFixed(1)} MB/s`}
          subtitle={`↑ ${systemMetrics.network.upload.toFixed(1)} MB/s • Fibre optique`}
          icon={<Wifi />}
          variant="indigo"
          trend={{ value: 12.3, isPositive: true, timeframe: '30m' }}
          animated={true}
          gradient={true}
          sparkline={networkSparkline}
          showMenu={true}
        />
      </div>

      {/* Performance metrics avancées */}
      <div className="grid grid-cols-5 gap-2">
        <MetricCardPro
          title="Response Time"
          value={`${performanceMetrics.responseTime}ms`}
          icon={<Zap />}
          variant={performanceMetrics.responseTime < 100 ? 'success' : performanceMetrics.responseTime < 200 ? 'warning' : 'danger'}
          size="sm"
          animated={true}
        />

        <MetricCardPro
          title="Requests/sec"
          value={performanceMetrics.requestsPerSecond}
          icon={<Activity />}
          variant="info"
          size="sm"
          animated={true}
        />

        <MetricCardPro
          title="Error Rate"
          value={`${performanceMetrics.errorRate.toFixed(2)}%`}
          icon={<AlertTriangle />}
          variant={performanceMetrics.errorRate < 1 ? 'success' : performanceMetrics.errorRate < 5 ? 'warning' : 'danger'}
          size="sm"
          animated={true}
        />

        <MetricCardPro
          title="Throughput"
          value={`${performanceMetrics.throughput} MB/h`}
          icon={<Database />}
          variant="purple"
          size="sm"
          animated={true}
        />

        <MetricCardPro
          title="Active Users"
          value="1,247"
          icon={<Users />}
          variant="indigo"
          trend={{ value: 8.5, isPositive: true }}
          size="sm"
          animated={true}
        />
      </div>

      {/* Services et infrastructure */}
      <div className="grid grid-cols-3 gap-2">
        {/* Services Status - Version améliorée */}
        <Card padding="lg" className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800  shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Services Infrastructure
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Monitoring en temps réel
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {systemMetrics.services.filter(s => s.status === 'online').length}/{systemMetrics.services.length}
              </span>
              <div className="h-2 w-2 bg-green-400 full animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-3">
            {systemMetrics.services.map((service, index) => (
              <div key={index} className="group p-4 bg-white/50 dark:bg-gray-800/50 xl  hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`relative h-3 w-3 full ${
                      service.status === 'online' ? 'bg-green-400' : 'bg-red-400'
                    }`}>
                      {service.status === 'online' && (
                        <div className="absolute inset-0 h-3 w-3 bg-green-400 full animate-ping opacity-50"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{service.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Uptime: {formatUptime(service.uptime)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {service.memory} MB
                    </p>
                    {service.port && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Port :{service.port}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alertes système - Version moderne */}
        <Card padding="lg" className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800  shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Alertes Système
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Surveillance active
              </p>
            </div>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-2 full text-sm font-semibold">
              {alerts.filter(a => !a.resolved).length} Actives
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {alerts.slice(0, 6).map((alert) => (
              <div key={alert.id} className={`p-4 xl  transition-all duration-200 hover:shadow-sm ${
                alert.type === 'critical' ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 ' :
                alert.type === 'warning' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 ' :
                'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 '
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {alert.type === 'critical' ? (
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : alert.type === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {alert.service}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-4 whitespace-nowrap">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Live System Logs - Section complète en pleine largeur */}
      <div className="px-2">
        <Card padding="lg" className="bg-gradient-to-br from-gray-900 to-black shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">
                Live System Logs - Console Temps Réel
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Surveillance complète du système et des services en temps réel
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-400 full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Live Stream</span>
                <Terminal className="h-5 w-5 text-green-400" />
              </div>
              <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-all duration-200 font-medium">
                Pause
              </button>
            </div>
          </div>

          <div className="bg-black p-8 font-mono text-sm max-h-96 overflow-y-auto">
            {logs.slice(0, 20).map((log, index) => (
              <div key={index} className="flex items-center gap-4 py-3 hover:bg-gray-800/50 px-3 transition-colors border-l-2 border-transparent hover:border-green-400">
                <span className="text-gray-500 text-sm whitespace-nowrap min-w-20">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`text-sm px-3 py-1 font-semibold min-w-16 text-center ${
                  log.level === 'ERROR' ? 'bg-red-900 text-red-200' :
                  log.level === 'WARN' ? 'bg-yellow-900 text-yellow-200' :
                  log.level === 'INFO' ? 'bg-blue-900 text-blue-200' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {log.level}
                </span>
                <span className="text-purple-400 text-sm font-medium min-w-24">
                  [{log.service}]
                </span>
                <span className="text-gray-300 text-sm flex-1">
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}