# Checklist de Déploiement - Fix CORS

## ✅ Modifications effectuées

- [x] Configuration CORS multi-origines dans `index.js`
- [x] Ajout endpoint `/health` pour diagnostics
- [x] Amélioration gestion d'erreurs dans `FormationRequestForm.js`

## 📋 Actions à effectuer

### 1. Commit et Push
```bash
git add .
git commit -m "fix: CORS configuration for Render deployment"
git push origin main
```

### 2. Configuration Render Backend

**URL**: https://dashboard.render.com

1. Sélectionner le service **automate-formation-backend**
2. Aller dans **Environment**
3. Vérifier/Ajouter ces variables:
   ```
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://automate-formation-1.onrender.com
   SUPABASE_URL=<votre_url>
   SUPABASE_SERVICE_ROLE_KEY=<votre_cle>
   RESEND_API_KEY=<votre_cle>
   ```
4. **Save Changes** → Le service redémarrera automatiquement

### 3. Configuration Render Frontend

1. Sélectionner le service **automate-formation-1**
2. Aller dans **Environment**
3. Vérifier ces variables:
   ```
   REACT_APP_API_URL=https://automate-formation-backend.onrender.com
   REACT_APP_SUPABASE_URL=<votre_url>
   REACT_APP_SUPABASE_ANON_KEY=<votre_cle>
   ```
4. Si modifiées: **Manual Deploy** → Deploy latest commit

### 4. Tests post-déploiement

#### Test 1: Backend Health Check
```bash
curl https://automate-formation-backend.onrender.com/health
```
**Attendu**: `{"status":"ok",...}`

#### Test 2: CORS Preflight
```bash
curl -X OPTIONS https://automate-formation-backend.onrender.com/api/demandes \
  -H "Origin: https://automate-formation-1.onrender.com" \
  -H "Access-Control-Request-Method: POST" \
  -i
```
**Attendu**: Headers `Access-Control-Allow-Origin` présents

#### Test 3: Formulaire complet
1. Ouvrir https://automate-formation-1.onrender.com
2. Ouvrir DevTools (F12) → Console
3. Remplir et soumettre le formulaire
4. Vérifier: ✅ Pas d'erreur CORS, ✅ Message de succès

### 5. Vérification des logs

**Backend logs** (Render Dashboard):
```
✅ Serveur démarré sur le port 3001
✅ Frontend URL: https://automate-formation-1.onrender.com
✅ 📝 Nouvelle demande de formation reçue
```

**Pas de**:
```
❌ CORS blocked origin
❌ 404 errors
```

## 🔧 Troubleshooting

### Erreur persiste après déploiement

1. **Vider le cache du navigateur**: Ctrl+Shift+R (ou Cmd+Shift+R sur Mac)
2. **Vérifier les logs Render**: Dashboard → Logs
3. **Tester avec curl** pour isoler le problème

### CORS toujours bloqué

1. Vérifier que `FRONTEND_URL` est bien défini sur Render
2. Vérifier l'URL exacte dans les logs: `⚠️ CORS blocked origin: ...`
3. Ajouter cette URL dans `allowedOrigins` si nécessaire

### 404 persiste

1. Vérifier que le backend répond: `/health`
2. Vérifier la route exacte: `/api/demandes` (avec `/api` prefix)
3. Vérifier les logs backend pour voir si la requête arrive

## 📞 Support

Si le problème persiste:
1. Capturer les logs backend (Render Dashboard)
2. Capturer la console navigateur (F12)
3. Tester avec curl pour isoler le problème
