# 🎯 MVP - Périmètre Fonctionnel

**Version** : 1.0 - MVP Simplifié  
**Date** : 8 octobre 2025

---

## ✅ CE QUI EST INCLUS DANS LE MVP

### 🔧 Stack Technique MVP

**Frontend** :
- ✅ React 18.2
- ✅ React Hook Form
- ✅ Axios

**Backend** :
- ✅ Node.js + Express
- ✅ Python 3.9+ (génération documents)
- ✅ Supabase (PostgreSQL)
- ✅ Windmill (automatisation)

**Services Externes** :
- ✅ **Resend** (emails automatiques)
- ✅ **Yousign** (signature électronique documents)
- ✅ **Supabase Storage** (stockage fichiers)

### 📋 Tables Base de Données MVP

1. ✅ `entreprises` - Clients
2. ✅ `formations_catalogue` - Formations
3. ✅ `sessions_formation` - Sessions
4. ✅ `participants` - Participants
5. ✅ `documents` - Métadonnées documents
6. ✅ `organisme_formation` - Infos OF (à créer)
7. ✅ `formateurs` - Formateurs (à créer)
8. ✅ `evaluations` - Évaluations (à créer)

### 📄 Documents Générés (19)

**Tous les documents Word sont générés automatiquement** :

1. ✅ Proposition de formation (manuel par OF)
2. ✅ Programme de formation (auto)
3. ✅ Convention de formation (auto)
4. ✅ Questionnaire préalable (auto)
5. ✅ Convocation (auto)
6. ✅ Règlement intérieur (auto)
7. ✅ Feuille émargement entreprise (auto)
8. ✅ Feuille émargement individuelle (auto)
9. ✅ Évaluation à chaud (auto)
10. ✅ Évaluation à froid (auto)
11. ✅ Évaluation client (auto)
12. ✅ Évaluation OPCO (auto)
13. ✅ Certificat de réalisation (auto)
14. ✅ Déroulé pédagogique (auto)
15. ✅ Questionnaire formateur (auto)
16. ✅ Contrat formateur (auto)
17. ✅ Bulletin d'inscription (auto)
18. ✅ Grille MAJ compétences (auto)
19. ✅ Traitement réclamations (auto)

### 📧 Emails Automatiques (12 types)

1. ✅ Confirmation demande
2. ✅ Proposition commerciale
3. ✅ Confirmation acceptation
4. ✅ Envoi convention à signer
5. ✅ Confirmation signature
6. ✅ Questionnaire préalable
7. ✅ Convocation J-4
8. ✅ Évaluation à chaud
9. ✅ Bilan formateur
10. ✅ Certificat + Évaluation client
11. ✅ Évaluation à froid (J+60)
12. ✅ Évaluation OPCO

### 🔄 Workflows Windmill (9)

1. ✅ Nouvelle demande → Notification
2. ✅ Génération proposition (manuel OF)
3. ✅ Génération convention
4. ✅ Questionnaire préalable (J-7)
5. ✅ Convocation (J-4)
6. ✅ Évaluation à chaud
7. ✅ Clôture + Certificat
8. ✅ Évaluation à froid (J+60)
9. ✅ Archivage (J+90)

---

## ❌ CE QUI N'EST PAS DANS LE MVP

### 🚫 Services Externes Exclus

**Phase 2 (après MVP)** :

1. ✅ **Yousign** (signature électronique) - **INCLUS MVP**
   - MVP : Signature électronique via Yousign
   - Documents signés : Convention, Contrat formateur

2. ❌ **Stripe** (paiements en ligne)
   - MVP : Paiement hors système (virement, chèque)
   - Phase 2 : Paiement en ligne

3. ❌ **Génération factures automatique**
   - MVP : Factures manuelles
   - Phase 2 : Génération auto + export compta

4. ✅ **Outlook Calendar** (planification) - **PHASE 2**
   - MVP : Gestion manuelle des dates
   - Phase 2 : Intégration Microsoft 365 / Outlook Calendar

5. ❌ **Zoom/Visio** (formations distancielles)
   - MVP : Liens manuels si besoin
   - Phase 2 : Création automatique salles

6. ❌ **SMS / Notifications push** 
   - MVP : Emails uniquement (Resend)
   - Phase 2+ : Pas prévu pour l'instant

7. ❌ **Stockage Cloud externe**
   - MVP : Supabase Storage uniquement
   - Interface : Export/téléchargement manuel des documents
   - Phase 2+ : Pas de backup cloud externe prévu

8. ❌ **CRM externe**
   - MVP : Système interne Supabase
   - Phase 2+ : Pas d'intégration CRM prévue

9. ❌ **Reporting avancé**
   - MVP : Données brutes Supabase + Export manuel
   - Phase 2 : Dashboards internes (pas Metabase)

---

## 🎯 PARCOURS CLIENT MVP

### Phase 1 : Demande (J)
✅ Formulaire → Création session → Email confirmation

### Phase 2 : Proposition (J+1)
✅ OF valide → OF crée devis (manuel) → Système génère programme → Email client

### Phase 3 : Signature (J+3)
✅ Système génère convention PDF → **Envoi Yousign** → Client signe électroniquement → Convention signée stockée → Confirmation

### Phase 4 : Préparation (J-7)
✅ Système génère questionnaire → Email participants → Réponses enregistrées

### Phase 5 : Convocation (J-4)
✅ Système génère convocations + docs → Email participants

### Phase 6 : Formation (Jour J)
✅ Feuilles émargement pré-remplies → Signatures manuelles → Upload

### Phase 7 : Évaluation à chaud
✅ Système génère évaluations → Email participants → Réponses

### Phase 8 : Clôture (J+2)
✅ Système génère certificats → Email participants → Évaluation client

### Phase 9 : Évaluation à froid (J+60)
✅ Système génère évaluations → Email participants

### Phase 10 : Archivage (J+90)
✅ Vérification complétude → Archivage automatique

---

## 📊 DIFFÉRENCES MVP vs COMPLET

| Fonctionnalité | MVP | Phase 2 |
|----------------|-----|---------|
| **Signature** | Électronique (Yousign) | Électronique (Yousign) |
| **Paiement** | Hors système | En ligne (Stripe) |
| **Factures** | Manuelles | Automatiques |
| **Calendrier** | Manuel | Outlook Calendar (Microsoft 365) |
| **Visio** | Liens manuels | Zoom API |
| **Notifications** | Email uniquement | Email uniquement |
| **Stockage** | Supabase + Export manuel | Supabase + Export manuel |
| **CRM** | Système interne | Système interne |
| **Reporting** | Export manuel | Dashboards internes |

---

## ⏱️ TEMPS GAGNÉ

### Avec MVP
**Avant** : 8 heures/session  
**Avec MVP** : 1 heure/session  
**Gain** : **87.5%** (7 heures gagnées)

### Avec Phase 2 Complète
**Avant** : 8 heures/session  
**Avec Phase 2** : 20 minutes/session  
**Gain** : **95%** (7h40 gagnées)

---

## 🎯 OBJECTIFS MVP

### Fonctionnels
- ✅ Générer automatiquement 18/19 documents (95%)
- ✅ Envoyer tous les emails automatiquement
- ✅ 100% conformité Qualiopi
- ✅ Archivage automatique
- ✅ Traçabilité complète

### Non-Fonctionnels
- ✅ Temps de réponse < 500ms
- ✅ Génération PDF < 30s
- ✅ 0 perte de données
- ✅ Sécurité RGPD

### Business
- ✅ Temps admin réduit de 87.5%
- ✅ 0 non-conformité Qualiopi
- ✅ Capacité x2 sessions/mois
- ✅ ROI positif en 3 mois

---

## 📅 PLANNING MVP

### Semaine 1
- Jour 1-2 : Tables Supabase + migrations
- Jour 3-4 : Génération 5 documents critiques
- Jour 5 : Tests

### Semaine 2
- Jour 1-2 : Tous les 19 documents
- Jour 3-4 : Workflows Windmill
- Jour 5 : Tests + déploiement

**Total : 10 jours**

---

## ✅ CRITÈRES DE VALIDATION MVP

### Scénario de Test
1. ✅ Client soumet demande → Session créée
2. ✅ OF valide → Devis manuel + Programme auto
3. ✅ Client accepte → Convention générée
4. ✅ Client signe (scan) → Convention stockée
5. ✅ J-7 : Questionnaire envoyé
6. ✅ J-4 : Convocation envoyée
7. ✅ Jour J : Émargements signés
8. ✅ Fin : Évaluation à chaud
9. ✅ J+2 : Certificats envoyés
10. ✅ J+60 : Évaluation à froid
11. ✅ J+90 : Archivage auto

**Si tous les points passent → MVP validé** ✅

---

## 🚀 APRÈS LE MVP

### Phase 2 : Automatisation Complète (Semaines 3-4)
- Yousign (signatures)
- Stripe (paiements)
- Factures auto
- Google Calendar

### Phase 3 : Optimisation (Semaines 5-6)
- SMS
- Visio
- CRM
- Dashboards

---

**Le MVP se concentre sur l'essentiel : automatiser la génération de documents et les emails, en conformité Qualiopi, sans dépendances externes complexes.**

**Objectif : Livrer un système fonctionnel en 2 semaines qui fait gagner 7 heures par session.**
