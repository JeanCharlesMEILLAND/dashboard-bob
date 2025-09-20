# Dashboard BOB - Données Réelles

Dashboard connecté aux vraies données système et business de BOB.

## 🏗️ Architecture

### Sources de données
- **Strapi BOB** (`localhost:1337`) - Données business/utilisateurs
- **API Système** (`localhost:3001`) - Métriques système en temps réel
- **Système Linux** - via `systeminformation` et `pm2`

### Services
1. **Dashboard Next.js** (`localhost:3000`) - Interface principale
2. **API Système** (`localhost:3001`) - Collecte des métriques
3. **Strapi BOB** (`localhost:1337`) - Base de données business

## 🚀 Installation et démarrage

### 1. Installation des dépendances

```bash
# Dashboard
npm install

# API système
cd system-api
npm install
cd ..
```

### 2. Démarrage complet

```bash
# Option 1: Script automatique
chmod +x start-all.sh
./start-all.sh

# Option 2: Manuel
# Terminal 1 - API système
cd system-api && npm start

# Terminal 2 - Dashboard
npm run dev

# Terminal 3 - Strapi (si pas déjà démarré)
cd ../bob-strapi && npm run develop
```

## 📊 Fonctionnalités

### Mode DevOps
- ✅ **Métriques système réelles** (CPU, RAM, disque, réseau)
- ✅ **Processus en temps réel** via `systeminformation`
- ✅ **Services PM2** en direct
- ✅ **Logs système** en continu
- ✅ **Alertes intelligentes** basées sur les seuils

### Mode Data/Business
- ✅ **Utilisateurs Strapi** en temps réel
- ✅ **Métriques calculées** à partir des vraies données
- ✅ **KPIs business** dynamiques
- ✅ **Croissance et engagement** automatiques

## 🔧 Configuration

### Variables d'environnement
```bash
# Dashboard (.env.local)
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SYSTEM_API_URL=http://localhost:3001

# Strapi (.env dans bob-strapi/)
HOST=0.0.0.0
PORT=1337
```

### Endpoints API

#### API Système (port 3001)
- `GET /metrics` - Métriques système complètes
- `GET /logs` - Logs système en temps réel
- `GET /alerts` - Alertes actives

#### Strapi (port 1337)
- `GET /api/users` - Liste des utilisateurs
- `POST /api/auth/local` - Authentification

## 📈 Données collectées

### Système (temps réel)
- **CPU**: Utilisation actuelle via `os.loadavg()`
- **Mémoire**: RAM utilisée/totale
- **Disque**: Espace utilisé par partition
- **Réseau**: Débit en/sortie en MB/s
- **Processus**: Top 10 des processus actifs
- **PM2**: État des services managés

### Business (Strapi)
- **Utilisateurs**: Total, actifs, croissance
- **Revenus**: Calculés à partir des données
- **Engagement**: Sessions, durée moyenne
- **Conversions**: Taux basé sur les actions

## 🛠️ Développement

### Structure
```
dashboard-bob/
├── src/
│   ├── app/page.tsx           # Dashboard principal
│   ├── hooks/useSystemData.ts # Hooks pour données réelles
│   └── lib/api.ts            # Services API
├── system-api/
│   ├── server.js             # API Node.js pour système
│   └── package.json
└── start-all.sh              # Script de démarrage
```

### Ajout de nouvelles métriques
1. Modifier `system-api/server.js` pour collecter les données
2. Mettre à jour les types dans `src/hooks/useSystemData.ts`
3. Ajouter l'affichage dans `src/app/page.tsx`

## 🔍 Monitoring

### Vérification des services
```bash
# Dashboard
curl http://localhost:3000

# API système
curl http://localhost:3001/metrics

# Strapi
curl http://localhost:1337/api/users
```

### Logs
- **Dashboard**: Console navigateur + Next.js logs
- **API système**: `console.log` dans le terminal
- **Strapi**: Logs dans `bob-strapi/`

## 🚨 Troubleshooting

### Problèmes courants
1. **API système inaccessible**: Vérifier port 3001 libre
2. **Strapi non connecté**: Vérifier service démarré sur 1337
3. **Données vides**: Vérifier logs API pour erreurs réseau
4. **Permissions PM2**: Lancer avec `sudo` si nécessaire

### Fallback
Si l'API système échoue, le dashboard utilise automatiquement des données simulées pour maintenir la fonctionnalité.