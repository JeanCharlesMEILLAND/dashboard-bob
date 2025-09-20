#!/bin/bash

echo "🚀 Démarrage de l'écosystème dashboard BOB..."

# Démarrer l'API système en arrière-plan
echo "📊 Démarrage de l'API système..."
cd system-api
npm install
npm start &
SYSTEM_API_PID=$!

# Attendre que l'API soit prête
echo "⏳ Attente du démarrage de l'API système..."
sleep 3

# Retourner au dossier principal
cd ..

# Démarrer le dashboard Next.js
echo "🎨 Démarrage du dashboard Next.js..."
npm run dev &
DASHBOARD_PID=$!

echo "✅ Services démarrés:"
echo "   - API système: http://localhost:3001 (PID: $SYSTEM_API_PID)"
echo "   - Dashboard: http://localhost:3000 (PID: $DASHBOARD_PID)"
echo "   - Strapi (séparé): http://localhost:1337"
echo ""
echo "📝 Pour arrêter les services:"
echo "   kill $SYSTEM_API_PID $DASHBOARD_PID"
echo ""
echo "🔗 Liens utiles:"
echo "   - Dashboard: http://localhost:3000"
echo "   - API système: http://localhost:3001/metrics"
echo "   - Strapi admin: http://localhost:1337/admin"

# Attendre que l'utilisateur appuie sur Ctrl+C
wait