# 📚 Index de la Documentation

Guide complet pour naviguer dans la documentation du projet Automate Formation.

---

## 🚀 Démarrage Rapide

**Nouveau sur le projet ? Commencez ici :**

1. **[README-PRINCIPAL.md](./README-PRINCIPAL.md)** - Vue d'ensemble complète du projet
2. **[GUIDE-INSTALLATION-RAPIDE.md](./GUIDE-INSTALLATION-RAPIDE.md)** - Installation en 5 étapes (15 min)
3. **[FICHIERS-SQL-GUIDE.md](./FICHIERS-SQL-GUIDE.md)** - Guide des fichiers SQL à utiliser

---

## 📁 Fichiers SQL

### À Utiliser

| Fichier | Description | Priorité |
|---------|-------------|----------|
| **[supabase-installation-complete.sql](./supabase-installation-complete.sql)** | Installation complète de la BDD | ⭐⭐⭐ |
| **[supabase-donnees-test.sql](./supabase-donnees-test.sql)** | Données de test | ⭐⭐ |
| [config-organisme-alade.sql](./config-organisme-alade.sql) | Configuration organisme | ⭐ |
| [scenario-client-complet.sql](./scenario-client-complet.sql) | Scénario de test complet | ⭐ |

### Obsolètes (Ne Plus Utiliser)

- ~~supabase-tables.sql~~
- ~~supabase-schema-update-workflow.sql~~
- ~~supabase-tables-dashboard-automation.sql~~
- ~~supabase-tables-only.sql~~
- ~~supabase-drop-vues.sql~~

---

## 📖 Documentation Principale

### Installation & Configuration

| Document | Contenu | Pour Qui ? |
|----------|---------|-----------|
| **[README-PRINCIPAL.md](./README-PRINCIPAL.md)** | Documentation complète | Tous |
| **[GUIDE-INSTALLATION-RAPIDE.md](./GUIDE-INSTALLATION-RAPIDE.md)** | Installation pas à pas | Débutants |
| **[GUIDE-INSTALLATION-DASHBOARD.md](./GUIDE-INSTALLATION-DASHBOARD.md)** | Installation détaillée du dashboard | Développeurs |
| **[FICHIERS-SQL-GUIDE.md](./FICHIERS-SQL-GUIDE.md)** | Guide des fichiers SQL | Tous |

### Intégrations Externes

| Document | Contenu | Service |
|----------|---------|---------|
| **[INTEGRATION-DOCUSEAL.md](./INTEGRATION-DOCUSEAL.md)** | Signatures électroniques | DocuSeal |
| **[INTEGRATION-YOUSIGN.md](./INTEGRATION-YOUSIGN.md)** | Alternative signatures | YouSign |

### Conformité & Templates

| Document | Contenu | Thème |
|----------|---------|-------|
| **[QUALIOPI-conformite.md](./QUALIOPI-conformite.md)** | Conformité Qualiopi | Certification |
| **[PLAN-TEMPLATES-QUALIOPI.md](./PLAN-TEMPLATES-QUALIOPI.md)** | Templates de documents | Documents |

### Spécifications Techniques

| Document | Contenu | Audience |
|----------|---------|----------|
| **[PRD-PARCOURS-CLIENT-AUTOMATISE.md](./PRD-PARCOURS-CLIENT-AUTOMATISE.md)** | Product Requirements | Product Managers |
| **[MVP-SCOPE.md](./MVP-SCOPE.md)** | Scope du MVP | Équipe projet |
| **[INTERFACE-EXPORT.md](./INTERFACE-EXPORT.md)** | Interface d'export | Développeurs |
| **[RECAPITULATIF_PROJET.md](./RECAPITULATIF_PROJET.md)** | Récapitulatif technique | Tous |

### Autres

| Document | Contenu |
|----------|---------|
| **[README-supabase.md](./README-supabase.md)** | Configuration Supabase |
| **[README.md](./README.md)** | README original (obsolète) |

---

## 🗂️ Structure du Code

### Backend (Node.js + Express)

```
/
├── index.js                    # Point d'entrée
├── services/
│   ├── supabaseService.js     # Client Supabase
│   ├── emailService.js        # Envoi emails (Resend)
│   └── documentService.js     # Génération PDF
├── routes/
│   ├── sessionRoutes.js       # API sessions
│   ├── formationRoutes.js     # API formations
│   └── documentRoutes.js      # API documents
└── package.json
```

### Frontend (React + Vite)

```
dashboard-client/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx      # Page principale
│   │   ├── SessionDetail.jsx  # Détail session
│   │   └── Entreprises.jsx    # Liste entreprises
│   ├── components/
│   │   ├── SessionCard.jsx    # Carte session
│   │   ├── StatCard.jsx       # Carte statistique
│   │   └── Timeline.jsx       # Timeline workflow
│   ├── services/
│   │   └── api.js             # Client API
│   └── App.jsx
└── package.json
```

### Automatisation (Python + Windmill)

```
automation/
├── modules/
│   ├── generate_documents.py  # Génération PDF
│   ├── send_emails.py         # Envoi emails
│   ├── create_request.py      # Création demandes
│   └── list_sessions.py       # Liste sessions
└── main.py
```

---

## 🎯 Parcours par Profil

### Je suis Développeur Backend

1. [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Architecture
2. [GUIDE-INSTALLATION-RAPIDE.md](./GUIDE-INSTALLATION-RAPIDE.md) - Installation
3. [supabase-installation-complete.sql](./supabase-installation-complete.sql) - BDD
4. `/services` - Services backend
5. `/routes` - Routes API

### Je suis Développeur Frontend

1. [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Vue d'ensemble
2. [GUIDE-INSTALLATION-DASHBOARD.md](./GUIDE-INSTALLATION-DASHBOARD.md) - Dashboard
3. `/dashboard-client/src` - Code React
4. API Documentation dans README-PRINCIPAL.md

### Je suis Product Manager

1. [PRD-PARCOURS-CLIENT-AUTOMATISE.md](./PRD-PARCOURS-CLIENT-AUTOMATISE.md) - PRD
2. [MVP-SCOPE.md](./MVP-SCOPE.md) - Scope MVP
3. [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Fonctionnalités
4. [QUALIOPI-conformite.md](./QUALIOPI-conformite.md) - Conformité

### Je suis DevOps

1. [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Stack technique
2. [GUIDE-INSTALLATION-RAPIDE.md](./GUIDE-INSTALLATION-RAPIDE.md) - Installation
3. `.env.example` - Variables d'environnement
4. `docker-compose.yml` - Configuration Docker

### Je suis Utilisateur Final

1. [GUIDE-INSTALLATION-RAPIDE.md](./GUIDE-INSTALLATION-RAPIDE.md) - Installation
2. [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Utilisation du dashboard
3. Documentation des workflows dans README-PRINCIPAL.md

---

## 🔍 Recherche par Sujet

### Base de Données

- [supabase-installation-complete.sql](./supabase-installation-complete.sql) - Script complet
- [FICHIERS-SQL-GUIDE.md](./FICHIERS-SQL-GUIDE.md) - Guide des fichiers
- [README-supabase.md](./README-supabase.md) - Configuration Supabase
- [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Schéma de BDD

### Emails

- [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Configuration Resend
- `/services/emailService.js` - Service emails
- `/examples/testResend.js` - Test emails

### Signatures Électroniques

- [INTEGRATION-DOCUSEAL.md](./INTEGRATION-DOCUSEAL.md) - DocuSeal
- [INTEGRATION-YOUSIGN.md](./INTEGRATION-YOUSIGN.md) - YouSign

### Documents PDF

- [PLAN-TEMPLATES-QUALIOPI.md](./PLAN-TEMPLATES-QUALIOPI.md) - Templates
- `/services/documentService.js` - Génération PDF
- `/automation/modules/generate_documents.py` - Génération Python

### Workflow & Statuts

- [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Workflow complet
- [PRD-PARCOURS-CLIENT-AUTOMATISE.md](./PRD-PARCOURS-CLIENT-AUTOMATISE.md) - Parcours client

### Conformité Qualiopi

- [QUALIOPI-conformite.md](./QUALIOPI-conformite.md) - Conformité
- [PLAN-TEMPLATES-QUALIOPI.md](./PLAN-TEMPLATES-QUALIOPI.md) - Templates
- Tables BDD : `documents`, `emails_log`, `actions_log`, `emargements`

---

## 📞 Aide & Support

### Problèmes d'Installation

1. Consultez [GUIDE-INSTALLATION-RAPIDE.md](./GUIDE-INSTALLATION-RAPIDE.md) - Section "Problèmes Courants"
2. Vérifiez [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Section "Dépannage"

### Questions sur l'Architecture

1. [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Architecture complète
2. [RECAPITULATIF_PROJET.md](./RECAPITULATIF_PROJET.md) - Récapitulatif technique

### Questions sur les Fonctionnalités

1. [PRD-PARCOURS-CLIENT-AUTOMATISE.md](./PRD-PARCOURS-CLIENT-AUTOMATISE.md) - Spécifications
2. [MVP-SCOPE.md](./MVP-SCOPE.md) - Fonctionnalités MVP

---

## 🎓 Tutoriels

### Créer une Nouvelle Session

Voir [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Section "Dashboard"

### Envoyer un Devis

Voir [GUIDE-INSTALLATION-DASHBOARD.md](./GUIDE-INSTALLATION-DASHBOARD.md) - Section "Actions Manuelles"

### Générer un Document

Voir [PLAN-TEMPLATES-QUALIOPI.md](./PLAN-TEMPLATES-QUALIOPI.md)

### Configurer les Emails

Voir [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Section "Configuration Emails"

---

## 📊 Diagrammes & Schémas

### Workflow des Statuts

Voir [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Section "Workflow des Statuts"

### Schéma de Base de Données

Voir [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Section "Schéma de Base de Données"

### Architecture Système

Voir [README-PRINCIPAL.md](./README-PRINCIPAL.md) - Section "Architecture"

---

## 🔄 Mises à Jour

**Dernière mise à jour :** 2025-10-08

**Fichiers récemment ajoutés :**
- ✅ `supabase-installation-complete.sql` - Script SQL unifié
- ✅ `README-PRINCIPAL.md` - Documentation complète
- ✅ `GUIDE-INSTALLATION-RAPIDE.md` - Guide d'installation
- ✅ `FICHIERS-SQL-GUIDE.md` - Guide des fichiers SQL
- ✅ `INDEX-DOCUMENTATION.md` - Ce fichier

**Fichiers obsolètes :**
- ❌ Anciens fichiers SQL fragmentés (voir FICHIERS-SQL-GUIDE.md)

---

## 📝 Contribuer à la Documentation

Pour améliorer la documentation :

1. Identifiez le document à modifier
2. Créez une branche : `git checkout -b doc/amelioration`
3. Modifiez le document
4. Commit : `git commit -m "docs: amélioration de X"`
5. Push : `git push origin doc/amelioration`
6. Ouvrez une Pull Request

---

**Navigation Rapide :**
- 🏠 [Retour au README Principal](./README-PRINCIPAL.md)
- 🚀 [Guide d'Installation Rapide](./GUIDE-INSTALLATION-RAPIDE.md)
- 📁 [Guide des Fichiers SQL](./FICHIERS-SQL-GUIDE.md)
