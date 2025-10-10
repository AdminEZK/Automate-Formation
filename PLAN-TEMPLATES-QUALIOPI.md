# 📋 Plan de Création des Templates Qualiopi

**Date** : 8 octobre 2025

---

## 🎯 Objectif

Créer des templates dynamiques à partir de vos documents Word existants pour générer automatiquement les documents Qualiopi avec les données de votre base de données.

---

## 📊 Documents Disponibles

Vous avez **15 documents Word** dans `Dossier exemple/` :

### Documents Obligatoires Qualiopi
1. ✅ **Convocation** - `Modele Convocation formation 2020.docx`
2. ✅ **Convention** - `Modèle de convention simplifiée de formation 2020.docx`
3. ✅ **Programme** - `Modèle Programme de formation 2020.docx`
4. ✅ **Certificat** - `Modèle Certificat de réalisation.docx`
5. ✅ **Feuilles d'émargement** - 2 modèles
6. ✅ **Évaluations** - 3 modèles (à chaud, à froid, satisfaction)

---

## 🔧 Approche Technique

### Option A : Modification des Documents Word (Recommandé)

**Avantages** :
- ✅ Conserve la mise en page exacte
- ✅ Facile à maintenir
- ✅ Utilise python-docx

**Étapes** :
1. Identifier les zones à remplacer dans chaque document
2. Créer des fonctions de remplacement
3. Générer les documents avec les données de Supabase

### Option B : Templates Jinja2 + Conversion PDF

**Avantages** :
- ✅ Plus flexible
- ✅ Meilleur contrôle
- ✅ Génération PDF directe

**Inconvénients** :
- ❌ Nécessite de recréer la mise en page
- ❌ Plus de travail initial

---

## 📝 Mapping des Données

### Pour la Convocation

**Champs à remplir** :
- `{{ participant.nom }}` `{{ participant.prenom }}`
- `{{ entreprise.ville }}`, le `{{ date_actuelle }}`
- `{{ formation.titre }}`
- `{{ session.date_debut }}` au `{{ session.date_fin }}`
- `{{ session.lieu }}`
- `{{ session.horaires }}`
- `{{ formation.duree }}` heures

**Tables utilisées** :
- `participants`
- `sessions_formation`
- `formations_catalogue`
- `entreprises`

### Pour le Certificat

**Champs à remplir** :
- `{{ participant.nom }}` `{{ participant.prenom }}`
- `{{ formation.titre }}`
- `{{ formation.objectifs }}`
- `{{ formation.duree }}` heures
- Du `{{ session.date_debut }}` au `{{ session.date_fin }}`
- `{{ organisme.nom }}`
- `{{ organisme.nda }}`

**Tables utilisées** :
- `participants`
- `sessions_formation`
- `formations_catalogue`
- `organisme_formation` ⚠️ **À CRÉER**

### Pour la Convention

**Champs à remplir** :
- `{{ organisme.nom }}`, `{{ organisme.siret }}`, `{{ organisme.nda }}`
- `{{ entreprise.nom }}`, `{{ entreprise.siret }}`
- `{{ entreprise.representant_legal }}`
- `{{ formation.titre }}`, `{{ formation.objectifs }}`
- `{{ formation.duree }}` heures
- `{{ session.prix_total_ht }}` €
- `{{ formation.modalites_pedagogiques }}`
- `{{ formation.modalites_evaluation }}`

**Tables utilisées** :
- `organisme_formation` ⚠️ **À CRÉER**
- `entreprises` (+ champs à ajouter)
- `sessions_formation`
- `formations_catalogue` (+ champs à ajouter)

---

## 🗄️ Tables et Champs Manquants

### 1. Table `organisme_formation` (CRITIQUE)

```sql
CREATE TABLE organisme_formation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    raison_sociale VARCHAR(255),
    siret VARCHAR(14) NOT NULL,
    numero_declaration_activite VARCHAR(20) NOT NULL, -- NDA
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(255),
    site_web VARCHAR(255),
    representant_legal_nom VARCHAR(255),
    representant_legal_fonction VARCHAR(100),
    logo_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Champs à ajouter dans `entreprises`

```sql
ALTER TABLE entreprises ADD COLUMN representant_legal_nom VARCHAR(255);
ALTER TABLE entreprises ADD COLUMN representant_legal_fonction VARCHAR(100);
ALTER TABLE entreprises ADD COLUMN representant_legal_email VARCHAR(255);
```

### 3. Champs à ajouter dans `formations_catalogue`

```sql
ALTER TABLE formations_catalogue ADD COLUMN public_vise TEXT;
ALTER TABLE formations_catalogue ADD COLUMN methodes_pedagogiques TEXT;
ALTER TABLE formations_catalogue ADD COLUMN moyens_pedagogiques TEXT;
ALTER TABLE formations_catalogue ADD COLUMN modalites_evaluation TEXT;
ALTER TABLE formations_catalogue ADD COLUMN accessibilite_handicap TEXT;
ALTER TABLE formations_catalogue ADD COLUMN nature_action VARCHAR(100);
```

### 4. Champs à ajouter dans `sessions_formation`

```sql
ALTER TABLE sessions_formation ADD COLUMN horaire_debut TIME;
ALTER TABLE sessions_formation ADD COLUMN horaire_fin TIME;
ALTER TABLE sessions_formation ADD COLUMN modalites_reglement TEXT;
ALTER TABLE sessions_formation ADD COLUMN numero_convention VARCHAR(50);
```

---

## 🚀 Prochaines Étapes

### Phase 1 : Créer les Tables Manquantes (30 min)
1. Exécuter les scripts SQL
2. Insérer les données de votre organisme
3. Tester les requêtes

### Phase 2 : Créer les Fonctions de Génération (2h)
1. Fonction pour Convocation
2. Fonction pour Certificat
3. Fonction pour Convention
4. Fonction pour Programme
5. Fonction pour Feuilles d'émargement

### Phase 3 : Intégrer avec Windmill (1h)
1. Créer un flow "generer_tous_documents"
2. Déclencher automatiquement selon le statut
3. Envoyer par email via Resend

### Phase 4 : Tests (1h)
1. Tester chaque type de document
2. Vérifier la mise en page
3. Valider avec un vrai cas

---

## 💡 Recommandation

**Je recommande de commencer par :**

1. ✅ **Créer la table `organisme_formation`** et y insérer vos données
2. ✅ **Ajouter les champs manquants** dans les tables existantes
3. ✅ **Créer la fonction de génération de Convocation** (document le plus simple)
4. ✅ **Tester** avec une vraie session
5. ✅ **Répliquer** pour les autres documents

---

**Voulez-vous que je commence par créer les scripts SQL pour les tables manquantes ?**
