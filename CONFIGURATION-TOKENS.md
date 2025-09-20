# 🔑 Configuration des Tokens API

Guide pour configurer les tokens d'authentification pour le dashboard BOB.

## 📋 Tokens requis

### 1. **Token Strapi API**
- **Où le trouver** : Admin Strapi → Settings → API Tokens
- **Étapes** :
  1. Ouvrez `http://localhost:1337/admin`
  2. Allez dans **Settings** → **API Tokens**
  3. Cliquez sur **Create new API Token**
  4. Nom : `Dashboard BOB`
  5. Type : **Full access** ou **Custom** avec permissions read
  6. Copiez le token généré

### 2. **Token Hostinger API**
- **Où le trouver** : Panel Hostinger → Advanced → API
- **Étapes** :
  1. Connectez-vous à votre panel Hostinger
  2. Allez dans **Advanced** → **API**
  3. Cliquez sur **Create API Token**
  4. Nom : `Dashboard Monitoring`
  5. Permissions : Server metrics, Domain info
  6. Copiez le token généré

### 3. **Clés de sécurité personnalisées**
Générez des clés sécurisées pour l'API système :

```bash
# Générer des clés aléatoirement
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## ⚙️ Configuration

### Fichier `.env.local` (Dashboard)
```bash
# URLs des services
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SYSTEM_API_URL=http://localhost:3001

# Strapi API
STRAPI_API_TOKEN=votre_token_strapi_ici

# Hostinger API (optionnel)
HOSTINGER_API_TOKEN=votre_token_hostinger_ici

# Sécurité
JWT_SECRET=votre_jwt_secret_genere
API_SECRET_KEY=votre_api_secret_genere
```

### Fichier `system-api/.env` (API Système)
```bash
PORT=3001
API_SECRET_KEY=le_meme_api_secret_key_que_dashboard
JWT_SECRET=le_meme_jwt_secret_que_dashboard
HOSTINGER_API_TOKEN=votre_token_hostinger_ici
```

## 🔒 Niveaux de sécurité

### **Niveau 1 : Développement local (sans tokens)**
- Fonctionne avec données simulées
- Pas d'authentification requise
- Idéal pour tester l'interface

### **Niveau 2 : Avec Strapi seulement**
- Ajouter `STRAPI_API_TOKEN`
- Récupère les vraies données utilisateurs
- Métriques système simulées

### **Niveau 3 : Complet avec authentification**
- Tous les tokens configurés
- API système sécurisée
- Monitoring Hostinger (optionnel)

## 🚀 Démarrage sécurisé

### 1. **Installation des nouvelles dépendances**
```bash
cd system-api
npm install dotenv
```

### 2. **Configuration des variables**
```bash
# Copiez le template
cp .env.example .env

# Éditez avec vos tokens
nano .env
```

### 3. **Test de connexion**
```bash
# API système
curl http://localhost:3001/health

# Avec authentification
curl -H "Authorization: Bearer votre_api_secret" http://localhost:3001/metrics
```

## 🔍 Vérification

### Dashboard sécurisé
- ✅ Tokens Strapi configurés
- ✅ API système authentifiée
- ✅ Connexion Hostinger (optionnel)
- ✅ Données chiffrées en transit

### Logs de sécurité
```bash
# Dans la console du dashboard
- "✅ Connexion Strapi authentifiée"
- "✅ API système sécurisée"
- "⚠️ Hostinger non configuré" (normal si pas de token)
```

## 🛡️ Bonnes pratiques

1. **Rotation des tokens** : Changez-les régulièrement
2. **Permissions minimales** : N'accordez que les droits nécessaires
3. **Variables d'environnement** : Ne commitez jamais les `.env`
4. **Monitoring** : Surveillez les tentatives d'accès non autorisées

## 💡 Dépannage

### Erreur 401 (Non autorisé)
- Vérifiez que les tokens sont corrects
- Assurez-vous qu'ils sont dans les bons fichiers `.env`

### Données vides
- Vérifiez la connexion réseau
- Testez l'endpoint `/health` d'abord

### Token Strapi invalide
- Régénérez le token dans l'admin
- Vérifiez les permissions du token

---

**🎯 Une fois configuré, votre dashboard sera 100% sécurisé avec vos vraies données !**