#!/bin/bash

# Script pour configurer l'utilisation du MCP Supabase distant
echo "Configuration pour l'utilisation du MCP Supabase distant..."

# Charger les variables d'environnement
if [ -f .env ]; then
  source .env
else
  echo "Erreur: Fichier .env introuvable"
  exit 1
fi

# Vérifier que les variables nécessaires sont définies
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "Erreur: La variable SUPABASE_ACCESS_TOKEN doit être définie dans le fichier .env"
  exit 1
fi

if [ -z "$PROJECT_REF" ]; then
  echo "Erreur: La variable PROJECT_REF doit être définie dans le fichier .env"
  exit 1
fi

echo "Configuration pour le MCP Supabase distant terminée"
echo "Projet Supabase: $PROJECT_REF"
echo "URL du projet: https://$PROJECT_REF.supabase.co"
echo ""
echo "Pour utiliser le MCP Supabase dans Windmill:"
echo "1. Accédez à l'interface Windmill (http://localhost:8000)"
echo "2. Allez dans Settings > Resources"
echo "3. Ajoutez un nouveau serveur MCP avec les paramètres suivants:"
echo "   - Nom: supabase"
echo "   - URL: https://api.supabase.com"
echo ""
echo "Votre token d'accès Supabase est configuré dans le fichier .env"
echo "Le MCP Supabase est maintenant prêt à être utilisé avec Windmill!"
