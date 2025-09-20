#!/bin/bash
# Script de déploiement Dashboard BOB sur VPS
# =============================================

echo "🚀 Déploiement Dashboard BOB sur VPS"
echo "======================================"

# Configuration
VPS_HOST="72.60.132.74"
VPS_USER="root"
APP_DIR="/var/www/dashboard-bob"
GITHUB_REPO="https://github.com/JeanCharlesMEILLAND/dashboard-bob.git"

echo "📦 Connexion au VPS et clone du repository..."

# Commandes à exécuter sur le VPS
ssh $VPS_USER@$VPS_HOST << 'EOF'
    echo "🔄 Mise à jour du système..."
    cd /var/www

    # Supprimer l'ancien dossier s'il existe
    if [ -d "dashboard-bob" ]; then
        echo "🗑️ Suppression de l'ancienne version..."
        rm -rf dashboard-bob
    fi

    # Cloner le repository
    echo "📥 Clone du repository GitHub..."
    git clone https://github.com/JeanCharlesMEILLAND/dashboard-bob.git

    cd dashboard-bob

    # Installation des dépendances
    echo "📦 Installation des dépendances..."
    npm install

    # Build de production
    echo "🏗️ Build de production..."
    npm run build

    # Configuration PM2
    echo "⚡ Configuration PM2..."

    # Arrêter l'ancienne instance si elle existe
    pm2 stop dashboard-bob 2>/dev/null || true
    pm2 delete dashboard-bob 2>/dev/null || true

    # Démarrer avec PM2
    PORT=3010 pm2 start npm --name "dashboard-bob" -- start

    # Sauvegarder la configuration PM2
    pm2 save

    echo "✅ Dashboard BOB déployé avec succès !"
    echo "🌐 Accessible sur : http://72.60.132.74:3010"

    # Afficher le statut
    pm2 status
EOF

echo "🎉 Déploiement terminé !"
echo "🌐 Dashboard accessible sur : http://72.60.132.74:3010"