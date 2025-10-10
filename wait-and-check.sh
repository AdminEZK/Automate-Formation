#!/bin/bash
echo "⏳ Attente de 30 secondes pour le déploiement..."
sleep 30
echo ""
echo "🔍 Vérification de l'état des services..."
node monitor-deploys.js
