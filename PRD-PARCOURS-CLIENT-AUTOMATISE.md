# 📋 PRD - Parcours Client Automatisé

**Product Requirements Document**

---

## 📌 INFORMATIONS GÉNÉRALES

| Champ | Valeur |
|-------|--------|
| **Projet** | Automate Formation - Système de Gestion Automatisée |
| **Version** | 1.0 |
| **Date** | 8 octobre 2025 |
| **Auteur** | Cascade AI |
| **Statut** | Draft - En développement |
| **Priorité** | P0 - Critique |

---

## 🎯 OBJECTIF DU PRODUIT

Automatiser **100% du parcours administratif** d'une formation professionnelle, de la demande initiale jusqu'à l'archivage, en conformité avec le **référentiel Qualiopi**.

### Problème à Résoudre

- ⏱️ **8 heures** de travail administratif par session
- 📄 **40+ documents** à générer manuellement
- ❌ Risques d'erreurs et d'oublis
- 📧 Emails à envoyer manuellement
- 📊 Suivi difficile des sessions
- ⚠️ Non-conformité Qualiopi si documents manquants

### Solution Proposée

Un système **100% automatisé** qui :
- ✅ Génère tous les documents automatiquement
- ✅ Envoie les emails au bon moment
- ✅ Stocke et organise tous les fichiers
- ✅ Garantit la conformité Qualiopi
- ✅ Réduit le temps administratif de **95%**

---

## 👥 PERSONAS

### Persona 1 : Le Responsable Formation (Client)

**Profil** :
- Responsable RH ou Formation en entreprise
- 20-200 employés
- Budget formation annuel : 50k-500k€
- Besoin : Former ses équipes rapidement

**Besoins** :
- Processus simple et rapide
- Transparence sur le déroulement
- Documents conformes pour l'OPCO
- Suivi en temps réel

**Pain Points** :
- Trop de paperasse
- Délais de réponse longs
- Manque de visibilité
- Complexité administrative

### Persona 2 : Le Participant (Apprenant)

**Profil** :
- Salarié en entreprise
- Tous niveaux
- Peu de temps disponible

**Besoins** :
- Informations claires et à temps
- Convocation avec toutes les infos
- Certificat de réalisation
- Processus simple

**Pain Points** :
- Informations dispersées
- Emails perdus
- Pas de confirmation
- Certificat en retard

### Persona 3 : L'Organisme de Formation (Vous)

**Profil** :
- Organisme certifié Qualiopi
- 10-100 formations/an
- 1-5 personnes dans l'équipe

**Besoins** :
- Gagner du temps administratif
- Conformité Qualiopi garantie
- Traçabilité complète
- Satisfaction client

**Pain Points** :
- Tâches répétitives
- Risque d'oubli
- Audit Qualiopi stressant
- Difficulté à scaler

### Persona 4 : Le Formateur

**Profil** :
- Indépendant ou salarié
- Expert dans son domaine
- Peu de temps pour l'administratif

**Besoins** :
- Documents pré-remplis
- Planning clair
- Retour d'expérience simple

**Pain Points** :
- Paperasse chronophage
- Informations manquantes
- Pas de feedback structuré

---

## 🔄 USER JOURNEY MAP COMPLET

### 📞 PHASE 1 : DÉCOUVERTE & DEMANDE (Jour J)

**Touchpoint** : Site web / Formulaire de demande

| Étape | Action Utilisateur | Action Système | Émotion | Opportunité |
|-------|-------------------|----------------|---------|-------------|
| 1.1 | Visite le site web | Affiche formulaire | 😐 Neutre | Design attractif |
| 1.2 | Remplit le formulaire | Validation temps réel | 😊 Confiant | Auto-complétion |
| 1.3 | Soumet la demande | Création session BDD | 😊 Satisfait | Confirmation immédiate |
| 1.4 | Reçoit email confirmation | Email automatique | 😊 Rassuré | Délai de réponse clair |

**Temps utilisateur** : 5 minutes  
**Statut session** : `demande`  
**Documents générés** : 0  
**Emails envoyés** : 1 (confirmation réception)

**Données créées** :
- Entreprise (si nouvelle)
- Session de formation
- Participants

---

### 💼 PHASE 2 : PROPOSITION COMMERCIALE (J+1)

**Touchpoint** : Email avec documents PDF

| Étape | Action Utilisateur | Action Système | Émotion | Opportunité |
|-------|-------------------|----------------|---------|-------------|
| 2.1 | OF reçoit notification | Nouvelle demande à traiter | - | Dashboard clair |
| 2.2 | OF valide la demande | Statut → en_attente | - | Validation rapide |
| 2.3 | OF génère devis manuellement | Système fournit données | - | Template pré-rempli |
| 2.4 | OF génère programme | Génération automatique | - | Personnalisation |
| 2.5 | OF envoie proposition | Email automatique au client | - | Tracking envoi |
| 2.6 | Client reçoit proposition | Email avec devis + programme | 😊 Intéressé | Personnalisation |
| 2.7 | Client consulte documents | Tracking ouverture | 🤔 Réfléchit | Relance auto si pas ouvert |
| 2.8 | Client clique "Accepter" | Statut → confirmée | 😄 Enthousiaste | CTA clair |
| 2.9 | Client reçoit confirmation | Email confirmation | 😊 Engagé | Prochaines étapes |

**Temps OF** : 15 minutes (validation + personnalisation devis)  
**Temps client** : 10 minutes  
**Statut session** : `demande` → `en_attente` → `confirmee`  
**Documents générés** : 2
- Proposition de formation (Devis) - **Généré manuellement par l'OF**
- Programme de formation - **Généré automatiquement**

**Emails envoyés** : 2
- Proposition commerciale (envoyé par l'OF)
- Confirmation acceptation (automatique)

---

### ✍️ PHASE 3 : CONTRACTUALISATION (J+3)

**Touchpoint** : Signature électronique (Yousign)

| Étape | Action Utilisateur | Action Système | Émotion | Opportunité |
|-------|-------------------|----------------|---------|-------------|
| 3.1 | Reçoit lien signature | Génère convention + Yousign | 😐 Neutre | Process moderne |
| 3.2 | Clique sur lien | Ouvre Yousign | 🤔 Attentif | Interface simple |
| 3.3 | Lit la convention | Affiche document | 🤔 Attentif | Surligner points clés |
| 3.4 | Signe électroniquement | Enregistre signature | 😊 Engagé | Rapide et sécurisé |
| 3.5 | Reçoit convention signée | Email + PDF stocké | 😊 Validé | Confirmation immédiate |

**Temps utilisateur** : 5 minutes  
**Statut session** : `confirmee`  
**Documents générés** : 1
- Convention de formation signée

**Emails envoyés** : 2
- Demande signature Yousign
- Confirmation signature

**Intégrations** :
- **Yousign** (signature électronique)
- Supabase Storage (archivage)

---

### 📋 PHASE 4 : PRÉPARATION (J-7)

**Touchpoint** : Email questionnaire préalable

| Étape | Action Utilisateur | Action Système | Émotion | Opportunité |
|-------|-------------------|----------------|---------|-------------|
| 4.1 | Reçoit questionnaire | Email J-7 automatique | 😐 Neutre | Expliquer utilité |
| 4.2 | Remplit ses besoins | Enregistre réponses BDD | 😊 Écouté | Questions pertinentes |
| 4.3 | Soumet questionnaire | Notif à l'OF | 😊 Prêt | Confirmation réception |
| 4.4 | OF adapte formation | Analyse besoins | - | Personnalisation |

**Temps utilisateur** : 10 minutes par participant  
**Statut session** : `confirmee`  
**Documents générés** : N (1 par participant)
- Questionnaire préalable à la formation

**Emails envoyés** : N (1 par participant)

**Données collectées** :
- Besoins spécifiques
- Niveau de compétence
- Attentes

---

### 📨 PHASE 5 : CONVOCATION (J-4)

**Touchpoint** : Email convocation avec pièces jointes

| Étape | Action Utilisateur | Action Système | Émotion | Opportunité |
|-------|-------------------|----------------|---------|-------------|
| 5.1 | Reçoit convocation | Email J-4 avec 4 PJ | 😊 Informé | Toutes infos en 1 email |
| 5.2 | Consulte documents | Tracking ouverture | 😊 Confiant | Design professionnel |
| 5.3 | Note dans agenda | - | 😊 Organisé | Bouton "Ajouter calendrier" |
| 5.4 | Prépare déplacement | Infos lieu/accès | 😊 Prêt | Plan d'accès clair |

**Temps utilisateur** : 5 minutes  
**Statut session** : `confirmee` → `convoquee`  
**Documents générés** : N+3 par participant
- Convocation personnalisée
- Règlement intérieur
- CV du formateur
- Planning détaillé

**Documents générés** : 1-2 pour l'OF
- Feuille d'émargement entreprise
- Feuille d'émargement individuelle

**Emails envoyés** : N (1 par participant)

---

### 🎓 PHASE 6 : FORMATION (Jour J)

**Touchpoint** : Présentiel ou distanciel

| Étape | Action Utilisateur | Action Système | Émotion | Opportunité |
|-------|-------------------|----------------|---------|-------------|
| 6.1 | Arrive à la formation | Feuilles émargement prêtes | 😊 Accueilli | QR code émargement |
| 6.2 | Signe émargement matin | - | 😐 Neutre | Signature tablette |
| 6.3 | Suit la formation | - | 😊 Apprend | - |
| 6.4 | Signe émargement AM | - | 😐 Neutre | - |
| 6.5 | Fin de journée | Upload émargements | 😊 Satisfait | - |

**Temps utilisateur** : 7 heures (formation)  
**Statut session** : `convoquee`  
**Documents générés** : 1-2
- Feuilles d'émargement signées

**Emails envoyés** : 0

**Actions formateur** :
- Anime la formation
- Fait signer les émargements
- Upload les documents signés

---

### 📊 PHASE 7 : ÉVALUATION À CHAUD (Fin Jour J)

**Touchpoint** : Email ou formulaire en ligne

| Étape | Action Utilisateur | Action Système | Émotion | Opportunité |
|-------|-------------------|----------------|---------|-------------|
| 7.1 | Reçoit évaluation | Email immédiat fin formation | 😐 Neutre | Moment opportun |
| 7.2 | Remplit évaluation | Formulaire court (5 min) | 😊 Écouté | Questions ciblées |
| 7.3 | Soumet | Enregistre + analyse | 😊 Contributif | Remerciement |
| 7.4 | OF reçoit résultats | Dashboard temps réel | - | Amélioration continue |

**Temps utilisateur** : 5 minutes  
**Statut session** : `convoquee`  
**Documents générés** : N
- Évaluation à chaud (1 par participant)

**Emails envoyés** : N (1 par participant)

**Données collectées** :
- Satisfaction globale (note /5)
- Atteinte des objectifs
- Qualité formateur
- Qualité supports
- Commentaires

---

### 📝 PHASE 8 : BILAN FORMATEUR (J+1)

**Touchpoint** : Email au formateur

| Étape | Action Formateur | Action Système | Émotion | Opportunité |
|-------|------------------|----------------|---------|-------------|
| 8.1 | Reçoit questionnaire | Email automatique | 😐 Neutre | Rappel importance |
| 8.2 | Remplit bilan | Formulaire structuré | 😊 Écouté | Questions pertinentes |
| 8.3 | Soumet | Enregistre BDD | 😊 Contributif | Remerciement |
| 8.4 | OF analyse | Dashboard | - | Amélioration |

**Temps formateur** : 10 minutes  
**Statut session** : `convoquee` → `terminee`  
**Documents générés** : 1
- Questionnaire formateur

**Emails envoyés** : 1 (au formateur)

**Données collectées** :
- Déroulement conforme
- Niveau du groupe
- Difficultés rencontrées
- Suggestions

---

### ✅ PHASE 9 : CERTIFICAT & CLÔTURE (J+2)

**Touchpoint** : Email avec certificat

| Étape | Action Utilisateur | Action Système | Émotion | Opportunité |
|-------|-------------------|----------------|---------|-------------|
| 9.1 | Reçoit certificat | Email J+2 | 😄 Fier | Design valorisant |
| 9.2 | Télécharge PDF | Certificat personnalisé | 😄 Accompli | Partage LinkedIn |
| 9.3 | Partage (optionnel) | - | 😄 Satisfait | Bouton partage social |
| 9.4 | Reçoit éval. client | Email responsable RH | 😊 Impliqué | Questions ciblées |

**Temps utilisateur** : 2 minutes  
**Statut session** : `terminee`  
**Documents générés** : N+1
- Certificat de réalisation (1 par participant)
- Évaluation satisfaction client (1 pour l'entreprise)

**Emails envoyés** : N+1
- N emails aux participants (certificat)
- 1 email au responsable entreprise (évaluation)

---

### 📅 PHASE 10 : ÉVALUATION À FROID (J+60)

**Touchpoint** : Email J+60

| Étape | Action Utilisateur | Action Système | Émotion | Opportunité |
|-------|-------------------|----------------|---------|-------------|
| 10.1 | Reçoit évaluation | Email automatique J+60 | 😐 Neutre | Rappel formation |
| 10.2 | Évalue impact | Formulaire court | 😊 Réflexif | Questions pertinentes |
| 10.3 | Soumet | Enregistre + analyse | 😊 Contributif | Remerciement |

**Temps utilisateur** : 5 minutes  
**Statut session** : `terminee`  
**Documents générés** : N
- Évaluation à froid (1 par participant)

**Emails envoyés** : N

**Données collectées** :
- Mise en pratique
- Impact sur le travail
- Besoin de complément
- Recommandation

---

### 💰 PHASE 11 : ÉVALUATION OPCO (Si financement)

**Touchpoint** : Email à l'OPCO

| Étape | Action OPCO | Action Système | Émotion | Opportunité |
|-------|-------------|----------------|---------|-------------|
| 11.1 | Reçoit dossier complet | Email avec tous docs | 😐 Neutre | Dossier complet |
| 11.2 | Vérifie conformité | - | 😊 Satisfait | Tout est là |
| 11.3 | Remplit évaluation | Formulaire | 😐 Neutre | Questions ciblées |
| 11.4 | Valide financement | - | 😊 Validé | Paiement rapide |

**Temps OPCO** : 15 minutes  
**Statut session** : `terminee`  
**Documents générés** : 1
- Évaluation OPCO

**Documents envoyés** : Dossier complet
- Convention signée
- Programme
- Feuilles d'émargement
- Certificats
- Évaluations

**Emails envoyés** : 1 (à l'OPCO)

---

### 📦 PHASE 12 : ARCHIVAGE (J+90)

**Touchpoint** : Système automatique

| Étape | Action Système | Statut | Conformité |
|-------|----------------|--------|------------|
| 12.1 | Vérification complétude | Tous docs présents | ✅ |
| 12.2 | Archivage automatique | Statut → archivee | ✅ |
| 12.3 | Conservation 3 ans | Supabase Storage | ✅ Qualiopi |
| 12.4 | Indexation recherche | Métadonnées | ✅ |

**Statut session** : `terminee` → `archivee`  
**Documents générés** : 0  
**Emails envoyés** : 0

**Conformité** :
- Conservation 3 ans minimum (obligation légale)
- Tous documents accessibles
- Traçabilité complète

---

## 📊 MÉTRIQUES & KPIs

### Métriques Utilisateur

| Métrique | Valeur Cible | Mesure |
|----------|--------------|--------|
| **Temps de réponse initial** | < 1 minute | Temps entre demande et email confirmation |
| **Temps total parcours** | < 5 jours | De la demande à la signature |
| **Taux d'ouverture emails** | > 80% | Emails ouverts / Emails envoyés |
| **Taux de complétion questionnaires** | > 70% | Questionnaires remplis / Envoyés |
| **Satisfaction globale** | > 4/5 | Note moyenne évaluations |
| **NPS (Net Promoter Score)** | > 50 | Recommandation |

### Métriques Business

| Métrique | Valeur Cible | Impact |
|----------|--------------|--------|
| **Temps admin par session** | < 30 min | -95% vs manuel (8h) |
| **Taux de conformité Qualiopi** | 100% | 0 non-conformité |
| **Nombre de sessions/mois** | x3 | Scalabilité |
| **Coût par session** | -70% | Automatisation |
| **Taux d'erreur documents** | < 1% | Qualité |
| **Délai génération documents** | < 5 min | Performance |

### Métriques Techniques

| Métrique | Valeur Cible | Outil |
|----------|--------------|-------|
| **Uptime système** | > 99.9% | Monitoring |
| **Temps génération PDF** | < 30s | Performance |
| **Taux d'échec emails** | < 0.1% | Resend |
| **Temps réponse API** | < 500ms | Supabase |
| **Stockage utilisé** | < 10GB/an | Supabase Storage |

---

## 🔧 SPÉCIFICATIONS TECHNIQUES

### Architecture Système

```
┌─────────────────┐
│   Frontend      │
│   React App     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend API   │
│   Express.js    │
└────────┬────────┘
         │
         ├──────────────────┬──────────────────┬──────────────────┐
         ▼                  ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Supabase   │    │  Windmill   │    │   Resend    │    │  Yousign    │
│  (Database) │    │(Automation) │    │   (Email)   │    │ (Signature) │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
         │                  │
         ▼                  ▼
┌─────────────┐    ┌─────────────┐
│  Storage    │    │  Documents  │
│  (Files)    │    │ Generation  │
└─────────────┘    └─────────────┘
```

### Stack Technique

**Frontend** :
- React 18.2
- React Hook Form 7.45
- React Router DOM 6.15
- Axios 1.5

**Backend** :
- Node.js + Express 4.18
- Python 3.9+ (génération documents)

**Base de Données** :
- Supabase (PostgreSQL)
- 9 tables principales

**Automatisation** :
- Windmill (workflows)
- Cron jobs

**Services Externes** :
- Resend (emails)
- Yousign (signatures électroniques)
- Supabase Storage (fichiers)

**Génération Documents** :
- python-docx 1.2
- ReportLab (PDF)

---

## 📋 TABLES BASE DE DONNÉES

### Tables Existantes

1. **entreprises** - Clients
2. **formations_catalogue** - Formations disponibles
3. **sessions_formation** - Sessions planifiées
4. **participants** - Participants aux sessions
5. **documents** - Métadonnées documents générés

### Tables à Créer

6. **organisme_formation** - Informations OF (NDA, SIRET, etc.)
7. **formateurs** - Formateurs et sous-traitants
8. **evaluations** - Réponses questionnaires
9. **emargements** - Signatures émargements

---

## 📄 DOCUMENTS GÉNÉRÉS (19 types)

### Documents Obligatoires Qualiopi (11)

1. ✅ Proposition de formation (Devis)
2. ✅ Convention de formation
3. ✅ Programme de formation
4. ✅ Questionnaire préalable
5. ✅ Convocation
6. ✅ Feuille émargement entreprise
7. ✅ Feuille émargement individuelle
8. ✅ Évaluation à chaud
9. ✅ Évaluation à froid
10. ✅ Certificat de réalisation
11. ✅ Évaluation satisfaction client

### Documents Complémentaires (8)

12. ✅ Règlement intérieur
13. ✅ Bulletin d'inscription
14. ✅ Grille MAJ compétences
15. ✅ Évaluation OPCO
16. ✅ Déroulé pédagogique
17. ✅ Questionnaire formateur
18. ✅ Contrat formateur
19. ✅ Traitement réclamations

---

## 🔄 WORKFLOWS WINDMILL

### Flow 1 : Nouvelle Demande
**Trigger** : Formulaire soumis  
**Actions** :
- Créer entreprise (si nouvelle)
- Créer session (statut: demande)
- Créer participants
- Envoyer email confirmation

### Flow 2 : Génération Proposition
**Trigger** : Statut → en_attente  
**Actions** :
- Générer proposition PDF
- Générer programme PDF
- Upload Supabase Storage
- Envoyer email avec PJ

### Flow 3 : Signature Convention
**Trigger** : Acceptation proposition  
**Actions** :
- Générer convention
- Envoyer Yousign
- Attendre signature
- Stocker convention signée
- Statut → confirmee

### Flow 4 : Préparation Formation
**Trigger** : J-7 (cron)  
**Actions** :
- Générer questionnaires préalables
- Envoyer emails participants

### Flow 5 : Convocation
**Trigger** : J-4 (cron)  
**Actions** :
- Générer convocations
- Générer feuilles émargement
- Envoyer emails participants
- Statut → convoquee

### Flow 6 : Évaluation À Chaud
**Trigger** : Fin formation  
**Actions** :
- Générer évaluations
- Envoyer emails participants

### Flow 7 : Clôture Formation
**Trigger** : J+2  
**Actions** :
- Générer certificats
- Générer évaluation client
- Envoyer emails
- Statut → terminee

### Flow 8 : Évaluation À Froid
**Trigger** : J+60 (cron)  
**Actions** :
- Générer évaluations
- Envoyer emails participants

### Flow 9 : Archivage
**Trigger** : J+90 (cron)  
**Actions** :
- Vérifier complétude
- Statut → archivee

---

## 📧 EMAILS AUTOMATIQUES

### Types d'Emails (12)

1. **Confirmation demande** - Immédiat
2. **Proposition commerciale** - J+1
3. **Confirmation acceptation** - Immédiat
4. **Demande signature** - J+3
5. **Confirmation signature** - Immédiat
6. **Questionnaire préalable** - J-7
7. **Convocation** - J-4
8. **Évaluation à chaud** - Fin formation
9. **Bilan formateur** - J+1
10. **Certificat** - J+2
11. **Évaluation client** - J+2
12. **Évaluation à froid** - J+60

### Template Email Type

```
Objet: [ACTION] - [FORMATION] - [DATE]

Bonjour [PRENOM],

[MESSAGE PERSONNALISÉ]

[BOUTON CTA]

Cordialement,
[NOM_ORGANISME]
[CONTACT]
```

---

## 🎨 DESIGN & UX

### Principes de Design

1. **Simplicité** - Parcours linéaire et clair
2. **Transparence** - Visibilité à chaque étape
3. **Réactivité** - Feedback immédiat
4. **Professionnalisme** - Documents de qualité
5. **Accessibilité** - Compatible tous devices

### Charte Graphique Documents

- **Police** : Arial / Helvetica
- **Couleurs** : Bleu professionnel + Gris
- **Logo** : En-tête de chaque document
- **Footer** : Coordonnées + NDA

---

## ⚠️ RISQUES & MITIGATION

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Email en spam | Élevé | Moyenne | SPF/DKIM, domaine vérifié |
| Erreur génération PDF | Élevé | Faible | Tests automatisés, logs |
| Panne Supabase | Élevé | Très faible | Backup quotidien |
| Non-conformité Qualiopi | Critique | Faible | Audit régulier, checklist |
| Signature non reçue | Moyen | Moyenne | Relances automatiques |
| Données incorrectes | Moyen | Moyenne | Validation formulaires |

---

## 📅 ROADMAP

### Phase 1 : MVP (Semaines 1-2)
- ✅ Tables Supabase
- ✅ Génération 5 documents critiques
- ✅ Workflows de base
- ✅ Emails automatiques
- ✅ Intégration Yousign (signatures)

### Phase 2 : Complet (Semaines 3-4)
- ✅ Tous les 19 documents
- ✅ Tous les workflows
- ✅ Dashboard
- ✅ Outlook Calendar

### Phase 3 : Optimisation (Semaines 5-6)
- ✅ Tests utilisateurs
- ✅ Améliorations UX
- ✅ Performance
- ✅ Documentation

### Phase 4 : Production (Semaine 7)
- ✅ Déploiement
- ✅ Formation équipe
- ✅ Monitoring
- ✅ Support

---

## ✅ CRITÈRES DE SUCCÈS

### Critères Fonctionnels

- [ ] Tous les documents générés automatiquement
- [ ] Tous les emails envoyés au bon moment
- [ ] 100% conformité Qualiopi
- [ ] Signature électronique fonctionnelle
- [ ] Archivage automatique

### Critères Non-Fonctionnels

- [ ] Temps de réponse < 500ms
- [ ] Uptime > 99.9%
- [ ] Génération PDF < 30s
- [ ] 0 perte de données
- [ ] Sécurité RGPD

### Critères Business

- [ ] Temps admin réduit de 95%
- [ ] Satisfaction client > 4/5
- [ ] 0 non-conformité audit
- [ ] Capacité x3 sessions/mois
- [ ] ROI positif en 3 mois

---

## 📞 SUPPORT & MAINTENANCE

### Support Niveau 1
- FAQ automatique
- Chatbot
- Email support

### Support Niveau 2
- Ticket system
- Intervention < 4h
- Résolution < 24h

### Maintenance
- Backup quotidien
- Monitoring 24/7
- Mises à jour mensuelles
- Audit Qualiopi annuel

---

## 📚 DOCUMENTATION

### Documentation Utilisateur
- Guide de démarrage
- Tutoriels vidéo
- FAQ
- Best practices

### Documentation Technique
- Architecture système
- API documentation
- Guide déploiement
- Procédures maintenance

---

## 🎯 CONCLUSION

Ce système automatisé transforme complètement la gestion des formations en :
- ✅ Éliminant 95% du travail administratif
- ✅ Garantissant la conformité Qualiopi
- ✅ Améliorant l'expérience client
- ✅ Permettant de scaler l'activité

**ROI estimé** : Retour sur investissement en **3 mois**

**Gain de temps** : **8 heures → 30 minutes** par session

**Satisfaction client** : **+40%** grâce à la réactivité

---

## 📋 ANNEXE : WORKFLOW COMPLET DES DOCUMENTS PAR PHASE

### **AVANT LA FORMATION** 📝

#### **PHASE 1 : DEMANDE (Jour J)**
**Destinataire :** Client (Responsable Formation)
- ✅ **Email de confirmation** - Immédiat
  - Accusé de réception de la demande
  - Délai de réponse annoncé

#### **PHASE 2 : PROPOSITION COMMERCIALE (J+1)**
**Destinataire :** Client
- 📄 **Proposition de formation (Devis)** - Généré manuellement par l'OF
- 📄 **Programme de formation** - Généré automatiquement
- ✅ **Email avec proposition** - Envoyé par l'OF

#### **PHASE 3 : CONTRACTUALISATION (J+3)**
**Destinataire :** Client
- 📄 **Convention de formation** - Générée automatiquement
- ✅ **Email demande signature** - Via Yousign
- ✅ **Email confirmation signature** - Après signature

#### **PHASE 4 : PRÉPARATION (J-7)**
**Destinataires :** Participants
- 📄 **Questionnaire préalable** - 1 par participant
- ✅ **Email avec questionnaire** - 1 par participant

#### **PHASE 5 : CONVOCATION (J-4)**
**Destinataires :** Participants
- 📄 **Convocation personnalisée** - 1 par participant
- 📄 **Règlement intérieur** - Commun
- 📄 **CV du formateur** - Commun
- 📄 **Planning détaillé** - Commun
- ✅ **Email convocation** - 1 par participant avec 4 PJ

**Destinataire :** Organisme de Formation
- 📄 **Feuille d'émargement entreprise** - Pour toute la session
- 📄 **Feuille d'émargement individuelle** - 1 par participant

---

### **PENDANT LA FORMATION** 🎓

#### **PHASE 6 : JOUR DE FORMATION (Jour J)**
**Destinataire :** Formateur
- 📄 **Feuilles d'émargement** - À faire signer (matin + après-midi)
- **Action :** Upload des émargements signés

---

### **APRÈS LA FORMATION** ✅

#### **PHASE 7 : ÉVALUATION À CHAUD (Fin Jour J)**
**Destinataires :** Participants
- 📄 **Évaluation à chaud** - 1 par participant
- ✅ **Email avec formulaire** - Immédiat fin formation

#### **PHASE 8 : BILAN FORMATEUR (J+1)**
**Destinataire :** Formateur
- 📄 **Questionnaire formateur**
- ✅ **Email avec formulaire**

#### **PHASE 9 : CERTIFICAT & CLÔTURE (J+2)**
**Destinataires :** Participants
- 📄 **Certificat de réalisation** - 1 par participant
- ✅ **Email avec certificat PDF**

**Destinataire :** Client (Responsable Formation)
- 📄 **Évaluation satisfaction client**
- ✅ **Email avec formulaire**

#### **PHASE 10 : ÉVALUATION À FROID (J+60)**
**Destinataires :** Participants
- 📄 **Évaluation à froid** - 1 par participant
- ✅ **Email avec formulaire** - 60 jours après

#### **PHASE 11 : ÉVALUATION OPCO (Si financement)**
**Destinataire :** OPCO
- 📄 **Évaluation OPCO**
- 📦 **Dossier complet** avec tous les documents
- ✅ **Email avec dossier**

---

## 📊 RÉCAPITULATIF PAR DESTINATAIRE

### **👥 PARTICIPANTS (N personnes)**
| Timing | Document | Email |
|--------|----------|-------|
| J-7 | Questionnaire préalable | ✅ |
| J-4 | Convocation + Règlement + CV + Planning | ✅ |
| Fin J | Évaluation à chaud | ✅ |
| J+2 | Certificat de réalisation | ✅ |
| J+60 | Évaluation à froid | ✅ |

**Total par participant : 5 documents + 5 emails**

---

### **👨‍🏫 FORMATEUR (1 personne)**
| Timing | Document | Email |
|--------|----------|-------|
| J-4 | Feuilles émargement (reçues par l'OF) | - |
| J+1 | Questionnaire formateur | ✅ |

**Total formateur : 1 document + 1 email**

---

### **🏢 CLIENT / ENTREPRISE (1 responsable)**
| Timing | Document | Email |
|--------|----------|-------|
| J | Confirmation demande | ✅ |
| J+1 | Proposition + Programme | ✅ |
| J+3 | Convention (signature) | ✅ |
| J+3 | Confirmation signature | ✅ |
| J+2 | Évaluation satisfaction | ✅ |

**Total client : 3 documents + 5 emails**

---

### **💼 OPCO (Si financement)**
| Timing | Document | Email |
|--------|----------|-------|
| Après formation | Dossier complet + Évaluation OPCO | ✅ |

**Total OPCO : Dossier complet + 1 email**

---

### **📁 ORGANISME DE FORMATION (Vous)**
| Timing | Document | Utilisation |
|--------|----------|-------------|
| J+1 | Proposition (manuel) | Envoi client |
| J+1 | Programme (auto) | Envoi client |
| J+3 | Convention (auto) | Signature |
| J-4 | Feuilles émargement | Formation |
| Après | Tous documents | Archivage Qualiopi |

---

## 🎯 DOCUMENTS PAR CATÉGORIE

### **📄 Documents de Session (Communs)**
1. Proposition de formation (Devis)
2. Programme de formation
3. Convention de formation
4. Feuille d'émargement entreprise
5. Règlement intérieur

### **👤 Documents Individuels (Par participant)**
6. Convocation
7. Questionnaire préalable
8. Feuille d'émargement individuelle
9. Évaluation à chaud
10. Certificat de réalisation
11. Évaluation à froid

### **👨‍🏫 Documents Formateur**
12. Questionnaire formateur
13. Contrat formateur
14. Déroulé pédagogique

### **💼 Documents Administratifs**
15. Évaluation satisfaction client
16. Évaluation OPCO
17. Bulletin d'inscription
18. Grille MAJ compétences
19. Traitement réclamations

---

## 📈 STATISTIQUES GLOBALES

### Par Session de Formation

**Documents générés** :
- Documents communs : 5
- Documents par participant : 6 × N participants
- Documents formateur : 1
- Documents administratifs : 2-4

**Exemple pour 10 participants** :
- Total documents : **5 + (6 × 10) + 1 + 3 = 69 documents**

**Emails envoyés** :
- Emails participants : 5 × N participants
- Emails client : 5
- Emails formateur : 1
- Emails OPCO : 0-1

**Exemple pour 10 participants** :
- Total emails : **(5 × 10) + 5 + 1 + 1 = 57 emails**

---

## ⏱️ TIMELINE COMPLÈTE

```
J-7  ────► Questionnaire préalable (Participants)
J-4  ────► Convocation + Documents (Participants)
J-3  ────► Convention signature (Client)
J    ────► Formation + Émargements
J    ────► Évaluation à chaud (Participants)
J+1  ────► Questionnaire formateur
J+2  ────► Certificats + Évaluation client
J+60 ────► Évaluation à froid (Participants)
J+90 ────► Archivage automatique
```

---

## 🎯 OBJECTIF INTERFACE DE GÉNÉRATION

L'interface doit permettre de :

1. **Générer les documents par phase** avec un seul clic
2. **Envoyer automatiquement les emails** au bon moment
3. **Suivre l'état d'avancement** de chaque phase
4. **Télécharger les documents** générés
5. **Archiver automatiquement** après la formation

---

**Document créé le 8 octobre 2025**  
**Mis à jour le 27 octobre 2025**  
**Version 1.1 - Draft**
