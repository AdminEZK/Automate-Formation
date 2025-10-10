# 🎓 Automate Formation

Système d'automatisation complet pour la gestion des formations professionnelles avec conformité Qualiopi.

## 🎯 Objectif

Automatiser le parcours complet d'une formation de A à Z :

```
Demande → Devis → Convention → Convocations → Formation → Évaluation → Certification
```

## 📦 Architecture

### Frontend
- **React + Vite** - Dashboard moderne et réactif
- **TailwindCSS** - Styling
- **Axios** - Communication API

### Backend
- **Node.js + Express** - API REST
- **Supabase (PostgreSQL)** - Base de données
- **Resend** - Envoi d'emails transactionnels
- **DocuSeal** - Signature électronique

### Automatisation
- **Windmill** - Workflows automatisés
- **Webhooks** - Intégrations tierces

---

## 🚀 Installation Rapide

### 1. Prérequis

```bash
- Node.js 18+
- PostgreSQL (via Supabase)
- Compte Resend (emails)
- Compte DocuSeal (signatures)
```

### 2. Installation Base de Données

**Exécutez le script SQL unique dans Supabase :**

```bash
# Copiez-collez le contenu dans l'éditeur SQL de Supabase
supabase-installation-complete.sql
```

Ce script crée :
- ✅ 11 tables (entreprises, sessions, documents, emails, etc.)
- ✅ 2 vues (statistiques, sessions enrichies)
- ✅ Triggers automatiques
- ✅ Index optimisés

### 3. Installation Backend

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés API

# Démarrer le serveur
npm start
```

Le backend démarre sur **http://localhost:3000**

### 4. Installation Frontend

```bash
cd dashboard-client

# Installer les dépendances
npm install

# Démarrer le dashboard
npm run dev
```

Le dashboard est accessible sur **http://localhost:3001**

### 5. Données de Test (Optionnel)

```bash
# Exécuter dans Supabase SQL Editor
supabase-donnees-test.sql
```

Crée 2 entreprises fictives avec 3 sessions de formation.

---

## 📁 Structure du Projet

```
Automate Formation/
├── 📄 supabase-installation-complete.sql  # ⭐ Script SQL unique
├── 📄 supabase-donnees-test.sql          # Données de test
├── 
├── 📂 services/                          # Services backend
│   ├── supabaseService.js               # Client Supabase
│   ├── emailService.js                  # Envoi emails (Resend)
│   └── documentService.js               # Génération PDF
├── 
├── 📂 routes/                            # Routes API Express
│   ├── sessionRoutes.js                 # CRUD sessions
│   └── documentRoutes.js                # Génération documents
├── 
├── 📂 dashboard-client/                  # Frontend React
│   ├── src/
│   │   ├── pages/                       # Pages du dashboard
│   │   ├── components/                  # Composants réutilisables
│   │   └── services/                    # API client
│   └── package.json
├── 
├── 📂 automation/                        # Scripts Python (Windmill)
│   ├── modules/
│   │   ├── generate_documents.py        # Génération PDF
│   │   ├── send_emails.py               # Envoi emails
│   │   └── create_request.py            # Création demandes
│   └── main.py
├── 
├── index.js                              # Point d'entrée backend
├── package.json
└── README-PRINCIPAL.md                   # Ce fichier
```

---

## 🗄️ Schéma de Base de Données

### Tables Principales

| Table | Description | Champs Clés |
|-------|-------------|-------------|
| **entreprises** | Clients | nom, email_contact, siret |
| **formations_catalogue** | Catalogue formations | titre, duree, prix_ht |
| **sessions_formation** | Sessions planifiées | statut, date_debut, nombre_participants |
| **participants** | Stagiaires | nom, prenom, email |

### Tables d'Automatisation

| Table | Description | Usage |
|-------|-------------|-------|
| **documents** | PDF générés | Devis, conventions, certificats |
| **emails_log** | Historique emails | Traçabilité Qualiopi |
| **actions_log** | Audit actions | Conformité RGPD |
| **evaluations** | Évaluations | À chaud, à froid, client |
| **emargements** | Feuilles présence | Signatures numériques |
| **notifications_queue** | File d'attente | Envois asynchrones |
| **templates** | Modèles | Documents et emails |

### Workflow des Statuts

```
demande 
  ↓
devis_envoye (action manuelle: "Envoyer le devis")
  ↓
en_attente (client accepte le devis)
  ↓
confirmee (convention signée via DocuSeal)
  ↓
convoquee (convocations envoyées)
  ↓
en_cours (formation en cours)
  ↓
terminee (formation terminée)
  ↓
archivee (dossier archivé)

À tout moment → annulee (annulation)
```

---

## 🔌 API Backend

### Sessions

```bash
GET    /api/sessions              # Liste toutes les sessions
GET    /api/sessions/:id          # Détails d'une session
POST   /api/sessions              # Créer une session
PUT    /api/sessions/:id          # Modifier une session
DELETE /api/sessions/:id          # Supprimer une session
```

### Actions Manuelles

```bash
POST   /api/sessions/:id/envoyer-devis      # Envoyer le devis
POST   /api/sessions/:id/accepter-devis     # Marquer devis accepté
POST   /api/sessions/:id/refuser-devis      # Marquer devis refusé
POST   /api/sessions/:id/signer-convention  # Envoyer convention DocuSeal
POST   /api/sessions/:id/envoyer-convocations # Envoyer convocations
```

### Documents

```bash
GET    /api/documents/:sessionId            # Liste documents d'une session
POST   /api/documents/generate              # Générer un document
```

### Entreprises

```bash
GET    /api/entreprises                     # Liste entreprises
POST   /api/entreprises                     # Créer entreprise
```

---

## 🎨 Dashboard

### Pages Disponibles

1. **Dashboard Principal** (`/`)
   - Vue d'ensemble des sessions
   - Statistiques en temps réel
   - Actions rapides

2. **Détail Session** (`/session/:id`)
   - Informations complètes
   - Timeline du workflow
   - Actions manuelles (envoyer devis, etc.)
   - Liste des participants
   - Documents générés

3. **Entreprises** (`/entreprises`)
   - Liste des clients
   - Historique des sessions
   - Informations de contact

### Fonctionnalités

- ✅ Filtrage par statut
- ✅ Recherche par entreprise
- ✅ Actions en un clic
- ✅ Mise à jour en temps réel
- ✅ Responsive design

---

## 📧 Configuration Emails (Resend)

### 1. Créer un compte Resend

https://resend.com

### 2. Obtenir la clé API

Dashboard → API Keys → Create API Key

### 3. Configurer `.env`

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=formation@votre-domaine.fr
```

### 4. Types d'emails automatiques

- Convocations aux participants
- Confirmations de session
- Rappels avant formation
- Demandes d'évaluation
- Envoi de certificats

---

## ✍️ Configuration Signatures (DocuSeal)

### 1. Créer un compte DocuSeal

https://www.docuseal.co

### 2. Obtenir la clé API

Settings → API Keys

### 3. Configurer `.env`

```bash
DOCUSEAL_API_KEY=ds_xxxxxxxxxxxxx
DOCUSEAL_TEMPLATE_ID=template_xxxxx
```

### 4. Workflow de signature

1. Génération de la convention (PDF)
2. Envoi via DocuSeal
3. Notification au client
4. Signature électronique
5. Récupération du document signé
6. Mise à jour du statut → `confirmee`

---

## 🔧 Variables d'Environnement

Créez un fichier `.env` à la racine :

```bash
# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend (Emails)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=formation@votre-domaine.fr

# DocuSeal (Signatures)
DOCUSEAL_API_KEY=ds_xxxxxxxxxxxxx
DOCUSEAL_TEMPLATE_ID=template_xxxxx

# Backend
PORT=3000
NODE_ENV=development
```

---

## 🧪 Tests

### Tester l'API

```bash
# Lister les sessions
curl http://localhost:3000/api/sessions

# Créer une session
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"entreprise_id": "...", "formation_catalogue_id": "..."}'

# Envoyer un devis
curl -X POST http://localhost:3000/api/sessions/SESSION_ID/envoyer-devis
```

### Tester les emails

```bash
node examples/testResend.js
```

---

## 📚 Documentation Complémentaire

- **[GUIDE-INSTALLATION-DASHBOARD.md](./GUIDE-INSTALLATION-DASHBOARD.md)** - Installation détaillée du dashboard
- **[INTEGRATION-DOCUSEAL.md](./INTEGRATION-DOCUSEAL.md)** - Intégration signatures électroniques
- **[INTEGRATION-YOUSIGN.md](./INTEGRATION-YOUSIGN.md)** - Alternative YouSign
- **[QUALIOPI-conformite.md](./QUALIOPI-conformite.md)** - Conformité Qualiopi
- **[PLAN-TEMPLATES-QUALIOPI.md](./PLAN-TEMPLATES-QUALIOPI.md)** - Templates de documents

---

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier les dépendances
npm install

# Vérifier le fichier .env
cat .env

# Vérifier la connexion Supabase
curl $SUPABASE_URL/rest/v1/
```

### Le dashboard ne se connecte pas

```bash
# Vérifier que le backend tourne
curl http://localhost:3000/api/sessions

# Vérifier la configuration dans dashboard-client/.env
VITE_API_URL=http://localhost:3000
```

### Les emails ne partent pas

```bash
# Tester la clé Resend
curl https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from": "test@resend.dev", "to": "votre@email.fr", "subject": "Test", "text": "Test"}'
```

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit les changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

---

## 📝 Licence

Ce projet est sous licence MIT.

---

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation dans `/docs`
- Contacter l'équipe de développement

---

## 🎉 Remerciements

- **Supabase** - Base de données
- **Resend** - Service d'emails
- **DocuSeal** - Signatures électroniques
- **React** - Framework frontend
- **Express** - Framework backend

---

**Version:** 1.0.0  
**Dernière mise à jour:** 2025-10-08
