require('dotenv').config()
const express = require('express')
const cors = require('cors')
const si = require('systeminformation')
const pm2 = require('pm2')

const app = express()
const PORT = process.env.PORT || 3001
const API_SECRET_KEY = process.env.API_SECRET_KEY
const HOSTINGER_API_TOKEN = process.env.HOSTINGER_API_TOKEN

// Middleware de sécurité basique
const authenticateRequest = (req, res, next) => {
  if (API_SECRET_KEY) {
    const authHeader = req.headers.authorization
    if (!authHeader || authHeader !== `Bearer ${API_SECRET_KEY}`) {
      return res.status(401).json({ error: 'Token d\'authentification requis' })
    }
  }
  next()
}

app.use(cors())
app.use(express.json())

// Logs système en mémoire (simulation)
let systemLogs = []
let systemAlerts = []

// Ajouter des logs de test
const addTestLog = (level, service, message) => {
  const log = {
    timestamp: new Date().toISOString(),
    level,
    service,
    message,
    source: 'system'
  }
  systemLogs.unshift(log)
  if (systemLogs.length > 100) systemLogs = systemLogs.slice(0, 100)
}

// Ajouter des alertes de test
const addTestAlert = (type, service, message) => {
  const alert = {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    service,
    message,
    timestamp: new Date().toISOString(),
    resolved: Math.random() > 0.7
  }
  systemAlerts.unshift(alert)
  if (systemAlerts.length > 20) systemAlerts = systemAlerts.slice(0, 20)
}

// Initialiser avec quelques logs et alertes
addTestLog('INFO', 'System', 'API système démarrée')
addTestLog('INFO', 'Express', 'Serveur en écoute sur le port 3001')
addTestAlert('info', 'System', 'API système initialisée avec succès')

// Endpoint pour les métriques système (avec authentification optionnelle)
app.get('/metrics', authenticateRequest, async (req, res) => {
  try {
    // Récupérer les vraies métriques système
    const [cpu, mem, disk, networkStats, uptime, processes] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.time(),
      si.processes()
    ])

    // Récupérer les informations PM2
    const pm2Processes = await new Promise((resolve, reject) => {
      pm2.connect((err) => {
        if (err) {
          console.error('Erreur connexion PM2:', err)
          resolve([])
          return
        }

        pm2.list((err, list) => {
          pm2.disconnect()
          if (err) {
            console.error('Erreur liste PM2:', err)
            resolve([])
          } else {
            resolve(list)
          }
        })
      })
    })

    // Formater les données
    const systemMetrics = {
      cpu: Math.round(cpu.currentLoad),
      memory: {
        used: Math.round(mem.used / 1024 / 1024 / 1024 * 10) / 10, // GB
        total: Math.round(mem.total / 1024 / 1024 / 1024 * 10) / 10 // GB
      },
      disk: {
        used: disk.length > 0 ? Math.round(disk[0].used / 1024 / 1024 / 1024) : 0, // GB
        total: disk.length > 0 ? Math.round(disk[0].size / 1024 / 1024 / 1024) : 0 // GB
      },
      network: {
        download: networkStats.length > 0 ? Math.round(networkStats[0].rx_sec / 1024 / 1024 * 10) / 10 : 0, // MB/s
        upload: networkStats.length > 0 ? Math.round(networkStats[0].tx_sec / 1024 / 1024 * 10) / 10 : 0 // MB/s
      },
      uptime: uptime.uptime,
      processes: processes.list.slice(0, 10).map(proc => ({
        pid: proc.pid,
        name: proc.name,
        cpu: proc.pcpu || 0,
        memory: Math.round(proc.mem_rss / 1024 / 1024), // MB
        status: proc.state === 'running' ? 'running' : 'stopped'
      })),
      services: pm2Processes.map(proc => ({
        name: proc.name,
        status: proc.pm2_env.status === 'online' ? 'online' : 'stopped',
        uptime: Math.floor((Date.now() - proc.pm2_env.pm_uptime) / 1000),
        restarts: proc.pm2_env.restart_time || 0,
        port: proc.pm2_env.PORT || proc.pm2_env.port,
        memory: Math.round(proc.monit.memory / 1024 / 1024) // MB
      }))
    }

    // Ajouter un log d'activité
    addTestLog('INFO', 'API', 'Métriques système récupérées')

    res.json(systemMetrics)
  } catch (error) {
    console.error('Erreur lors de la récupération des métriques:', error)
    addTestLog('ERROR', 'API', `Erreur métriques: ${error.message}`)
    res.status(500).json({ error: 'Erreur lors de la récupération des métriques' })
  }
})

// Endpoint pour les logs
app.get('/logs', authenticateRequest, (req, res) => {
  res.json(systemLogs)
})

// Endpoint pour les alertes
app.get('/alerts', authenticateRequest, (req, res) => {
  res.json(systemAlerts)
})

// Endpoint de santé (sans authentification)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  })
})

// Ajouter des logs périodiquement pour simulation
setInterval(() => {
  const services = ['Strapi', 'PostgreSQL', 'Redis', 'Nginx', 'PM2']
  const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG']
  const messages = [
    'Request processed successfully',
    'Database connection established',
    'Cache hit ratio optimal',
    'Health check passed',
    'Backup completed successfully',
    'Memory usage normal',
    'SSL certificate validated',
    'Load balancer active'
  ]

  const service = services[Math.floor(Math.random() * services.length)]
  const level = levels[Math.floor(Math.random() * levels.length)]
  const message = messages[Math.floor(Math.random() * messages.length)]

  addTestLog(level, service, message)
}, 5000) // Nouveau log toutes les 5 secondes

// Ajouter des alertes périodiquement
setInterval(() => {
  if (Math.random() > 0.8) { // 20% de chance d'avoir une nouvelle alerte
    const types = ['critical', 'warning', 'info']
    const services = ['Strapi', 'PostgreSQL', 'Redis', 'Nginx', 'System']
    const messages = {
      critical: ['High memory usage detected (>90%)', 'Service downtime detected'],
      warning: ['Memory usage above 80%', 'High CPU usage detected'],
      info: ['System backup completed', 'Service restarted successfully']
    }

    const type = types[Math.floor(Math.random() * types.length)]
    const service = services[Math.floor(Math.random() * services.length)]
    const message = messages[type][Math.floor(Math.random() * messages[type].length)]

    addTestAlert(type, service, message)
  }
}, 30000) // Vérifier pour une nouvelle alerte toutes les 30 secondes

app.listen(PORT, () => {
  console.log(`🚀 API système démarrée sur http://localhost:${PORT}`)
  addTestLog('INFO', 'Express', `Serveur démarré sur le port ${PORT}`)
})