# 🚀 Prochaines Étapes du Projet - Automate Formation

**Basé sur le PRD - Parcours Client Automatisé**

---

## 🔴 **ÉTAPE IMMÉDIATE : Appliquer les changements actuels**

### 1. Migration de la base de données
```bash
# Dans l'interface Supabase SQL Editor, exécuter dans l'ordre :
```

**a) Vérifier/Ajouter la colonne modalite :**
```sql
-- Fichier: fix-formation-nullable.sql
ALTER TABLE sessions_formation 
ADD COLUMN IF NOT EXISTS modalite TEXT DEFAULT 'presentiel';
```

**b) Mettre à jour la vue :**
```sql
-- Fichier: update-vue-sessions-modalite.sql
-- Copier et exécuter tout le contenu
```

### 2. Tester le dashboard
```bash
cd dashboard-client
npm run dev
```
- Vérifier l'affichage : `Session AC2025 N°ABC123 - Formation`
- Vérifier la modalité (Présentiel/Distanciel/Mixte)

### 3. Rendre le dashboard utilisable aujourd'hui

- [ ] **Vérifier que les données sont bien en base**
  - Dans Supabase, contrôler les tables `entreprises`, `sessions_formation` et `participants` après l'envoi d'un formulaire.
  - Vérifier que la vue `vue_sessions_formation` contient bien les nouvelles lignes (colonnes `entreprise_id`, `statut`, `session_created_at`).

- [ ] **Vérifier l'API backend pour les demandes/sessions**
  - Tester `GET /api/demandes` (vue `vue_sessions_formation` filtrée sur `statut = 'demande'`).
  - Tester `GET /api/entreprises` et `GET /api/entreprises/:id/sessions`.
  - Confirmer que la réponse JSON contient les nouvelles demandes tout de suite après un formulaire.

- [ ] **Vérifier la lecture côté dashboard React**
  - Identifier la page/listing qui affiche les demandes/sessions.
  - Vérifier qu'elle appelle bien l'endpoint `/api/demandes` ou `/api/sessions` (via `sessionsApi` / `entreprisesApi`).
  - S'assurer qu'il n'y a pas de filtre bloquant (par exemple un `statut` incorrect ou un tri sur une mauvaise colonne).

- [ ] **Valider le cycle complet visible**
  - Envoyer une nouvelle demande via le formulaire public.
  - Confirmer :
    - l'entreprise est créée/maj dans `entreprises`,
    - la session est créée avec `statut = 'demande'` dans `sessions_formation` / `vue_sessions_formation`,
    - la demande apparaît dans le dashboard sans recharger le backend.

---

## 📋 **PARCOURS CLIENT COMPLET (selon PRD)**

### **PHASE 1 : DÉCOUVERTE & DEMANDE** ✅ (Jour J)
**Statut : FAIT**

- ✅ Formulaire de demande 3 étapes
- ✅ Création automatique session (statut: `demande`)
- ✅ Ajout entreprise + participants
- ✅ Apparition dans dashboard

**À améliorer :**
- [ ] Email de confirmation automatique au client
- [ ] Email de notification à l'organisme

---

### **PHASE 2 : PROPOSITION COMMERCIALE** 🟡 (J+1)
**Statut : EN COURS**

**Workflow actuel (manuel) :**
1. OF reçoit notification → Dashboard
2. OF valide la demande
3. **OF génère proposition manuellement** (Word/Excel)
4. **OF génère programme manuellement**
5. OF envoie par email manuellement

**À automatiser :**
- [ ] Bouton "Générer proposition" dans le dashboard
- [ ] Template de proposition pré-rempli (PDF)
- [ ] Template de programme de formation (PDF)
- [ ] Envoi automatique par email via Resend
- [ ] Tracking d'ouverture des emails
- [ ] Bouton "Accepter" dans l'email client
- [ ] Changement statut : `demande` → `en_attente` → `devis_envoye` → (`en_attente` si accepté) → `confirmee` (ou `annulee` si refusé)

**Documents à générer :**
- Proposition de formation (remplace le "devis")
- Programme de formation détaillé

**Fichiers concernés :**
- `services/documentGenerator.py`
- `templates/qualiopi/` (créer templates)
- `routes/sessionRoutes.js` (ajouter endpoints)

---

### **PHASE 3 : CONTRACTUALISATION** 🔴 (J+3)
**Statut : À FAIRE**

**Objectif :** Signature électronique de la convention

**Actions :**
- [ ] Créer template de convention de formation
- [ ] Intégrer Yousign API
- [ ] Générer convention avec données session
- [ ] Envoyer via Yousign pour signature
- [ ] Webhook de retour après signature
- [ ] Stocker convention signée dans Supabase Storage
- [ ] Changement statut : `confirmee`

**Intégrations :**
- Yousign (signature électronique)
- Supabase Storage (archivage)

**Documentation :**
- `INTEGRATION-YOUSIGN.md`

---

### **PHASE 4 : PRÉPARATION** 🔴 (J-7)
**Statut : À FAIRE**

**Objectif :** Questionnaire préalable aux participants

**Actions :**
- [ ] Créer template questionnaire préalable
- [ ] Workflow automatique J-7 (Windmill cron)
- [ ] Générer questionnaire par participant
- [ ] Envoyer par email via Resend
- [ ] Formulaire en ligne pour réponses
- [ ] Enregistrer réponses dans table `evaluations`

**Documents :**
- Questionnaire préalable à la formation

---

### **PHASE 5 : CONVOCATION** 🔴 (J-4)
**Statut : À FAIRE**

**Objectif :** Convoquer les participants

**Actions :**
- [ ] Créer template convocation personnalisée
- [ ] Générer règlement intérieur (PDF)
- [ ] Générer CV formateur (PDF)
- [ ] Générer planning détaillé (PDF)
- [ ] Générer feuilles d'émargement
- [ ] Workflow automatique J-4 (Windmill cron)
- [ ] Envoyer email avec 4 pièces jointes
- [ ] Bouton "Ajouter au calendrier"
- [ ] Changement statut : `confirmee` → `convoquee`

**Documents :**
- Convocation personnalisée (N participants)
- Règlement intérieur (1)
- CV du formateur (1)
- Planning détaillé (1)
- Feuilles d'émargement (N+1)

---

### **PHASE 6 : FORMATION** 🔴 (Jour J)
**Statut : À FAIRE**

**Objectif :** Gestion pendant la formation

**Actions :**
- [ ] Interface upload feuilles d'émargement signées
- [ ] Stockage dans Supabase Storage
- [ ] Enregistrement dans table `emargements`
- [ ] Option signature tablette/QR code (futur)

---

### **PHASE 7 : ÉVALUATION À CHAUD** 🔴 (Fin Jour J)
**Statut : À FAIRE**

**Objectif :** Évaluation immédiate de la formation

**Actions :**
- [ ] Créer template évaluation à chaud
- [ ] Workflow automatique fin de formation
- [ ] Formulaire en ligne (5 min)
- [ ] Enregistrer dans table `evaluations`
- [ ] Dashboard résultats temps réel

**Données collectées :**
- Satisfaction globale (note /5)
- Atteinte des objectifs
- Qualité formateur
- Qualité supports
- Commentaires

---

### **PHASE 8 : BILAN FORMATEUR** 🔴 (J+1)
**Statut : À FAIRE**

**Objectif :** Retour du formateur

**Actions :**
- [ ] Créer questionnaire formateur
- [ ] Workflow automatique J+1
- [ ] Envoyer email au formateur
- [ ] Enregistrer réponses
- [ ] Changement statut : `convoquee` → `terminee`

---

### **PHASE 9 : CERTIFICAT & CLÔTURE** 🔴 (J+2)
**Statut : À FAIRE**

**Objectif :** Certificats de réalisation

**Actions :**
- [ ] Créer template certificat de réalisation
- [ ] Workflow automatique J+2
- [ ] Générer certificat par participant
- [ ] Envoyer par email
- [ ] Bouton partage LinkedIn
- [ ] Créer évaluation satisfaction client
- [ ] Envoyer au responsable RH

**Documents :**
- Certificat de réalisation (N participants)
- Évaluation satisfaction client (1)

---

### **PHASE 10 : ÉVALUATION À FROID** 🔴 (J+60)
**Statut : À FAIRE**

**Objectif :** Impact de la formation après 2 mois

**Actions :**
- [ ] Créer template évaluation à froid
- [ ] Workflow automatique J+60 (Windmill cron)
- [ ] Envoyer aux participants
- [ ] Enregistrer réponses

**Données collectées :**
- Mise en pratique
- Impact sur le travail
- Besoin de complément
- Recommandation (NPS)

---

### **PHASE 11 : ÉVALUATION OPCO** 🔴 (Si financement)
**Statut : À FAIRE**

**Objectif :** Dossier complet pour l'OPCO

**Actions :**
- [ ] Créer template évaluation OPCO
- [ ] Générer dossier complet (ZIP)
- [ ] Envoyer à l'OPCO par email
- [ ] Suivi validation financement

**Documents inclus :**
- Convention signée
- Programme
- Feuilles d'émargement
- Certificats
- Évaluations

---

### **PHASE 12 : ARCHIVAGE** 🔴 (J+90)
**Statut : À FAIRE**

**Objectif :** Conformité Qualiopi (conservation 3 ans)

**Actions :**
- [ ] Workflow automatique J+90
- [ ] Vérifier complétude du dossier
- [ ] Changement statut : `terminee` → `archivee`
- [ ] Conservation Supabase Storage (3 ans)
- [ ] Indexation pour recherche

---

## 🎯 **PRIORITÉS RECOMMANDÉES**

### **Sprint 1 : Proposition Commerciale** (1-2 semaines)
**Objectif :** Automatiser la génération et l'envoi de la proposition

1. [ ] Créer template proposition de formation (PDF)
2. [ ] Créer template programme de formation (PDF)
3. [ ] Ajouter bouton "Générer proposition" dans dashboard
4. [ ] Intégrer génération PDF (Python)
5. [ ] Configurer envoi email via Resend
6. [ ] Ajouter bouton "Accepter" dans email client
7. [ ] Gérer changements de statut

**Fichiers à créer/modifier :**
- `templates/qualiopi/proposition_formation.docx`
- `templates/qualiopi/programme_formation.docx`
- `services/documentGenerator.py` (enrichir)
- `routes/sessionRoutes.js` (nouveaux endpoints)
- `dashboard-client/src/pages/SessionDetail.jsx` (bouton)

---

### **Sprint 2 : Signature Convention** (1 semaine)
**Objectif :** Intégrer Yousign pour la signature électronique

1. [ ] Créer compte Yousign
2. [ ] Créer template convention de formation
3. [ ] Intégrer API Yousign
4. [ ] Configurer webhook de retour
5. [ ] Tester le cycle complet

**Documentation :**
- Suivre `INTEGRATION-YOUSIGN.md`

---

### **Sprint 3 : Convocations** (1 semaine)
**Objectif :** Automatiser l'envoi des convocations J-4

1. [ ] Créer templates (convocation, règlement, CV, planning)
2. [ ] Créer workflow Windmill J-4
3. [ ] Générer feuilles d'émargement
4. [ ] Tester envoi emails avec PJ

---

### **Sprint 4 : Évaluations & Certificats** (1-2 semaines)
**Objectif :** Boucler le cycle complet

1. [ ] Formulaires évaluation (à chaud, à froid)
2. [ ] Template certificat de réalisation
3. [ ] Workflows automatiques
4. [ ] Dashboard résultats

---

## 📊 **DOCUMENTS À CRÉER (19 types)**

### Priorité P0 (Critique)
1. ✅ ~~Devis~~ → **Proposition de formation**
2. ✅ Convention de formation
3. ✅ Programme de formation
4. ✅ Convocation
5. ✅ Certificat de réalisation

### Priorité P1 (Important)
6. ✅ Feuille émargement entreprise
7. ✅ Feuille émargement individuelle
8. ✅ Évaluation à chaud
9. ✅ Règlement intérieur

### Priorité P2 (Utile)
10. ✅ Questionnaire préalable
11. ✅ Évaluation à froid
12. ✅ Évaluation satisfaction client
13. ✅ CV formateur

### Priorité P3 (Optionnel)
14. Bulletin d'inscription
15. Grille MAJ compétences
16. Évaluation OPCO
17. Déroulé pédagogique
18. Questionnaire formateur
19. Contrat formateur

---

## 🔧 **STACK TECHNIQUE**

### Déjà en place
- ✅ Supabase (base de données)
- ✅ React Dashboard
- ✅ Express.js API
- ✅ Formulaire de demande

### À configurer
- [ ] **Resend** (emails) - Clé API dans .env
- [ ] **Yousign** (signatures) - Compte + API
- [ ] **Windmill** (automatisation) - Workflows cron
- [ ] **Python** (génération PDF) - python-docx, ReportLab

---

## 📅 **ROADMAP GLOBALE**

### Mois 1 : MVP Fonctionnel
- ✅ Formulaire demande
- ✅ Dashboard sessions
- [ ] Proposition commerciale automatique
- [ ] Signature convention (Yousign)
- [ ] Convocations automatiques

### Mois 2 : Automatisation Complète
- [ ] Tous les documents générés
- [ ] Tous les workflows Windmill
- [ ] Évaluations + Certificats
- [ ] Archivage automatique

### Mois 3 : Optimisation & Production
- [ ] Tests utilisateurs
- [ ] Améliorations UX
- [ ] Documentation complète
- [ ] Formation équipe
- [ ] Déploiement production

---

## ✅ **CRITÈRES DE SUCCÈS**

### Fonctionnels
- [ ] 100% des documents générés automatiquement
- [ ] 100% des emails envoyés au bon moment
- [ ] 100% conformité Qualiopi
- [ ] Signature électronique opérationnelle
- [ ] Archivage automatique

### Performance
- [ ] Temps admin réduit de 95% (8h → 30min)
- [ ] Génération PDF < 30 secondes
- [ ] Envoi email < 5 secondes
- [ ] Uptime > 99.9%

### Business
- [ ] Satisfaction client > 4/5
- [ ] 0 non-conformité audit Qualiopi
- [ ] Capacité x3 sessions/mois
- [ ] ROI positif en 3 mois

---

## 🚀 **COMMANDE IMMÉDIATE**

```bash
# 1. Appliquer la migration SQL (dans Supabase)
# 2. Tester le dashboard
cd dashboard-client && npm run dev

# 3. Commencer Sprint 1 : Proposition Commerciale
# Créer les templates dans templates/qualiopi/
```

---

**Note importante :** Le terme "devis" a été remplacé par **"Proposition de formation"** dans tout le workflow, conformément au PRD.

**Document créé le 9 octobre 2025**
