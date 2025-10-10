# 🚀 Guide d'Installation Complet - Dashboard ALADE Formation

Guide étape par étape pour installer et configurer le dashboard de suivi des formations.

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation Backend](#installation-backend)
3. [Installation Frontend](#installation-frontend)
4. [Configuration Base de Données](#configuration-base-de-données)
5. [Configuration des Services](#configuration-des-services)
6. [Démarrage](#démarrage)
7. [Tests](#tests)
8. [Déploiement](#déploiement)

---

## 1. Prérequis

### Logiciels requis
- **Node.js** 18+ et npm
- **PostgreSQL** 14+ (via Supabase)
- **Git**

### Services externes
- Compte **Supabase** (auto-hébergé ou cloud)
- Compte **Resend** pour les emails
- Compte **DocuSeal** pour les signatures électroniques

---

## 2. Installation Backend

### 2.1 Cloner le projet

```bash
cd /Users/francois/Windsurf/Automate\ Formation
```

### 2.2 Installer les dépendances

```bash
npm install
```

### 2.3 Configurer les variables d'environnement

Créer un fichier `.env` à la racine :

```env
# Port du serveur
PORT=3000

# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre_supabase_anon_key

# Resend (emails)
RESEND_API_KEY=re_votre_cle_api

# DocuSeal (signatures)
DOCUSEAL_API_KEY=votre_cle_docuseal
DOCUSEAL_TEMPLATE_ID=votre_template_id

# Environnement
NODE_ENV=development
```

### 2.4 Vérifier la structure des routes

Le fichier `index.js` doit inclure les nouvelles routes :

```javascript
const formationRoutes = require('./routes/formationRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

app.use('/api', formationRoutes);
app.use('/api', sessionRoutes);
```

---

## 3. Installation Frontend

### 3.1 Accéder au dossier dashboard

```bash
cd dashboard-client
```

### 3.2 Installer les dépendances

```bash
npm install
```

### 3.3 Vérifier la configuration Vite

Le fichier `vite.config.js` doit contenir :

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

---

## 4. Configuration Base de Données

### 4.1 Exécuter le schéma de base

Si ce n'est pas déjà fait, exécuter le schéma initial :

```bash
psql -h votre-host -U postgres -d postgres -f supabase-tables.sql
```

### 4.2 Mettre à jour le schéma pour le workflow

Exécuter le script de mise à jour :

```bash
psql -h votre-host -U postgres -d postgres -f supabase-schema-update-workflow.sql
```

Ce script ajoute :
- ✅ Nouveaux champs (devis_envoye_le, devis_accepte_le, etc.)
- ✅ Trigger pour compter les participants
- ✅ Trigger pour valider les transitions de statut
- ✅ Vue pour les statistiques du dashboard
- ✅ Table export_logs pour la traçabilité

### 4.3 Configurer les triggers d'automatisation

Exécuter le script des triggers :

```bash
psql -h votre-host -U postgres -d postgres -f supabase-triggers-automation.sql
```

**⚠️ Important** : Les triggers utilisent `pg_net` pour les appels HTTP. Si non disponible, configurez des webhooks Supabase à la place.

#### Option A : Installer pg_net (recommandé)

```sql
CREATE EXTENSION IF NOT EXISTS pg_net;
```

#### Option B : Utiliser les webhooks Supabase

1. Aller dans le dashboard Supabase
2. Database > Webhooks
3. Créer les webhooks suivants :

**Webhook 1 : Envoi convention**
- Table : `sessions_formation`
- Événement : `UPDATE`
- Condition : `NEW.statut = 'en_attente' AND OLD.statut = 'devis_envoye'`
- URL : `http://votre-api.com/api/sessions/{NEW.id}/send-convention`

**Webhook 2 : Envoi convocations**
- Table : `sessions_formation`
- Événement : `UPDATE`
- Condition : `NEW.statut = 'confirmee' AND OLD.statut = 'en_attente'`
- URL : `http://votre-api.com/api/sessions/{NEW.id}/send-convocations`

### 4.4 Vérifier les données de test

Optionnel : Charger des données de test :

```bash
psql -h votre-host -U postgres -d postgres -f supabase-sample-data.sql
```

---

## 5. Configuration des Services

### 5.1 Resend (Emails)

1. Créer un compte sur [resend.com](https://resend.com)
2. Créer une clé API
3. Ajouter la clé dans `.env` : `RESEND_API_KEY=re_xxx`
4. Vérifier votre domaine d'envoi

### 5.2 DocuSeal (Signatures)

1. Créer un compte sur [docuseal.co](https://docuseal.co)
2. Créer un template de convention
3. Récupérer l'API key et le template ID
4. Ajouter dans `.env` :
   ```env
   DOCUSEAL_API_KEY=xxx
   DOCUSEAL_TEMPLATE_ID=xxx
   ```

### 5.3 Webhook DocuSeal

Configurer un webhook DocuSeal pour notifier quand une convention est signée :

1. Dans DocuSeal, aller dans Settings > Webhooks
2. Ajouter l'URL : `http://votre-api.com/api/webhooks/docuseal`
3. Événement : `submission.completed`

Créer la route dans Express :

```javascript
// routes/webhooks.js
router.post('/webhooks/docuseal', async (req, res) => {
  const { submission_id, template_id, status } = req.body;
  
  if (status === 'completed') {
    // Mettre à jour la session
    await supabaseService.updateSession(sessionId, {
      statut: 'confirmee',
      convention_signee_le: new Date().toISOString()
    });
  }
  
  res.json({ success: true });
});
```

---

## 6. Démarrage

### 6.1 Démarrer le backend

Terminal 1 :
```bash
cd /Users/francois/Windsurf/Automate\ Formation
npm start
```

Le serveur démarre sur `http://localhost:3000`

### 6.2 Démarrer le frontend

Terminal 2 :
```bash
cd /Users/francois/Windsurf/Automate\ Formation/dashboard-client
npm run dev
```

Le dashboard est accessible sur `http://localhost:3001`

### 6.3 Vérifier que tout fonctionne

1. Ouvrir `http://localhost:3001`
2. Vérifier que les sessions s'affichent
3. Cliquer sur une session pour voir les détails
4. Tester les actions manuelles (devis)

---

## 7. Tests

### 7.1 Test du workflow complet

1. **Créer une session de test** :
   ```bash
   curl -X POST http://localhost:3000/api/sessions \
     -H "Content-Type: application/json" \
     -d '{
       "entreprise_id": "uuid-entreprise",
       "formation_catalogue_id": "uuid-formation",
       "date_debut": "2025-11-01",
       "date_fin": "2025-11-03",
       "statut": "demande"
     }'
   ```

2. **Marquer le devis comme envoyé** :
   - Aller dans le dashboard
   - Cliquer sur la session
   - Cliquer sur "Marquer comme envoyé"
   - Vérifier que le statut passe à `devis_envoye`

3. **Accepter le devis** :
   - Cliquer sur "Accepté"
   - Vérifier que le statut passe à `en_attente`
   - Vérifier dans les logs que la convention est envoyée

4. **Simuler la signature** :
   ```bash
   curl -X POST http://localhost:3000/api/webhooks/docuseal \
     -H "Content-Type: application/json" \
     -d '{
       "submission_id": "xxx",
       "status": "completed"
     }'
   ```
   - Vérifier que le statut passe à `confirmee`
   - Vérifier que les convocations sont envoyées

### 7.2 Test des emails

```bash
curl http://localhost:3000/api/test-email
```

---

## 8. Déploiement

### 8.1 Build du frontend

```bash
cd dashboard-client
npm run build
```

Les fichiers de production sont dans `dist/`

### 8.2 Servir le frontend depuis Express

Mettre à jour `index.js` :

```javascript
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dashboard-client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard-client/dist', 'index.html'));
  });
}
```

### 8.3 Variables d'environnement en production

Mettre à jour `.env` :

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://votre-projet-prod.supabase.co
SUPABASE_KEY=votre_cle_prod
RESEND_API_KEY=votre_cle_prod
```

### 8.4 Démarrer en production

```bash
npm start
```

L'application complète (API + Dashboard) est accessible sur `http://localhost:3000`

---

## 🎯 Checklist de Vérification

Avant de considérer l'installation comme terminée :

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Connexion à Supabase OK
- [ ] Les sessions s'affichent dans le dashboard
- [ ] Les actions manuelles fonctionnent (devis)
- [ ] Les triggers automatiques sont configurés
- [ ] Les emails Resend fonctionnent
- [ ] DocuSeal est configuré
- [ ] Les webhooks sont configurés
- [ ] Export CSV fonctionne

---

## 🐛 Problèmes Courants

### Le dashboard ne charge pas les données

**Cause** : Backend non démarré ou erreur de connexion Supabase

**Solution** :
```bash
# Vérifier que le backend tourne
curl http://localhost:3000/api/sessions

# Vérifier les logs
tail -f logs/app.log
```

### Erreur "Cannot read property 'map' of undefined"

**Cause** : Les données ne sont pas chargées correctement

**Solution** : Vérifier la console du navigateur et les appels API

### Les triggers ne se déclenchent pas

**Cause** : pg_net non installé ou webhooks non configurés

**Solution** : Utiliser les webhooks Supabase (voir section 4.3)

### Erreur CORS

**Cause** : Configuration CORS manquante

**Solution** : Vérifier que `cors()` est activé dans `index.js`

---

## 📞 Support

Pour toute question :
1. Consulter les logs : `tail -f logs/app.log`
2. Vérifier la console du navigateur (F12)
3. Consulter la documentation Supabase
4. Consulter la documentation Resend

---

## 🎉 Félicitations !

Votre dashboard ALADE Formation est maintenant opérationnel ! 🚀

Prochaines étapes :
1. Ajouter des données de test
2. Configurer l'authentification
3. Personnaliser les templates d'emails
4. Ajouter les fonctionnalités Phase 2
