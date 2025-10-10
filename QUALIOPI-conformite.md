# Conformité Qualiopi - Analyse des Champs

**Date d'analyse** : 8 octobre 2025  
**Référentiel** : Qualiopi (Référentiel National Qualité)

---

## 📋 Documents Obligatoires Qualiopi

### 1. **Convention de Formation** (ou Contrat)
### 2. **Programme de Formation**
### 3. **Convocation**
### 4. **Feuille d'Émargement**
### 5. **Attestation de Présence / Certificat de Réalisation**
### 6. **Évaluation de la Formation**

---

## ✅ Analyse Champ par Champ

### 1️⃣ CONVENTION DE FORMATION

#### Champs Obligatoires Qualiopi

| Champ Requis | Disponible | Table/Champ | Statut | Action Requise |
|--------------|------------|-------------|--------|----------------|
| **Intitulé de la formation** | ✅ | `formations_catalogue.titre` | OK | - |
| **Nature de l'action** | ❌ | - | **MANQUANT** | Ajouter champ |
| **Durée** | ✅ | `formations_catalogue.duree` | OK | - |
| **Dates** | ✅ | `sessions_formation.date_debut/date_fin` | OK | - |
| **Lieu** | ✅ | `sessions_formation.lieu` | OK | - |
| **Objectifs** | ✅ | `formations_catalogue.objectifs` | OK | - |
| **Prérequis** | ✅ | `formations_catalogue.prerequis` | OK | - |
| **Modalités pédagogiques** | ⚠️ | `formations_catalogue.format` | PARTIEL | Enrichir |
| **Modalités d'évaluation** | ❌ | - | **MANQUANT** | Ajouter champ |
| **Prix** | ✅ | `sessions_formation.prix_total_ht` | OK | - |
| **Nom de l'organisme** | ❌ | - | **MANQUANT** | Ajouter table |
| **N° de déclaration d'activité** | ❌ | - | **MANQUANT** | Ajouter table |
| **SIRET organisme** | ❌ | - | **MANQUANT** | Ajouter table |
| **Nom du client (entreprise)** | ✅ | `entreprises.nom` | OK | - |
| **SIRET client** | ✅ | `entreprises.siret` | OK | - |
| **Adresse client** | ✅ | `entreprises.adresse/ville/code_postal` | OK | - |
| **Représentant légal client** | ❌ | - | **MANQUANT** | Ajouter champ |
| **Modalités de règlement** | ❌ | - | **MANQUANT** | Ajouter champ |
| **Délai de rétractation** | ❌ | - | **MANQUANT** | Texte légal |
| **Conditions d'annulation** | ❌ | - | **MANQUANT** | Texte légal |

**Score : 9/19 champs disponibles (47%)**

---

### 2️⃣ PROGRAMME DE FORMATION

| Champ Requis | Disponible | Table/Champ | Statut | Action Requise |
|--------------|------------|-------------|--------|----------------|
| **Intitulé** | ✅ | `formations_catalogue.titre` | OK | - |
| **Objectifs pédagogiques** | ✅ | `formations_catalogue.objectifs` | OK | - |
| **Contenu détaillé** | ✅ | `formations_catalogue.programme` | OK | - |
| **Durée** | ✅ | `formations_catalogue.duree` | OK | - |
| **Public visé** | ❌ | - | **MANQUANT** | Ajouter champ |
| **Prérequis** | ✅ | `formations_catalogue.prerequis` | OK | - |
| **Méthodes pédagogiques** | ⚠️ | `formations_catalogue.format` | PARTIEL | Enrichir |
| **Moyens pédagogiques** | ❌ | - | **MANQUANT** | Ajouter champ |
| **Modalités d'évaluation** | ❌ | - | **MANQUANT** | Ajouter champ |
| **Formateur(s)** | ⚠️ | `sessions_formation.formateur` | PARTIEL | Enrichir |
| **Accessibilité handicap** | ❌ | - | **MANQUANT** | Ajouter champ |

**Score : 5/11 champs disponibles (45%)**

---

### 3️⃣ CONVOCATION

| Champ Requis | Disponible | Table/Champ | Statut | Action Requise |
|--------------|------------|-------------|--------|----------------|
| **Nom du stagiaire** | ✅ | `participants.nom/prenom` | OK | - |
| **Intitulé de la formation** | ✅ | `formations_catalogue.titre` | OK | - |
| **Dates** | ✅ | `sessions_formation.date_debut/date_fin` | OK | - |
| **Horaires** | ❌ | - | **MANQUANT** | Ajouter champ |
| **Lieu** | ✅ | `sessions_formation.lieu` | OK | - |
| **Durée** | ✅ | `formations_catalogue.duree` | OK | - |
| **Nom du formateur** | ⚠️ | `sessions_formation.formateur` | PARTIEL | Enrichir |
| **Contact organisme** | ❌ | - | **MANQUANT** | Ajouter table |

**Score : 5/8 champs disponibles (62%)**

---

### 4️⃣ FEUILLE D'ÉMARGEMENT

| Champ Requis | Disponible | Table/Champ | Statut | Action Requise |
|--------------|------------|-------------|--------|----------------|
| **Intitulé de la formation** | ✅ | `formations_catalogue.titre` | OK | - |
| **Date de la session** | ✅ | `sessions_formation.date_debut` | OK | - |
| **Horaires (matin/après-midi)** | ❌ | - | **MANQUANT** | Ajouter champ |
| **Liste des stagiaires** | ✅ | `participants.*` | OK | - |
| **Signature stagiaires** | ❌ | - | **MANQUANT** | Signature électronique |
| **Signature formateur** | ❌ | - | **MANQUANT** | Signature électronique |
| **Présence** | ✅ | `participants.present` | OK | - |

**Score : 4/7 champs disponibles (57%)**

---

### 5️⃣ ATTESTATION DE RÉALISATION / CERTIFICAT

| Champ Requis | Disponible | Table/Champ | Statut | Action Requise |
|--------------|------------|-------------|--------|----------------|
| **Nom du stagiaire** | ✅ | `participants.nom/prenom` | OK | - |
| **Intitulé de la formation** | ✅ | `formations_catalogue.titre` | OK | - |
| **Objectifs** | ✅ | `formations_catalogue.objectifs` | OK | - |
| **Durée** | ✅ | `formations_catalogue.duree` | OK | - |
| **Dates de réalisation** | ✅ | `sessions_formation.date_debut/date_fin` | OK | - |
| **Nom de l'organisme** | ❌ | - | **MANQUANT** | Ajouter table |
| **N° de déclaration d'activité** | ❌ | - | **MANQUANT** | Ajouter table |
| **Signature organisme** | ❌ | - | **MANQUANT** | Signature électronique |
| **Date d'émission** | ✅ | `documents.created_at` | OK | - |

**Score : 6/9 champs disponibles (67%)**

---

### 6️⃣ ÉVALUATION DE LA FORMATION

| Champ Requis | Disponible | Table/Champ | Statut | Action Requise |
|--------------|------------|-------------|--------|----------------|
| **Nom du stagiaire** | ✅ | `participants.nom/prenom` | OK | - |
| **Intitulé de la formation** | ✅ | `formations_catalogue.titre` | OK | - |
| **Date de la formation** | ✅ | `sessions_formation.date_debut` | OK | - |
| **Évaluation à chaud** | ❌ | - | **MANQUANT** | Nouvelle table |
| **Évaluation à froid** | ❌ | - | **MANQUANT** | Nouvelle table |
| **Satisfaction globale** | ❌ | - | **MANQUANT** | Nouvelle table |
| **Atteinte des objectifs** | ❌ | - | **MANQUANT** | Nouvelle table |
| **Qualité du formateur** | ❌ | - | **MANQUANT** | Nouvelle table |
| **Qualité des supports** | ❌ | - | **MANQUANT** | Nouvelle table |

**Score : 3/9 champs disponibles (33%)**

---

## 🚨 Champs Manquants Critiques

### Priorité 1 (OBLIGATOIRE pour Qualiopi)

1. **Table `organisme_formation`**
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

2. **Champs à ajouter dans `entreprises`**
   ```sql
   ALTER TABLE entreprises ADD COLUMN representant_legal_nom VARCHAR(255);
   ALTER TABLE entreprises ADD COLUMN representant_legal_fonction VARCHAR(100);
   ALTER TABLE entreprises ADD COLUMN representant_legal_email VARCHAR(255);
   ```

3. **Champs à ajouter dans `formations_catalogue`**
   ```sql
   ALTER TABLE formations_catalogue ADD COLUMN nature_action VARCHAR(100); -- Formation, Bilan, VAE, Apprentissage
   ALTER TABLE formations_catalogue ADD COLUMN public_vise TEXT;
   ALTER TABLE formations_catalogue ADD COLUMN methodes_pedagogiques TEXT;
   ALTER TABLE formations_catalogue ADD COLUMN moyens_pedagogiques TEXT;
   ALTER TABLE formations_catalogue ADD COLUMN modalites_evaluation TEXT;
   ALTER TABLE formations_catalogue ADD COLUMN accessibilite_handicap TEXT;
   ALTER TABLE formations_catalogue ADD COLUMN modalites_acces TEXT;
   ALTER TABLE formations_catalogue ADD COLUMN delai_acces VARCHAR(100);
   ```

4. **Champs à ajouter dans `sessions_formation`**
   ```sql
   ALTER TABLE sessions_formation ADD COLUMN horaire_debut TIME;
   ALTER TABLE sessions_formation ADD COLUMN horaire_fin TIME;
   ALTER TABLE sessions_formation ADD COLUMN horaire_pause_debut TIME;
   ALTER TABLE sessions_formation ADD COLUMN horaire_pause_fin TIME;
   ALTER TABLE sessions_formation ADD COLUMN modalites_reglement TEXT;
   ALTER TABLE sessions_formation ADD COLUMN conditions_annulation TEXT;
   ALTER TABLE sessions_formation ADD COLUMN numero_convention VARCHAR(50);
   ALTER TABLE sessions_formation ADD COLUMN date_signature_convention DATE;
   ```

5. **Table `formateurs`** (au lieu d'un simple VARCHAR)
   ```sql
   CREATE TABLE formateurs (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       nom VARCHAR(100) NOT NULL,
       prenom VARCHAR(100) NOT NULL,
       email VARCHAR(255),
       telephone VARCHAR(20),
       specialites TEXT[],
       cv_path TEXT,
       diplomes TEXT,
       experience TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Puis modifier sessions_formation
   ALTER TABLE sessions_formation DROP COLUMN formateur;
   ALTER TABLE sessions_formation ADD COLUMN formateur_id UUID REFERENCES formateurs(id);
   ```

### Priorité 2 (Fortement Recommandé)

6. **Table `evaluations`**
   ```sql
   CREATE TABLE evaluations (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       session_formation_id UUID NOT NULL REFERENCES sessions_formation(id),
       participant_id UUID NOT NULL REFERENCES participants(id),
       type VARCHAR(50) NOT NULL, -- 'a_chaud', 'a_froid'
       satisfaction_globale INTEGER CHECK (satisfaction_globale BETWEEN 1 AND 5),
       atteinte_objectifs INTEGER CHECK (atteinte_objectifs BETWEEN 1 AND 5),
       qualite_formateur INTEGER CHECK (qualite_formateur BETWEEN 1 AND 5),
       qualite_supports INTEGER CHECK (qualite_supports BETWEEN 1 AND 5),
       qualite_organisation INTEGER CHECK (qualite_organisation BETWEEN 1 AND 5),
       commentaires TEXT,
       recommandation BOOLEAN,
       date_evaluation DATE,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

7. **Table `emargements`** (Feuilles d'émargement)
   ```sql
   CREATE TABLE emargements (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       session_formation_id UUID NOT NULL REFERENCES sessions_formation(id),
       participant_id UUID NOT NULL REFERENCES participants(id),
       date_emargement DATE NOT NULL,
       periode VARCHAR(20) NOT NULL, -- 'matin', 'apres-midi'
       signature_stagiaire_path TEXT, -- Chemin vers la signature
       signature_formateur_path TEXT,
       present BOOLEAN DEFAULT TRUE,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

---

## 📊 Score Global de Conformité

| Document | Score Actuel | Score Cible | Conformité |
|----------|--------------|-------------|------------|
| Convention de Formation | 47% | 100% | ❌ NON CONFORME |
| Programme de Formation | 45% | 100% | ❌ NON CONFORME |
| Convocation | 62% | 100% | ⚠️ PARTIEL |
| Feuille d'Émargement | 57% | 100% | ⚠️ PARTIEL |
| Attestation/Certificat | 67% | 100% | ⚠️ PARTIEL |
| Évaluation | 33% | 100% | ❌ NON CONFORME |

**Score Global : 52% de conformité**

---

## 🎯 Plan d'Action pour Conformité Qualiopi

### Phase 1 : Fondations (Priorité Critique)

**Durée estimée : 2-3 jours**

- [ ] Créer la table `organisme_formation`
- [ ] Ajouter les champs manquants dans `entreprises`
- [ ] Ajouter les champs manquants dans `formations_catalogue`
- [ ] Ajouter les champs manquants dans `sessions_formation`
- [ ] Créer la table `formateurs`

### Phase 2 : Évaluations et Émargements

**Durée estimée : 1-2 jours**

- [ ] Créer la table `evaluations`
- [ ] Créer la table `emargements`
- [ ] Implémenter la signature électronique

### Phase 3 : Génération des Documents

**Durée estimée : 3-4 jours**

- [ ] Template Convention de Formation
- [ ] Template Programme de Formation
- [ ] Template Convocation (améliorer l'existant)
- [ ] Template Feuille d'Émargement
- [ ] Template Attestation/Certificat (améliorer l'existant)
- [ ] Template Évaluation (formulaire)

### Phase 4 : Automatisation

**Durée estimée : 2-3 jours**

- [ ] Workflow génération automatique des documents
- [ ] Envoi automatique par email
- [ ] Rappels automatiques pour les évaluations
- [ ] Archivage automatique

---

## 💡 Recommandations

### 1. Utiliser un LLM pour les Textes Légaux

Les documents Qualiopi contiennent beaucoup de **textes légaux standardisés** :

```python
# Exemple avec Claude pour générer les clauses légales
def generer_clauses_legales(type_document):
    prompt = f"""Génère les clauses légales obligatoires pour un document 
    de type '{type_document}' conforme au référentiel Qualiopi.
    
    Inclus :
    - Délai de rétractation (10 jours)
    - Conditions d'annulation
    - Protection des données (RGPD)
    - Accessibilité handicap
    """
    
    return llm.generate(prompt)
```

### 2. Templates Dynamiques avec Jinja2

```python
from jinja2 import Template

template = Template("""
CONVENTION DE FORMATION PROFESSIONNELLE

Entre :
{{ organisme.nom }}, organisme de formation
SIRET : {{ organisme.siret }}
N° de déclaration d'activité : {{ organisme.nda }}

Et :
{{ entreprise.nom }}
SIRET : {{ entreprise.siret }}
Représenté par {{ entreprise.representant_legal_nom }}

...
""")

pdf = template.render(organisme=organisme, entreprise=entreprise)
```

### 3. Signature Électronique

Intégrer un service comme :
- **DocuSign**
- **HelloSign**
- **Yousign** (français)

---

## 📚 Ressources

- [Référentiel Qualiopi Officiel](https://travail-emploi.gouv.fr/formation-professionnelle/acteurs-cadre-et-qualite-de-la-formation-professionnelle/article/qualiopi-marque-de-certification-qualite-des-prestataires-de-formation)
- [Guide des Documents Obligatoires](https://www.centre-inffo.fr/)
- [Modèles de Documents Qualiopi](https://www.qualiopi.fr/)

---

## ✅ Checklist de Mise en Conformité

- [ ] Toutes les tables créées
- [ ] Tous les champs ajoutés
- [ ] Templates de documents créés
- [ ] Génération automatique testée
- [ ] Signatures électroniques fonctionnelles
- [ ] Archivage des documents conforme
- [ ] Audit interne réalisé
- [ ] Formation des utilisateurs

---

**Voulez-vous que je génère les scripts SQL pour créer toutes les tables et champs manquants ?**
