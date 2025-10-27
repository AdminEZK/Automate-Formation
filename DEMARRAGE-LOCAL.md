# 🚀 Guide de Démarrage en LOCAL

## 📋 Prérequis

- Node.js installé
- Python 3.9+ installé
- Supabase configuré (`.env` avec SUPABASE_URL et SUPABASE_KEY)

---

## ⚙️ Configuration

### 1. Variables d'environnement

Assurez-vous d'avoir un fichier `.env` à la racine :

```env
# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre-cle-supabase

# Resend (Email)
RESEND_API_KEY=votre-cle-resend

# Port (optionnel)
PORT=3000
```

### 2. Installer les dépendances

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..

# Dashboard (optionnel)
cd dashboard-client
npm install
cd ..
```

---

## 🏃 Lancer les services

### Option 1 : Lancer manuellement (3 terminaux)

#### Terminal 1 - Backend API (Express)
```bash
npm start
# ✅ Backend disponible sur http://localhost:3000
```

#### Terminal 2 - Frontend React
```bash
cd client
npm start
# ✅ Frontend disponible sur http://localhost:3001
# (React démarre automatiquement sur 3001 si 3000 est pris)
```

#### Terminal 3 - Dashboard (optionnel)
```bash
cd dashboard-client
npm run dev
# ✅ Dashboard disponible sur http://localhost:5173
```

---

### Option 2 : Script de démarrage automatique

Créez un fichier `start-local.sh` :

```bash
#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Démarrage des services en local...${NC}"

# Backend
echo -e "${BLUE}📡 Démarrage du backend...${NC}"
npm start &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 3

# Frontend
echo -e "${BLUE}🎨 Démarrage du frontend...${NC}"
cd client && npm start &
FRONTEND_PID=$!

# Dashboard (optionnel)
# echo -e "${BLUE}📊 Démarrage du dashboard...${NC}"
# cd ../dashboard-client && npm run dev &
# DASHBOARD_PID=$!

echo -e "${GREEN}✅ Tous les services sont démarrés !${NC}"
echo -e "${BLUE}Backend:${NC} http://localhost:3000"
echo -e "${BLUE}Frontend:${NC} http://localhost:3001"
# echo -e "${BLUE}Dashboard:${NC} http://localhost:5173"

# Attendre Ctrl+C pour arrêter
wait
```

Puis lancez :
```bash
chmod +x start-local.sh
./start-local.sh
```

---

## 🌐 URLs en LOCAL

| Service | URL | Port |
|---------|-----|------|
| **Backend API** | http://localhost:3000 | 3000 |
| **Frontend React** | http://localhost:3001 | 3001 |
| **Dashboard** | http://localhost:5173 | 5173 |

---

## 🔧 Configuration du Proxy

Le frontend React utilise un **proxy** pour rediriger les appels API vers le backend.

**Fichier:** `client/package.json`
```json
{
  "proxy": "http://localhost:3000"
}
```

✅ **Avec le proxy, les appels API fonctionnent automatiquement :**
- Frontend : `http://localhost:3001`
- Appel API : `/api/documents/phase/proposition/123`
- Redirigé vers : `http://localhost:3000/api/documents/phase/proposition/123`

**❌ PAS BESOIN de changer les routes dans le code !**

---

## 📄 Tester la génération de documents

### 1. Créer une session de test

1. Aller sur http://localhost:3001
2. Créer une entreprise
3. Créer une formation
4. Créer une session avec participants

### 2. Générer les documents

1. Aller sur la page de détail de la session : `/sessions/:id`
2. Cliquer sur l'onglet **"📄 Documents"**
3. Cliquer sur **"Générer les documents"** pour chaque phase

### 3. Vérifier les documents générés

Les documents sont créés dans :
```
generated_documents/
└── session_[id]/
    ├── Proposition_[date].docx
    ├── Programme_[date].docx
    ├── Convocation_[nom]_[date].docx
    └── ...
```

---

## 🐛 Dépannage

### Erreur : Port 3000 déjà utilisé

```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 [PID]
```

### Erreur : Module Python non trouvé

```bash
# Installer les dépendances Python
pip install python-docx supabase python-dotenv
```

### Erreur : Supabase connection failed

Vérifiez votre fichier `.env` :
- `SUPABASE_URL` est correct
- `SUPABASE_KEY` est la clé **anon/public**

### Le proxy ne fonctionne pas

1. Arrêter le frontend : `Ctrl+C`
2. Supprimer le cache : `rm -rf client/node_modules/.cache`
3. Relancer : `cd client && npm start`

---

## 🚀 Déployer sur Render après les tests

Une fois les tests en local réussis :

```bash
git add -A
git commit -m "fix: Correction du proxy pour le développement local"
git push origin main
```

Render déploiera automatiquement les changements.

---

## 📊 Différences Local vs Production

| Aspect | Local | Production (Render) |
|--------|-------|---------------------|
| **Backend URL** | http://localhost:3000 | https://votre-backend.onrender.com |
| **Frontend URL** | http://localhost:3001 | https://votre-frontend.onrender.com |
| **Proxy** | ✅ Activé | ❌ Désactivé (URLs absolues) |
| **Variables d'env** | `.env` local | Variables Render |
| **Base de données** | Supabase (même) | Supabase (même) |

---

## ✅ Checklist avant de tester

- [ ] `.env` configuré avec Supabase
- [ ] Dépendances installées (`npm install`)
- [ ] Migrations SQL exécutées dans Supabase
- [ ] Backend démarré (port 3000)
- [ ] Frontend démarré (port 3001)
- [ ] Session de test créée avec participants
- [ ] Templates Word présents dans `Dossier exemple/`

---

**Bon développement ! 🎉**
