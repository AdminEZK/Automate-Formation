# Fix CORS et 404 - Render Deployment

## Problème Identifié

L'erreur CORS indique que le backend ne reconnaît pas l'origine du frontend:
- **Frontend URL actuelle**: `https://automate-formation-1.onrender.com`
- **Backend URL**: `https://automate-formation-backend.onrender.com`

## Solutions Appliquées

### 1. Mise à jour du code backend (`index.js`)

✅ **CORS configuré pour accepter plusieurs origines**:
- `https://automate-formation-1.onrender.com`
- `https://automate-formation.onrender.com`
- URLs de développement local

✅ **Ajout d'un endpoint de santé** `/health` pour diagnostiquer

### 2. Actions à effectuer sur Render

#### A. Backend (automate-formation-backend)

1. **Aller dans le dashboard Render** → Service backend
2. **Environment** → Ajouter/Modifier:
   ```
   FRONTEND_URL=https://automate-formation-1.onrender.com
   ```
3. **Redéployer** le service backend avec le nouveau code

#### B. Frontend (automate-formation-1)

1. **Vérifier les variables d'environnement**:
   ```
   REACT_APP_API_URL=https://automate-formation-backend.onrender.com
   REACT_APP_SUPABASE_URL=<votre_url_supabase>
   REACT_APP_SUPABASE_ANON_KEY=<votre_cle_anon>
   ```
2. **Redéployer** si nécessaire

## Tests à effectuer

### 1. Tester le backend
```bash
curl https://automate-formation-backend.onrender.com/health
```
Devrait retourner:
```json
{"status":"ok","timestamp":"...","environment":"production"}
```

### 2. Tester l'API demandes
```bash
curl -X OPTIONS https://automate-formation-backend.onrender.com/api/demandes \
  -H "Origin: https://automate-formation-1.onrender.com" \
  -H "Access-Control-Request-Method: POST" \
  -v
```
Devrait retourner des headers CORS valides.

### 3. Tester le formulaire
1. Ouvrir `https://automate-formation-1.onrender.com`
2. Remplir le formulaire
3. Vérifier dans la console du navigateur (F12) qu'il n'y a plus d'erreur CORS

## Déploiement

### Option 1: Via Git (Recommandé)
```bash
# Committer les changements
git add index.js RENDER-CORS-FIX.md
git commit -m "fix: Configure CORS for multiple frontend origins"
git push origin main
```
Render redéploiera automatiquement.

### Option 2: Redéploiement manuel
1. Dashboard Render → Service backend
2. **Manual Deploy** → Deploy latest commit

## Vérification des logs

Sur Render, vérifier les logs du backend pour:
- ✅ `Serveur démarré sur le port 3001`
- ✅ `Frontend URL: https://automate-formation-1.onrender.com`
- ⚠️ Pas de message `CORS blocked origin`

## Troubleshooting

### Si CORS persiste
1. Vérifier que `FRONTEND_URL` est bien défini sur Render
2. Vérifier les logs backend pour voir l'origine bloquée
3. Ajouter l'origine dans le tableau `allowedOrigins` dans `index.js`

### Si 404 persiste
1. Vérifier que le backend est bien démarré: `/health`
2. Vérifier que `REACT_APP_API_URL` pointe vers le bon backend
3. Vérifier les routes dans `demandeRoutes.js`

## Notes importantes

- ⚠️ Les variables d'environnement React (`REACT_APP_*`) nécessitent un rebuild du frontend
- ⚠️ Les changements de variables backend nécessitent un redémarrage du service
- ✅ Le code supporte maintenant plusieurs URLs frontend sans modification
