# 📄 Guide de Génération de Documents

**Date** : 27 octobre 2025  
**Version** : 1.0

---

## 🎯 Vue d'ensemble

Le système de génération de documents utilise les **modèles Word existants** dans le dossier `Dossier exemple/` et remplace automatiquement les variables par les données réelles de la session et des participants.

---

## 🔧 Installation

### 1. Vérifier les dépendances Python

```bash
pip install -r requirements.txt
```

Les packages nécessaires :
- `python-docx` - Manipulation de fichiers Word
- `supabase` - Connexion à la base de données
- `python-dotenv` - Variables d'environnement

### 2. Configurer les variables d'environnement

Assurez-vous que votre fichier `.env` contient :

```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre_cle_api
```

---

## 📋 Variables disponibles dans les templates

Les templates Word peuvent utiliser les variables suivantes (format `{{nom_variable}}`) :

### Organisme de formation
- `{{organisme_nom}}`
- `{{organisme_raison_sociale}}`
- `{{organisme_siret}}`
- `{{organisme_nda}}` - Numéro de déclaration d'activité
- `{{organisme_adresse}}`
- `{{organisme_code_postal}}`
- `{{organisme_ville}}`
- `{{organisme_email}}`
- `{{organisme_telephone}}`
- `{{organisme_representant_nom}}`
- `{{organisme_representant_fonction}}`

### Entreprise cliente
- `{{entreprise_nom}}`
- `{{entreprise_siret}}`
- `{{entreprise_adresse}}`
- `{{entreprise_code_postal}}`
- `{{entreprise_ville}}`
- `{{entreprise_email}}`
- `{{entreprise_telephone}}`

### Formation
- `{{formation_titre}}`
- `{{formation_description}}`
- `{{formation_duree}}` - En heures
- `{{formation_objectifs}}`
- `{{formation_prerequis}}`
- `{{formation_programme}}`
- `{{formation_public_vise}}`
- `{{formation_modalite}}` - Présentiel/Distanciel/Mixte

### Session
- `{{session_id}}`
- `{{session_numero}}`
- `{{date_debut}}` - Format DD/MM/YYYY
- `{{date_fin}}` - Format DD/MM/YYYY
- `{{lieu}}`
- `{{nombre_participants}}`
- `{{horaire_debut}}` - Ex: 09:00
- `{{horaire_fin}}` - Ex: 17:00

### Prix
- `{{prix_unitaire_ht}}`
- `{{prix_total_ht}}`
- `{{prix_total_ttc}}`
- `{{tva}}`

### Formateur
- `{{formateur_nom}}`
- `{{formateur_prenom}}`
- `{{formateur_nom_complet}}`
- `{{formateur_email}}`
- `{{formateur_telephone}}`

### Participant (si applicable)
- `{{participant_nom}}`
- `{{participant_prenom}}`
- `{{participant_nom_complet}}`
- `{{participant_email}}`
- `{{participant_telephone}}`
- `{{participant_fonction}}`

### Dates système
- `{{date_aujourd_hui}}` - Date actuelle
- `{{annee}}` - Année actuelle

---

## 🚀 Utilisation via API

### 1. Générer un document spécifique

```bash
POST /api/documents/generate/:documentType
Content-Type: application/json

{
  "sessionId": "uuid-de-la-session",
  "participantId": "uuid-du-participant" // Optionnel selon le type
}
```

**Types de documents disponibles** :
- `convention` - Convention de formation
- `programme` - Programme de formation
- `proposition` - Proposition de formation
- `convocation` - Convocation (requiert participantId)
- `certificat` - Certificat de réalisation (requiert participantId)
- `emargement_entreprise` - Feuille d'émargement entreprise
- `emargement_individuel` - Feuille d'émargement individuelle (requiert participantId)
- `questionnaire_prealable` - Questionnaire préalable (requiert participantId)
- `evaluation_chaud` - Évaluation à chaud (requiert participantId)
- `evaluation_froid` - Évaluation à froid (requiert participantId)
- `evaluation_client` - Évaluation satisfaction client
- `reglement_interieur` - Règlement intérieur
- `bulletin_inscription` - Bulletin d'inscription (requiert participantId)
- `grille_competences` - Grille de MAJ des compétences (requiert participantId)
- `contrat_formateur` - Contrat formateur
- `deroule_pedagogique` - Déroulé pédagogique
- `questionnaire_formateur` - Questionnaire formateur
- `evaluation_opco` - Évaluation OPCO
- `traitement_reclamations` - Traitement des réclamations

**Exemple** :
```bash
curl -X POST http://localhost:3001/api/documents/generate/convention \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "abc-123"}'
```

### 2. Générer tous les documents d'une session

```bash
POST /api/documents/generate-all/:sessionId
```

**Exemple** :
```bash
curl -X POST http://localhost:3001/api/documents/generate-all/abc-123
```

### 3. Télécharger un document généré

```bash
GET /api/documents/download/:filename
```

**Exemple** :
```bash
curl -O http://localhost:3001/api/documents/download/convention_formation_abc-123.docx
```

---

## 💻 Utilisation via Python

### 1. Utilisation directe

```python
from supabase import create_client
from services.templateDocumentGenerator import TemplateDocumentGenerator
import os

# Connexion Supabase
supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_KEY')
)

# Créer le générateur
generator = TemplateDocumentGenerator(supabase)

# Générer un document
session_id = "abc-123"
participant_id = "def-456"

# Convention
file_path = generator.generer_convention(session_id)
print(f"Convention générée : {file_path}")

# Convocation pour un participant
file_path = generator.generer_convocation(session_id, participant_id)
print(f"Convocation générée : {file_path}")

# Tous les documents
documents = generator.generer_tous_documents_session(session_id)
print(f"Documents générés : {documents}")
```

### 2. Via le script CLI

```bash
# Générer une convention
python generate_documents_cli.py generer_convention abc-123

# Générer une convocation
python generate_documents_cli.py generer_convocation abc-123 def-456

# Générer tous les documents
python generate_documents_cli.py generer_tous_documents_session abc-123
```

---

## 📝 Modifier les templates Word

### 1. Ouvrir le template

Les templates sont dans `Dossier exemple/`. Par exemple :
- `Modèle de convention simplifiée de formation 2020.docx`

### 2. Ajouter des variables

Insérez les variables au format `{{nom_variable}}` directement dans le texte.

**Exemple** :
```
La formation {{formation_titre}} se déroulera du {{date_debut}} au {{date_fin}}
à {{lieu}} pour {{nombre_participants}} participants.
```

### 3. Sauvegarder

Sauvegardez le template dans le dossier `Dossier exemple/`.

### 4. Tester

Générez un document pour vérifier que les variables sont bien remplacées.

---

## 🔍 Dépannage

### Erreur : "Template non trouvé"

**Cause** : Le fichier template n'existe pas dans `Dossier exemple/`

**Solution** : Vérifiez que le nom du fichier est exact (avec espaces et accents)

### Erreur : "Session non trouvée"

**Cause** : L'ID de session n'existe pas dans Supabase

**Solution** : Vérifiez l'ID de la session dans la base de données

### Variables non remplacées

**Cause** : Le nom de la variable ne correspond pas exactement

**Solution** : Vérifiez l'orthographe exacte avec les accolades `{{variable}}`

### Erreur Python : "Module not found"

**Cause** : Dépendances Python manquantes

**Solution** :
```bash
pip install -r requirements.txt
```

---

## 📊 Workflow complet

### Phase 1 : Demande de formation
1. Client soumet le formulaire
2. Session créée avec statut `demande`

### Phase 2 : Proposition commerciale
1. OF valide la demande
2. **Générer** : Proposition + Programme
3. Envoyer par email au client

### Phase 3 : Signature convention
1. Client accepte la proposition
2. **Générer** : Convention
3. Envoyer via DocuSeal pour signature

### Phase 4 : Convocations (J-4)
1. **Générer** : Convocations + Règlement intérieur + Émargements
2. Envoyer par email aux participants

### Phase 5 : Formation (Jour J)
1. Utiliser les feuilles d'émargement générées
2. Upload des documents signés

### Phase 6 : Clôture (J+2)
1. **Générer** : Certificats + Évaluations
2. Envoyer par email

---

## 🎯 Prochaines étapes

- [ ] Intégration avec Supabase Storage (upload automatique)
- [ ] Conversion automatique Word → PDF
- [ ] Envoi automatique par email via Resend
- [ ] Interface dashboard pour générer les documents
- [ ] Prévisualisation des documents avant génération

---

## 📞 Support

Pour toute question :
- Consulter les logs : `generated_documents/`
- Vérifier les variables d'environnement : `.env`
- Tester avec le script CLI : `generate_documents_cli.py`

---

**Document créé le 27 octobre 2025**
