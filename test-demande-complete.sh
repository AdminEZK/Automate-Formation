#!/bin/bash
# Test complet d'une demande de formation avec envoi d'emails

echo "🧪 Test d'une demande de formation complète"
echo "==========================================="
echo ""

# Remplace par ton vrai email pour recevoir les emails
VOTRE_EMAIL="studiofromthesea@gmail.com"

curl -X POST http://localhost:3001/api/demandes \
  -H "Content-Type: application/json" \
  -d "{
    \"entreprise\": {
      \"nom\": \"Test Email Entreprise\",
      \"email_contact\": \"$VOTRE_EMAIL\",
      \"telephone\": \"0612345678\",
      \"adresse\": \"123 rue de Test\",
      \"code_postal\": \"75001\",
      \"ville\": \"Paris\"
    },
    \"formation\": {
      \"formation_catalogue_id\": \"maitre-apprentissage\",
      \"date_debut\": \"2025-11-20\",
      \"date_fin\": \"2025-11-22\",
      \"modalite\": \"presentiel\"
    },
    \"participants\": [
      {
        \"nom\": \"Test\",
        \"prenom\": \"Jean\",
        \"email\": \"$VOTRE_EMAIL\",
        \"telephone\": \"0612345678\",
        \"fonction\": \"Testeur\"
      }
    ]
  }"

echo ""
echo ""
echo "✅ Requête envoyée !"
echo ""
echo "📧 Vérifie maintenant :"
echo "   1. Les logs du serveur (tu devrais voir les emails envoyés)"
echo "   2. Ta boîte mail : $VOTRE_EMAIL"
echo "   3. Le dashboard : http://localhost:3001"
echo ""
