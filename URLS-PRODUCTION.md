# 🌐 URLs de Production - Automate Formation

## 📋 Services Déployés

### 1. 🌍 Frontend Public (Formulaire de Demande)
**URL** : https://automate-formation-1.onrender.com

**Utilisation** :
- À partager aux **clients** et **entreprises**
- Permet de soumettre une demande de formation
- Interface publique, accessible à tous

**Contenu** :
- Formulaire de demande de formation
- Sélection de la formation dans le catalogue
- Informations entreprise et participants

---

### 2. 🎛️ Dashboard Admin (Gestion des Demandes)
**URL** : https://automate-formation-dashboard-5i7p.onrender.com

**Utilisation** :
- Interface **privée** pour vous uniquement
- Gestion complète des demandes de formation
- Suivi du workflow complet

**Fonctionnalités** :
- ✅ Vue d'ensemble de toutes les sessions
- ✅ Timeline complète du parcours formation
- ✅ Boutons d'actions :
  - "Marquer devis comme envoyé"
  - "Accepter" / "Refuser" le devis
- ✅ Liste des participants
- ✅ Liste des entreprises
- ✅ Statuts visuels pour chaque étape

---

### 3. 🔌 Backend API
**URL** : https://automate-formation.onrender.com

**Utilisation** :
- API REST pour les deux frontends
- Connexion à Supabase (base de données)
- Gestion des emails (Resend)

**Endpoints principaux** :
- `POST /api/demandes` - Créer une demande
- `GET /api/sessions` - Liste des sessions
- `GET /api/sessions/:id` - Détail d'une session
- `POST /api/sessions/:id/mark-devis-sent` - Marquer devis envoyé
- `POST /api/sessions/:id/devis-response` - Accepter/Refuser devis
- `GET /api/entreprises` - Liste des entreprises
- `GET /api/participants` - Liste des participants

---

## 🔐 Sécurité

### CORS Configuré
Le backend autorise uniquement :
- ✅ `https://automate-formation-1.onrender.com` (Frontend Public)
- ✅ `https://automate-formation-dashboard-5i7p.onrender.com` (Dashboard Admin)
- ✅ `http://localhost:3000` et `http://localhost:3001` (Développement local)

### RLS Supabase
- ✅ Activé sur toutes les tables
- ✅ Service role (backend) peut tout gérer
- ✅ Utilisateurs anonymes peuvent soumettre des demandes
- ✅ Accès public non autorisé bloqué

---

## 📊 Workflow Actuel

### Phase 1 : Demande (Automatisé ✅)
1. Client remplit le formulaire sur le **Frontend Public**
2. Données enregistrées dans Supabase
3. Statut : `demande`

### Phase 2 : Devis (Manuel ⚠️)
1. Vous recevez la notification (à implémenter)
2. Vous consultez la demande sur le **Dashboard Admin**
3. Vous envoyez le devis manuellement (Outlook)
4. Vous cliquez sur **"Marquer comme envoyé"**
5. Statut : `devis_envoye`
6. Client accepte/refuse → Vous cliquez sur **"Accepté"** ou **"Refusé"**
7. Statut : `en_attente` (si accepté) ou `annulee` (si refusé)

### Phase 3 : Convention (À implémenter 🔴)
- Génération automatique de la convention
- Envoi via Yousign pour signature électronique
- Statut : `confirmee` (après signature)

### Phase 4 : Convocations (À implémenter 🔴)
- Envoi automatique J-4
- Emails aux participants
- Statut : `convoquee`

---

## 🚀 Prochaines Étapes

### Priorité 1 : Emails de Confirmation
- [ ] Email au client après soumission du formulaire
- [ ] Email à vous (notification nouvelle demande)

### Priorité 2 : Workflow Devis
- [ ] Génération automatique du devis (PDF)
- [ ] Envoi automatique par email
- [ ] Bouton "Accepter" dans l'email client

### Priorité 3 : Convention & Signature
- [ ] Intégration Yousign
- [ ] Génération automatique de la convention
- [ ] Workflow de signature électronique

### Priorité 4 : Convocations
- [ ] Génération automatique des convocations
- [ ] Envoi automatique J-4
- [ ] Documents joints (règlement intérieur, CV formateur, etc.)

---

## 📝 Notes

- Tous les services sont sur **Render** (région Frankfurt)
- Base de données : **Supabase** (PostgreSQL)
- Emails : **Resend** (configuré mais pas encore utilisé)
- Déploiement automatique sur push `main`

---

**Dernière mise à jour** : 13 octobre 2025
