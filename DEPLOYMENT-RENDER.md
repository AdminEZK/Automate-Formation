# 🚀 Guide de Déploiement sur Render

Ce guide vous accompagne pour déployer **Automate Formation** sur Render avec Supabase.

---

## 📋 Prérequis

- ✅ Compte Render (avec plan Starter ou supérieur)
- ✅ Compte Supabase avec projet créé
- ✅ Compte Resend avec clé API
- ✅ Repository GitHub : https://github.com/AdminEZK/Automate-Formation

---

## 🎯 Architecture de Déploiement

```
┌─────────────────┐
│   Frontend      │  → Render Static Site
│   (React)       │     https://automate-formation-frontend.onrender.com
└─────────────────┘
         ↓
┌─────────────────┐
│   Backend       │  → Render Web Service
│   (Node.js)     │     https://automate-formation-backend.onrender.com
└─────────────────┘
         ↓
┌─────────────────┐
│   Supabase      │  → Supabase Cloud
│   (PostgreSQL)  │     https://votre-projet.supabase.co
└─────────────────┘
```

---

## 🔧 Étape 1 : Préparer Supabase

### 1.1 Récupérer les clés Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Ouvrez votre projet
3. Allez dans **Settings** → **API**
4. Notez ces informations :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon/public key** : `eyJhbGc...`
   - **service_role key** : `eyJhbGc...` (⚠️ À garder secret !)

### 1.2 Vérifier le schéma de base de données

Assurez-vous que votre base de données Supabase contient :
- ✅ Table `entreprises`
- ✅ Table `formations_catalogue`
- ✅ Table `sessions_formation`
- ✅ Table `participants`

Si ce n'est pas le cas, exécutez le script SQL :
```bash
# Depuis votre projet local
node deploy-schema.js
```

---

## 🚀 Étape 2 : Déployer le Backend sur Render

### 2.1 Créer le Web Service Backend

1. Connectez-vous à [render.com](https://render.com)
2. Cliquez sur **New** → **Web Service**
3. Connectez votre repository GitHub : `AdminEZK/Automate-Formation`
4. Configurez le service :

   **Configuration de base :**
   - **Name** : `automate-formation-backend`
   - **Region** : `Frankfurt (EU Central)`
   - **Branch** : `main`
   - **Root Directory** : (laisser vide)
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`

### 2.2 Configurer les Variables d'Environnement

Dans **Environment** → **Environment Variables**, ajoutez :

```env
NODE_ENV=production
PORT=3001

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Resend
RESEND_API_KEY=re_xxxxx

# Frontend (sera mis à jour après déploiement du frontend)
FRONTEND_URL=https://automate-formation-frontend.onrender.com
```

⚠️ **Important** : Remplacez les valeurs par vos vraies clés !

### 2.3 Déployer

1. Cliquez sur **Create Web Service**
2. Attendez que le déploiement se termine (~5 minutes)
3. Notez l'URL du backend : `https://automate-formation-backend.onrender.com`

### 2.4 Tester le Backend

Ouvrez dans votre navigateur :
```
https://automate-formation-backend.onrender.com/api/formations
```

Vous devriez voir la liste des formations en JSON.

---

## 🎨 Étape 3 : Déployer le Frontend sur Render

### 3.1 Créer le Static Site Frontend

1. Sur Render, cliquez sur **New** → **Static Site**
2. Connectez le même repository : `AdminEZK/Automate-Formation`
3. Configurez le site :

   **Configuration de base :**
   - **Name** : `automate-formation-frontend`
   - **Region** : `Frankfurt (EU Central)`
   - **Branch** : `main`
   - **Root Directory** : `client`
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `build`

### 3.2 Configurer les Variables d'Environnement

Dans **Environment** → **Environment Variables**, ajoutez :

```env
REACT_APP_API_URL=https://automate-formation-backend.onrender.com
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGc...
```

### 3.3 Déployer

1. Cliquez sur **Create Static Site**
2. Attendez que le build se termine (~3-5 minutes)
3. Notez l'URL du frontend : `https://automate-formation-frontend.onrender.com`

### 3.4 Mettre à jour le Backend

⚠️ **Important** : Retournez dans le backend et mettez à jour la variable `FRONTEND_URL` :

```env
FRONTEND_URL=https://automate-formation-frontend.onrender.com
```

Puis cliquez sur **Manual Deploy** → **Deploy latest commit** pour redémarrer le backend.

---

## ✅ Étape 4 : Vérification

### 4.1 Tester l'application

1. Ouvrez : `https://automate-formation-frontend.onrender.com`
2. Vérifiez que l'interface se charge correctement
3. Testez la création d'une demande de formation
4. Vérifiez que les données apparaissent dans Supabase

### 4.2 Vérifier les logs

En cas de problème :
- **Backend** : Render Dashboard → Backend Service → Logs
- **Frontend** : Console du navigateur (F12)
- **Supabase** : Supabase Dashboard → Logs

---

## 🔄 Déploiement Automatique (CI/CD)

Render déploie automatiquement à chaque push sur GitHub !

```bash
# Faire des modifications
git add .
git commit -m "Amélioration de la fonctionnalité X"
git push origin main

# Render déploie automatiquement dans ~2-5 minutes
```

---

## 🌐 Étape 5 : Domaine Personnalisé (Optionnel)

### 5.1 Configurer un domaine pour le Frontend

1. Dans Render → Frontend Service → **Settings**
2. Allez dans **Custom Domain**
3. Ajoutez votre domaine : `app.votredomaine.com`
4. Suivez les instructions pour configurer le DNS

### 5.2 Configurer un domaine pour le Backend

1. Dans Render → Backend Service → **Settings**
2. Allez dans **Custom Domain**
3. Ajoutez votre domaine : `api.votredomaine.com`
4. Mettez à jour les variables d'environnement :
   - Backend : `FRONTEND_URL=https://app.votredomaine.com`
   - Frontend : `REACT_APP_API_URL=https://api.votredomaine.com`

---

## 🔒 Sécurité en Production

### ✅ Checklist de sécurité

- ✅ Variables d'environnement configurées (pas de clés en dur dans le code)
- ✅ CORS configuré avec l'URL du frontend
- ✅ HTTPS activé automatiquement par Render
- ✅ Service Role Key Supabase jamais exposée au frontend
- ✅ RLS (Row Level Security) activé sur Supabase

### 🔐 Bonnes pratiques

1. **Ne jamais commiter le fichier `.env`** (déjà dans `.gitignore`)
2. **Utiliser des secrets Render** pour les clés sensibles
3. **Activer les politiques RLS** sur toutes les tables Supabase
4. **Monitorer les logs** régulièrement

---

## 📊 Monitoring et Performance

### Render Dashboard

- **Metrics** : CPU, RAM, Bandwidth
- **Logs** : Erreurs et requêtes
- **Alerts** : Notifications en cas de problème

### Supabase Dashboard

- **Database** : Taille, connexions
- **API** : Nombre de requêtes
- **Storage** : Fichiers uploadés

---

## 🆘 Dépannage

### Problème : Le backend ne démarre pas

**Solution** :
1. Vérifiez les logs dans Render
2. Vérifiez que toutes les variables d'environnement sont définies
3. Vérifiez que `npm install` s'est bien exécuté

### Problème : Le frontend ne se connecte pas au backend

**Solution** :
1. Vérifiez que `REACT_APP_API_URL` pointe vers le bon backend
2. Vérifiez les logs du navigateur (F12 → Console)
3. Vérifiez que CORS est bien configuré dans le backend

### Problème : Erreur de connexion Supabase

**Solution** :
1. Vérifiez que les clés Supabase sont correctes
2. Vérifiez que les politiques RLS permettent l'accès
3. Vérifiez les logs Supabase

### Problème : Les emails ne s'envoient pas

**Solution** :
1. Vérifiez que `RESEND_API_KEY` est correcte
2. Vérifiez le quota Resend
3. Vérifiez les logs du backend

---

## 💰 Coûts Estimés

### Plan Render Starter (que vous avez)
- **Backend** : Inclus
- **Frontend** : Inclus
- **Bandwidth** : 500 GB inclus
- **Total** : ~7$/mois

### Supabase Free Tier
- **Database** : 500 MB
- **Bandwidth** : 2 GB
- **API Requests** : 50,000/mois
- **Total** : Gratuit

### Resend Free Tier
- **Emails** : 100/jour (3000/mois)
- **Total** : Gratuit

**Coût total estimé : ~7$/mois** (peut augmenter selon l'usage)

---

## 🎉 Félicitations !

Votre application **Automate Formation** est maintenant en production ! 🚀

**URLs de production :**
- Frontend : `https://automate-formation-frontend.onrender.com`
- Backend : `https://automate-formation-backend.onrender.com`
- Supabase : `https://xxxxx.supabase.co`

**Prochaines étapes :**
1. Configurer un domaine personnalisé
2. Mettre en place des tests automatisés
3. Configurer des alertes de monitoring
4. Documenter les processus pour votre équipe

---

## 📞 Support

- **Render** : https://render.com/docs
- **Supabase** : https://supabase.com/docs
- **Resend** : https://resend.com/docs

Besoin d'aide ? Consultez les logs ou contactez le support Render (inclus dans votre plan) ! 💬
