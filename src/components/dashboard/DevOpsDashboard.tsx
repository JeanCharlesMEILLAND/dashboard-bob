'use client'

import { Server, Cpu, HardDrive, Wifi, Shield, AlertTriangle, CheckCircle, Terminal } from 'lucide-react'
import MetricCard from '@/components/ui/MetricCard'
import Card from '@/components/ui/Card'
import {
  useSystemMetrics,
  useSystemAlerts,
  useLiveLogs,
  usePerformanceMetrics,
  formatBytes,
  formatUptime
} from '@/hooks/useSystemData'

export default function DevOpsDashboard() {
  const { data: systemMetrics, loading: systemLoading } = useSystemMetrics()
  const alerts = useSystemAlerts()
  const logs = useLiveLogs()
  const performanceMetrics = usePerformanceMetrics()

  if (systemLoading || !systemMetrics) {
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

  const getVariantFromValue = (value: number, thresholds: { warning: number, danger: number }) => {
    if (value >= thresholds.danger) return 'danger'
    if (value >= thresholds.warning) return 'warning'
    return 'success'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Vue d'ensemble DevOps
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitoring système et infrastructure en temps réel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Actions
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Alertes
          </button>
        </div>
      </div>

      {/* Métriques système principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="CPU"
          value={`${systemMetrics.cpu}%`}
          subtitle="Utilisation processeur"
          icon={<Cpu className="h-8 w-8" />}
          variant={getVariantFromValue(systemMetrics.cpu, { warning: 70, danger: 85 })}
          trend={{ value: 2.1, isPositive: false }}
        />

        <MetricCard
          title="Mémoire"
          value={`${Math.round((systemMetrics.memory.used / systemMetrics.memory.total) * 100)}%`}
          subtitle={`${formatBytes(systemMetrics.memory.used * 1024 * 1024 * 1024)} / ${formatBytes(systemMetrics.memory.total * 1024 * 1024 * 1024)}`}
          icon={<Server className="h-8 w-8" />}
          variant={getVariantFromValue((systemMetrics.memory.used / systemMetrics.memory.total) * 100, { warning: 75, danger: 90 })}
          trend={{ value: -1.8, isPositive: false }}
        />

        <MetricCard
          title="Disque"
          value={`${Math.round((systemMetrics.disk.used / systemMetrics.disk.total) * 100)}%`}
          subtitle={`${formatBytes(systemMetrics.disk.used * 1024 * 1024 * 1024)} / ${formatBytes(systemMetrics.disk.total * 1024 * 1024 * 1024)}`}
          icon={<HardDrive className="h-8 w-8" />}
          variant={getVariantFromValue((systemMetrics.disk.used / systemMetrics.disk.total) * 100, { warning: 80, danger: 95 })}
          trend={{ value: 0.5, isPositive: true }}
        />

        <MetricCard
          title="Réseau"
          value={`${systemMetrics.network.download.toFixed(1)} MB/s`}
          subtitle={`↑ ${systemMetrics.network.upload.toFixed(1)} MB/s`}
          icon={<Wifi className="h-8 w-8" />}
          variant="info"
          trend={{ value: 12.3, isPositive: true }}
        />
      </div>

      {/* Services et performances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Services Status */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Services
            </h3>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              {systemMetrics.services.filter(s => s.status === 'online').length}/{systemMetrics.services.length} En ligne
            </span>
          </div>

          <div className="space-y-4">
            {systemMetrics.services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${
                    service.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Uptime: {formatUptime(service.uptime)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {service.memory}MB
                  </p>
                  {service.port && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      :{service.port}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card padding="lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Performance
          </h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Temps de réponse</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Moyenne</p>
              </div>
              <span className={`font-bold ${
                performanceMetrics.responseTime < 100 ? 'text-green-600' :
                performanceMetrics.responseTime < 200 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {performanceMetrics.responseTime}ms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Requêtes/sec</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Débit actuel</p>
              </div>
              <span className="font-bold text-blue-600">
                {performanceMetrics.requestsPerSecond}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Taux d'erreur</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dernière heure</p>
              </div>
              <span className={`font-bold ${
                performanceMetrics.errorRate < 1 ? 'text-green-600' :
                performanceMetrics.errorRate < 5 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {performanceMetrics.errorRate.toFixed(2)}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Throughput</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">MB/heure</p>
              </div>
              <span className="font-bold text-purple-600">
                {performanceMetrics.throughput}
              </span>
            </div>
          </div>
        </Card>

        {/* Alertes récentes */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Alertes Récentes
            </h3>
            <span className="text-sm text-red-600 dark:text-red-400 font-medium">
              {alerts.filter(a => !a.resolved).length} Actives
            </span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {alerts.slice(0, 5).map((alert, index) => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-400' :
                alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400' :
                'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {alert.type === 'critical' ? (
                      <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    ) : alert.type === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {alert.service}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Logs en temps réel */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Logs Système
          </h3>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 dark:text-green-400">En direct</span>
          </div>
        </div>

        <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
          {logs.slice(0, 10).map((log, index) => (
            <div key={index} className="flex items-center gap-3 py-1">
              <span className="text-gray-500 text-xs whitespace-nowrap">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                log.level === 'ERROR' ? 'bg-red-900 text-red-200' :
                log.level === 'WARN' ? 'bg-yellow-900 text-yellow-200' :
                log.level === 'INFO' ? 'bg-blue-900 text-blue-200' :
                'bg-gray-700 text-gray-300'
              }`}>
                {log.level}
              </span>
              <span className="text-purple-400 text-xs">
                [{log.service}]
              </span>
              <span className="text-gray-300 text-xs truncate">
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}