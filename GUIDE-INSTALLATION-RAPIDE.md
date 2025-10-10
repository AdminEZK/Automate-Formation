# 🚀 Guide d'Installation Rapide

Installation complète en **5 étapes** (15 minutes).

---

## ✅ Étape 1: Base de Données (5 min)

### 1.1 Accéder à Supabase

1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**

### 1.2 Exécuter le script d'installation

1. Ouvrez le fichier `supabase-installation-complete.sql`
2. **Copiez tout le contenu**
3. **Collez dans SQL Editor**
4. Cliquez sur **Run**

✅ Vous devriez voir : `INSTALLATION COMPLÈTE TERMINÉE!`

### 1.3 Ajouter des données de test (optionnel)

1. Ouvrez `supabase-donnees-test.sql`
2. Copiez et collez dans SQL Editor
3. Run

✅ Vous avez maintenant 2 entreprises et 3 sessions de test !

---

## ✅ Étape 2: Configuration Backend (3 min)

### 2.1 Créer le fichier `.env`

```bash
cd /Users/francois/Windsurf/Automate\ Formation
touch .env
```

### 2.2 Ajouter vos clés API

Éditez `.env` :

```bash
# Supabase
SUPABASE_URL=https://VOTRE-PROJET.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend (optionnel pour l'instant)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=formation@votre-domaine.fr

# Backend
PORT=3000
NODE_ENV=development
```

**Où trouver vos clés Supabase ?**
- Dashboard Supabase → Settings → API
- Copiez `URL` et `anon/public key`

### 2.3 Installer les dépendances

```bash
npm install
```

---

## ✅ Étape 3: Démarrer le Backend (1 min)

```bash
npm start
```

✅ Vous devriez voir :
```
Server running on port 3000
Connected to Supabase
```

**Testez l'API :**
```bash
curl http://localhost:3000/api/sessions
```

Vous devriez voir vos sessions en JSON !

---

## ✅ Étape 4: Configuration Frontend (3 min)

### 4.1 Aller dans le dossier frontend

```bash
cd dashboard-client
```

### 4.2 Créer `.env` pour le frontend

```bash
touch .env
```

Contenu de `dashboard-client/.env` :

```bash
VITE_API_URL=http://localhost:3000
```

### 4.3 Installer les dépendances

```bash
npm install
```

---

## ✅ Étape 5: Démarrer le Dashboard (1 min)

```bash
npm run dev
```

✅ Vous devriez voir :
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3001/
```

---

## 🎉 C'est Terminé !

Ouvrez votre navigateur sur **http://localhost:3001**

Vous devriez voir :
- ✅ Le dashboard avec vos sessions
- ✅ Les statistiques
- ✅ Les actions disponibles

---

## 🧪 Tester le Workflow

### 1. Créer une nouvelle session

1. Cliquez sur une session existante
2. Observez les détails
3. Testez les actions :
   - "Envoyer le devis"
   - "Accepter le devis"
   - etc.

### 2. Vérifier la base de données

Retournez dans Supabase SQL Editor :

```sql
-- Voir toutes les sessions
SELECT * FROM vue_sessions_formation;

-- Voir les statistiques
SELECT * FROM vue_dashboard_stats;

-- Voir les participants
SELECT * FROM participants;
```

---

## 🐛 Problèmes Courants

### Le backend ne démarre pas

**Erreur: Cannot find module '@supabase/supabase-js'**

```bash
npm install @supabase/supabase-js
```

**Erreur: SUPABASE_URL is not defined**

Vérifiez votre fichier `.env` à la racine du projet.

### Le frontend ne se connecte pas

**Erreur: Network Error**

1. Vérifiez que le backend tourne (port 3000)
2. Vérifiez `dashboard-client/.env` :
   ```bash
   VITE_API_URL=http://localhost:3000
   ```

### Aucune session n'apparaît

1. Vérifiez que vous avez exécuté `supabase-donnees-test.sql`
2. Testez l'API directement :
   ```bash
   curl http://localhost:3000/api/sessions
   ```

---

## 📋 Checklist Finale

- [ ] Base de données créée (11 tables)
- [ ] Données de test insérées
- [ ] Fichier `.env` configuré (racine)
- [ ] Backend démarré (port 3000)
- [ ] Fichier `dashboard-client/.env` configuré
- [ ] Frontend démarré (port 3001)
- [ ] Dashboard accessible dans le navigateur
- [ ] Sessions visibles dans le dashboard

---

## 🎯 Prochaines Étapes

### Configuration Emails (Resend)

1. Créez un compte sur https://resend.com
2. Obtenez votre API Key
3. Ajoutez-la dans `.env`
4. Testez l'envoi d'emails :
   ```bash
   node examples/testResend.js
   ```

### Configuration Signatures (DocuSeal)

1. Créez un compte sur https://www.docuseal.co
2. Créez un template de convention
3. Obtenez votre API Key
4. Ajoutez-la dans `.env`

### Déploiement en Production

Consultez `GUIDE-DEPLOIEMENT.md` (à venir)

---

## 📞 Besoin d'Aide ?

- Consultez `README-PRINCIPAL.md` pour la documentation complète
- Ouvrez une issue sur GitHub
- Vérifiez les logs :
  - Backend: Terminal où tourne `npm start`
  - Frontend: Console du navigateur (F12)

---

**Bravo ! Votre système est opérationnel ! 🎉**
