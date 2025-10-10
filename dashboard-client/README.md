# 📊 Dashboard ALADE Formation - Interface de Suivi

Dashboard React moderne pour le suivi et la gestion des sessions de formation avec workflow automatisé.

## 🎯 Fonctionnalités

### 📋 Dashboard Principal
- Vue d'ensemble de toutes les sessions
- Filtres par statut (actives, en attente, annulées)
- Recherche par entreprise ou formation
- Statuts visuels pour chaque étape du workflow

### 📄 Page Session Détaillée
- **Timeline complète** : Avant / Pendant / Après la formation
- **Actions manuelles** :
  - Marquer le devis comme envoyé
  - Accepter/Refuser le devis
- **Liste des participants** avec leurs statuts
- **Automatisation** : Convention et convocations envoyées automatiquement

### 🏢 Page Entreprises
- Liste de tous les clients
- Historique des formations par entreprise
- Export CSV des informations client

## 🚀 Installation

### Prérequis
- Node.js 18+ et npm
- Backend Express en cours d'exécution (port 3000)
- Supabase configuré

### 1. Installation des dépendances

```bash
cd dashboard-client
npm install
```

### 2. Configuration

Le proxy vers l'API backend est déjà configuré dans `vite.config.js` :
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

### 3. Démarrage en développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3001`

### 4. Build pour la production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

## 📦 Structure du Projet

```
dashboard-client/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx          # Composant bouton réutilisable
│   │   │   ├── Card.jsx            # Composant carte
│   │   │   └── StatusBadge.jsx     # Badges de statut
│   │   └── SessionCard.jsx         # Carte de session pour le dashboard
│   ├── pages/
│   │   ├── Dashboard.jsx           # Page principale
│   │   ├── SessionDetail.jsx       # Détail d'une session
│   │   └── Entreprises.jsx         # Liste des entreprises
│   ├── lib/
│   │   ├── api.js                  # Client API Axios
│   │   └── utils.js                # Fonctions utilitaires
│   ├── App.jsx                     # Composant principal
│   ├── main.jsx                    # Point d'entrée
│   └── index.css                   # Styles globaux
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔄 Workflow de Formation

### 1️⃣ AVANT LA FORMATION

#### Demande reçue
- Statut initial : `demande`
- Session créée automatiquement

#### Devis
- **Action manuelle** : Clic sur "Marquer comme envoyé"
- Statut : `demande` → `devis_envoye`
- Le devis est envoyé manuellement via Outlook

#### Réponse au devis
- **Action manuelle** : Clic sur "Accepté" ou "Refusé"
- Si accepté : `devis_envoye` → `en_attente`
- Si refusé : `devis_envoye` → `annulee`

#### Convention
- **Automatique** : Envoi via DocuSeal après acceptation
- Statut : `en_attente` (en attente de signature)
- Webhook DocuSeal : `en_attente` → `confirmee` (après signature)

#### Convocations
- **Automatique** : Envoi après signature de la convention
- Trigger Supabase : `confirmee` → `convoquee`
- Emails envoyés à tous les participants via Resend

### 2️⃣ PENDANT LA FORMATION
- Émargements (à implémenter)
- Évaluation à chaud (à implémenter)

### 3️⃣ APRÈS LA FORMATION
- Évaluation à froid J+30 (à implémenter)
- Certificats de réalisation (à implémenter)
- Dossier Qualiopi finalisé (à implémenter)

## 🎨 Technologies Utilisées

### Frontend
- **React 18** - Framework UI
- **React Router 6** - Routing
- **TailwindCSS** - Styling
- **Lucide React** - Icônes
- **Axios** - Client HTTP
- **date-fns** - Manipulation de dates
- **Vite** - Build tool

### Backend (API)
- **Express.js** - Serveur API
- **Supabase** - Base de données PostgreSQL
- **Resend** - Envoi d'emails
- **DocuSeal** - Signature électronique

## 🔌 API Endpoints

### Sessions
```
GET    /api/sessions              # Liste des sessions
GET    /api/sessions/:id          # Détail d'une session
POST   /api/sessions/:id/mark-devis-sent    # Marquer devis envoyé
POST   /api/sessions/:id/devis-response     # Accepter/Refuser devis
POST   /api/sessions/:id/send-convention    # Envoyer convention
POST   /api/sessions/:id/send-convocations  # Envoyer convocations
```

### Participants
```
GET    /api/participants                    # Tous les participants
GET    /api/participants/session/:id        # Participants d'une session
```

### Entreprises
```
GET    /api/entreprises                     # Liste des entreprises
GET    /api/entreprises/:id                 # Détail entreprise
GET    /api/entreprises/:id/sessions        # Sessions d'une entreprise
GET    /api/entreprises/:id/export-csv      # Export CSV
```

## 🎯 Statuts des Sessions

| Statut | Description | Actions disponibles |
|--------|-------------|---------------------|
| `demande` | Demande reçue | Marquer devis envoyé |
| `devis_envoye` | Devis envoyé | Accepter/Refuser |
| `en_attente` | Convention en attente | Automatique (DocuSeal) |
| `confirmee` | Convention signée | Automatique (Convocations) |
| `convoquee` | Convocations envoyées | - |
| `en_cours` | Formation en cours | - |
| `terminee` | Formation terminée | - |
| `annulee` | Demande annulée | - |

## 🔒 Sécurité

- Authentification à implémenter (Supabase Auth)
- RLS (Row Level Security) sur Supabase
- Validation des données côté serveur
- CORS configuré sur l'API

## 📝 Prochaines Étapes

### Phase 1 (MVP) - ✅ Complété
- [x] Dashboard avec liste des sessions
- [x] Page détail session avec timeline
- [x] Actions manuelles (devis)
- [x] Liste des participants
- [x] Page entreprises avec export CSV

### Phase 2 - À venir
- [ ] Authentification utilisateur
- [ ] Gestion des émargements
- [ ] Évaluations (à chaud, à froid)
- [ ] Génération automatique des certificats
- [ ] Notifications en temps réel
- [ ] Dashboard de statistiques avancé

## 🐛 Dépannage

### Le dashboard ne charge pas les données
1. Vérifier que le backend Express est démarré sur le port 3000
2. Vérifier la connexion à Supabase
3. Consulter la console du navigateur pour les erreurs

### Les actions ne fonctionnent pas
1. Vérifier que les routes API sont bien configurées
2. Vérifier les logs du serveur Express
3. Vérifier que le schéma BDD est à jour

### Erreur CORS
1. Vérifier que CORS est activé dans `index.js` du backend
2. Vérifier la configuration du proxy dans `vite.config.js`

## 📞 Support

Pour toute question ou problème, consultez la documentation complète dans le dossier racine du projet.

## 📄 Licence

Propriétaire - ALADE Formation
