# Récapitulatif des Variables par Document

Ce document liste toutes les variables disponibles pour chaque type de document.

---

## 📋 Variables Communes (Tous les documents)

### Organisme de Formation
- `{{organisme_nom}}` - Nom de l'organisme
- `{{organisme_raison_sociale}}` - Raison sociale
- `{{organisme_siret}}` - Numéro SIRET
- `{{organisme_nda}}` - Numéro de déclaration d'activité
- `{{organisme_adresse}}` - Adresse complète
- `{{organisme_code_postal}}` - Code postal
- `{{organisme_ville}}` - Ville
- `{{organisme_email}}` - Email de contact
- `{{organisme_telephone}}` - Téléphone
- `{{organisme_representant_nom}}` - Nom du représentant légal
- `{{organisme_representant_fonction}}` - Fonction du représentant

### Entreprise Cliente
- `{{entreprise_nom}}` - Nom de l'entreprise
- `{{entreprise_siret}}` - SIRET de l'entreprise
- `{{entreprise_code_ape}}` - Code APE/NAF
- `{{entreprise_adresse}}` - Adresse
- `{{entreprise_code_postal}}` - Code postal
- `{{entreprise_ville}}` - Ville
- `{{entreprise_email}}` - Email
- `{{entreprise_telephone}}` - Téléphone
- `{{entreprise_effectif}}` - Nombre de salariés
- `{{entreprise_secteur_activite}}` - Secteur d'activité
- `{{entreprise_representant_nom}}` - Nom du représentant
- `{{entreprise_representant_fonction}}` - Fonction du représentant
- `{{entreprise_representant_telephone}}` - Téléphone du représentant
- `{{entreprise_representant_email}}` - Email du représentant

### Formation
- `{{formation_titre}}` - Titre de la formation
- `{{formation_description}}` - Description
- `{{formation_duree}}` - Durée en heures
- `{{formation_duree_jours}}` - Durée en jours (calculée automatiquement)
- `{{formation_nature_action}}` - Nature de l'action de formation
- `{{formation_objectifs}}` - Objectifs généraux
- `{{formation_objectifs_pedagogiques}}` - Objectifs pédagogiques détaillés
- `{{formation_prerequis}}` - Prérequis
- `{{formation_programme}}` - Programme détaillé
- `{{formation_methodes}}` - Méthodes pédagogiques
- `{{formation_moyens}}` - Moyens pédagogiques
- `{{formation_public_vise}}` - Public visé
- `{{formation_modalite}}` - Modalité (Présentiel/Distanciel)

### Session
- `{{session_id}}` - ID de la session
- `{{session_numero}}` - Numéro de session
- `{{date_debut}}` - Date de début
- `{{date_fin}}` - Date de fin
- `{{lieu}}` - Lieu de formation
- `{{nombre_participants}}` - Nombre de participants
- `{{horaire_debut}}` - Horaire de début (ex: 09:00)
- `{{horaire_fin}}` - Horaire de fin (ex: 17:00)

### Prix
- `{{prix_unitaire_ht}}` - Prix unitaire HT
- `{{prix_unitaire_ttc}}` - Prix unitaire TTC
- `{{prix_total_ht}}` - Prix total HT
- `{{prix_total_ttc}}` - Prix total TTC
- `{{tva}}` - Montant TVA
- `{{frais_deplacement}}` - Frais de déplacement
- `{{prix_total_avec_frais}}` - Prix total avec frais

### Formateur
- `{{formateur_nom}}` - Nom du formateur
- `{{formateur_prenom}}` - Prénom du formateur
- `{{formateur_nom_complet}}` - Nom complet
- `{{formateur_email}}` - Email
- `{{formateur_telephone}}` - Téléphone

### Dates Système
- `{{date_aujourd_hui}}` - Date du jour
- `{{date_proposition}}` - Date de la proposition
- `{{date_entrevue}}` - Date de l'entrevue
- `{{annee}}` - Année en cours

---

## 📄 Variables par Type de Document

### 1. Convention de Formation
**Variables principales :**
- Toutes les variables communes
- Focus sur : organisme, entreprise, formation, session, prix

**Sections typiques :**
```
ENTRE
{{organisme_raison_sociale}}
SIRET : {{organisme_siret}}
N° de déclaration d'activité : {{organisme_nda}}

ET LE CLIENT
{{entreprise_nom}}
SIRET : {{entreprise_siret}}

ARTICLE 1 - OBJET
Formation "{{formation_titre}}"
Durée : {{formation_duree}} heures
Du {{date_debut}} au {{date_fin}}
Lieu : {{lieu}}

ARTICLE 2 - PRIX
{{prix_total_ht}} HT, soit {{prix_total_ttc}} TTC
```

---

### 2. Proposition de Formation
**Variables principales :**
- Toutes les variables communes
- `{{date_proposition}}` - Date de la proposition
- `{{date_entrevue}}` - Date de l'entrevue
- `{{entreprise_secteur_activite}}` - Secteur d'activité du client
- `{{formation_objectifs_pedagogiques}}` - Objectifs pédagogiques
- `{{formation_methodes}}` - Méthodes pédagogiques
- `{{formation_moyens}}` - Moyens pédagogiques
- `{{frais_deplacement}}` - Frais de déplacement
- `{{prix_total_avec_frais}}` - Prix total avec frais

**Sections typiques :**
```
I - CONTEXTE
{{entreprise_nom}}
{{entreprise_secteur_activite}}

II - VOTRE DEMANDE
Formation "{{formation_titre}}"

III - NOTRE PROPOSITION
Suite à notre entrevue du {{date_entrevue}}

IV - DISPOSITIF
Objectifs : {{formation_objectifs}}
Public : {{formation_public_vise}}
Prérequis : {{formation_prerequis}}

VII - ORGANISATION
Durée : {{formation_duree}} heures ({{formation_duree_jours}} jours)
Dates : Du {{date_debut}} au {{date_fin}}
Lieu : {{lieu}}
Formateur : {{formateur_nom_complet}}

IX - PRIX
Total HT : {{prix_total_ht}}
TVA : {{tva}}
Total TTC : {{prix_total_ttc}}
Frais déplacement : {{frais_deplacement}}
Total avec frais : {{prix_total_avec_frais}}
```

---

### 3. Programme de Formation
**Variables principales :**
- `{{formation_titre}}` - Titre
- `{{formation_description}}` - Description
- `{{formation_duree}}` - Durée
- `{{formation_objectifs}}` - Objectifs
- `{{formation_programme}}` - Programme détaillé
- `{{formation_prerequis}}` - Prérequis
- `{{formation_public_vise}}` - Public
- `{{formation_modalite}}` - Modalité
- `{{organisme_nom}}` - Organisme
- `{{organisme_nda}}` - NDA

---

### 4. Convocation
**Variables principales :**
- `{{participant_civilite}}` - Civilité (M./Mme)
- `{{participant_nom}}` - Nom
- `{{participant_prenom}}` - Prénom
- `{{participant_fonction}}` - Fonction
- `{{entreprise_nom}}` - Entreprise
- `{{formation_titre}}` - Formation
- `{{date_debut}}` - Date début
- `{{date_fin}}` - Date fin
- `{{horaire_debut}}` - Horaire début
- `{{horaire_fin}}` - Horaire fin
- `{{lieu}}` - Lieu
- `{{organisme_ville}}` - Ville organisme
- `{{date_aujourd_hui}}` - Date du jour

**Exemple :**
```
{{organisme_ville}}, le {{date_aujourd_hui}}

{{participant_civilite}} {{participant_prenom}} {{participant_nom}}
{{participant_fonction}}
{{entreprise_nom}}

Formation : {{formation_titre}}
Dates : Du {{date_debut}} au {{date_fin}}
Horaires : De {{horaire_debut}} à {{horaire_fin}}
Lieu : {{lieu}}
```

---

### 5. Certificat de Réalisation
**Variables principales :**
- `{{organisme_representant_nom}}` - Représentant
- `{{organisme_nom}}` - Organisme
- `{{participant_civilite}}` - Civilité
- `{{participant_nom}}` - Nom
- `{{participant_prenom}}` - Prénom
- `{{entreprise_nom}}` - Entreprise
- `{{formation_titre}}` - Formation
- `{{formation_nature_action}}` - Nature de l'action
- `{{date_debut}}` - Date début
- `{{date_fin}}` - Date fin
- `{{formation_duree}}` - Durée en heures
- `{{formation_duree_jours}}` - Durée en jours
- `{{lieu}}` - Lieu
- `{{date_aujourd_hui}}` - Date

**Exemple :**
```
Je soussigné {{organisme_representant_nom}}, 
représentant légal de {{organisme_nom}}, atteste que :

{{participant_civilite}} {{participant_prenom}} {{participant_nom}}
salarié(e) de {{entreprise_nom}}

a suivi la formation : "{{formation_titre}}"

Nature : {{formation_nature_action}}

Du {{date_debut}} au {{date_fin}}
Durée : {{formation_duree}} heures, soit {{formation_duree_jours}} jour(s)

Lieu : {{lieu}}

Fait à {{lieu}}, le {{date_aujourd_hui}}
```

---

### 6. Bulletin d'Inscription
**Variables principales :**
- Organisme : nom, adresse, code postal, ville, téléphone, email
- Formation : titre, dates
- Participant : nom, prénom, fonction
- Entreprise : toutes les infos (nom, SIRET, APE, adresse, email, téléphone, effectif)
- `{{opca_nom}}` - Nom de l'OPCA
- `{{entreprise_representant_nom}}` - Signataire
- `{{entreprise_representant_fonction}}` - Fonction signataire
- `{{entreprise_representant_telephone}}` - Téléphone signataire
- `{{entreprise_representant_email}}` - Email signataire
- Prix : unitaire HT et TTC

**Sections :**
```
A retourner à {{organisme_nom}}, {{organisme_adresse}}
{{organisme_code_postal}} {{organisme_ville}}
Tél : {{organisme_telephone}} – Courriel : {{organisme_email}}

FORMATION : {{formation_titre}}
Date : Du {{date_debut}} au {{date_fin}}

PARTICIPANT
Nom : {{participant_nom}}
Prénom : {{participant_prenom}}
Fonction : {{participant_fonction}}

ENTREPRISE
Nom : {{entreprise_nom}}
SIRET : {{entreprise_siret}}
Code APE : {{entreprise_code_ape}}
Téléphone : {{entreprise_telephone}}
Adresse : {{entreprise_adresse}}, {{entreprise_code_postal}} {{entreprise_ville}}
Email : {{entreprise_email}}
Effectif : {{entreprise_effectif}}

OPCA : {{opca_nom}}

SIGNATAIRE
Nom : {{entreprise_representant_nom}}
Fonction : {{entreprise_representant_fonction}}
Téléphone : {{entreprise_representant_telephone}}
Email : {{entreprise_representant_email}}

PRIX
Prix : {{prix_unitaire_ht}} soit {{prix_unitaire_ttc}} par personne
```

---

### 7. Feuille d'Émargement Entreprise
**Variables principales :**
- `{{organisme_nom}}` - Organisme
- `{{entreprise_nom}}` - Entreprise
- `{{formation_titre}}` - Formation
- `{{date_debut}}` - Date début
- `{{date_fin}}` - Date fin
- `{{lieu}}` - Lieu
- `{{formateur_nom_complet}}` - Formateur

---

### 8. Feuille d'Émargement Individuelle
**Variables principales :**
- `{{organisme_nom}}` - Organisme
- `{{participant_nom}}` - Nom
- `{{participant_prenom}}` - Prénom
- `{{formation_titre}}` - Formation
- `{{date_debut}}` - Date
- `{{horaire_debut}}` - Horaire début
- `{{horaire_fin}}` - Horaire fin
- `{{formateur_nom_complet}}` - Formateur

---

### 9. Questionnaire Préalable
**Variables principales :**
- `{{organisme_nom}}` - Organisme
- `{{participant_nom}}` - Nom
- `{{participant_prenom}}` - Prénom
- `{{participant_fonction}}` - Fonction
- `{{entreprise_nom}}` - Entreprise
- `{{formation_titre}}` - Formation
- `{{date_debut}}` - Date

---

### 10. Évaluation à Chaud
**Variables principales :**
- `{{entreprise_nom}}` - Entreprise
- `{{formation_titre}}` - Formation
- `{{date_debut}}` - Date début
- `{{date_fin}}` - Date fin
- `{{participant_prenom}}` - Prénom
- `{{participant_nom}}` - Nom
- `{{formateur_nom_complet}}` - Formateur
- `{{date_aujourd_hui}}` - Date

**Structure :**
```
INFORMATIONS
Entreprise : {{entreprise_nom}}
Formation : {{formation_titre}}
Dates : Du {{date_debut}} au {{date_fin}}
Stagiaire : {{participant_prenom}} {{participant_nom}}
Formateur : {{formateur_nom_complet}}

[Questions d'évaluation 1-10]

Date : {{date_aujourd_hui}}
Signature du stagiaire
```

---

### 11. Évaluation à Froid
**Variables principales :**
- Mêmes que l'évaluation à chaud
- Focus sur l'application des acquis après la formation

---

### 12. Évaluation Satisfaction Client
**Variables principales :**
- `{{organisme_nom}}` - Organisme
- `{{entreprise_nom}}` - Entreprise
- `{{formation_titre}}` - Formation
- `{{date_debut}}` - Date
- `{{formateur_nom_complet}}` - Formateur

---

### 13. Règlement Intérieur
**Variables principales :**
- `{{organisme_nom}}` - Nom de l'organisme
- `{{organisme_adresse}}` - Adresse
- `{{organisme_ville}}` - Ville

---

### 14. Grille MAJ Compétences
**Variables principales :**
- `{{participant_nom}}` - Nom
- `{{participant_prenom}}` - Prénom
- `{{formation_titre}}` - Formation
- `{{date_debut}}` - Date
- `{{entreprise_nom}}` - Entreprise

---

### 15. Contrat Formateur
**Variables principales :**
- `{{organisme_nom}}` - Organisme
- `{{organisme_siret}}` - SIRET
- `{{organisme_representant_nom}}` - Représentant
- `{{formateur_nom_complet}}` - Formateur
- `{{formation_titre}}` - Formation
- `{{date_debut}}` - Date début
- `{{date_fin}}` - Date fin
- `{{formation_duree}}` - Durée
- Prix formateur

---

### 16. Déroulé Pédagogique
**Variables principales :**
- `{{organisme_nom}}` - Organisme
- `{{formation_titre}}` - Formation
- `{{formation_duree}}` - Durée
- `{{formation_objectifs}}` - Objectifs
- `{{formation_programme}}` - Programme
- `{{formateur_nom_complet}}` - Formateur

---

### 17. Questionnaire Formateur
**Variables principales :**
- `{{organisme_nom}}` - Organisme
- `{{formateur_nom_complet}}` - Formateur
- `{{formation_titre}}` - Formation
- `{{date_debut}}` - Date
- `{{entreprise_nom}}` - Entreprise

---

### 18. Évaluation OPCO
**Variables principales :**
- `{{organisme_nom}}` - Organisme
- `{{entreprise_nom}}` - Entreprise
- `{{formation_titre}}` - Formation
- `{{date_debut}}` - Date
- `{{opca_nom}}` - OPCO

---

### 19. Traitement Réclamations
**Variables principales :**
- `{{organisme_nom}}` - Organisme
- `{{organisme_email}}` - Email
- `{{organisme_telephone}}` - Téléphone

---

## 🔧 Variables Calculées Automatiquement

### Durée en jours
```
{{formation_duree_jours}} = {{formation_duree}} / 7
```
Exemple : 14 heures → 2 jours

### Prix TTC
```
{{prix_total_ttc}} = {{prix_total_ht}} * 1.20
{{prix_unitaire_ttc}} = {{prix_unitaire_ht}} * 1.20
```

### TVA
```
{{tva}} = {{prix_total_ht}} * 0.20
```

### Prix avec frais
```
{{prix_total_avec_frais}} = {{prix_total_ttc}} + {{frais_deplacement}}
```

---

## 📝 Notes Importantes

1. **Variables participant** : Disponibles uniquement pour les documents individuels (convocation, certificat, évaluations individuelles, etc.)

2. **Variables formateur** : Remplies automatiquement si un formateur est assigné à la session, sinon "À confirmer"

3. **Valeurs par défaut** :
   - `{{formation_prerequis}}` : "Aucun"
   - `{{formation_public_vise}}` : "Tout public"
   - `{{formation_modalite}}` : "Présentiel"
   - `{{horaire_debut}}` : "09:00"
   - `{{horaire_fin}}` : "17:00"

4. **Format des dates** : DD/MM/YYYY (ex: 27/10/2024)

5. **Format des prix** : Avec séparateur de milliers et € (ex: 2 400,00 €)

---

## 🚀 Utilisation

Pour utiliser ces variables dans vos templates Word :
1. Ouvrez le template
2. Remplacez le texte par la variable correspondante
3. Exemple : "Jean MARTIN" → `{{participant_nom}}`
4. Sauvegardez le template

Le système remplacera automatiquement toutes les variables lors de la génération du document.
