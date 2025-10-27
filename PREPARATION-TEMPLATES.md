# 📝 Préparation des Templates Word

**Guide pour préparer les modèles Word avec les variables**

---

## 🎯 Objectif

Transformer les modèles Word existants en templates dynamiques en remplaçant les valeurs fixes par des variables.

---

## 📋 Étapes de préparation

### 1. Ouvrir le modèle Word

Exemple : `Modèle de convention simplifiée de formation 2020.docx`

### 2. Identifier les valeurs à remplacer

Cherchez les informations qui changent selon la session :
- Noms (organisme, entreprise, participant)
- Dates
- Prix
- Adresses
- Etc.

### 3. Remplacer par des variables

**Format** : `{{nom_variable}}`

**Exemple AVANT** :
```
La société ACME CORP, située au 123 Rue de la Paix, 75001 Paris,
représentée par M. Jean DUPONT, Directeur Général...
```

**Exemple APRÈS** :
```
La société {{entreprise_nom}}, située au {{entreprise_adresse}}, {{entreprise_code_postal}} {{entreprise_ville}},
représentée par {{entreprise_representant_nom}}, {{entreprise_representant_fonction}}...
```

---

## 📝 Exemples de remplacement par document

### Convention de formation

**Texte original** :
```
CONVENTION DE FORMATION PROFESSIONNELLE

ENTRE LES SOUSSIGNÉS :

L'ORGANISME DE FORMATION
Aladé Conseil
SIRET : 12345678900012
N° de déclaration d'activité : 11 75 12345 75
Adresse : 10 Rue Example, 75001 Paris
Représenté par : Marie MARTIN, Gérante

ET

LE CLIENT
Entreprise ABC
SIRET : 98765432100098
Adresse : 50 Avenue Test, 69001 Lyon
Représenté par : Pierre DURAND, Directeur

IL A ÉTÉ CONVENU CE QUI SUIT :

ARTICLE 1 - OBJET
La présente convention a pour objet la réalisation d'une formation "Excel Avancé"
d'une durée de 14 heures, du 15/01/2025 au 16/01/2025, à Lyon.

ARTICLE 2 - PRIX
Le coût total s'élève à 1 400,00 € HT, soit 1 680,00 € TTC.
```

**Texte avec variables** :
```
CONVENTION DE FORMATION PROFESSIONNELLE

ENTRE LES SOUSSIGNÉS :

L'ORGANISME DE FORMATION
{{organisme_raison_sociale}}
SIRET : {{organisme_siret}}
N° de déclaration d'activité : {{organisme_nda}}
Adresse : {{organisme_adresse}}, {{organisme_code_postal}} {{organisme_ville}}
Représenté par : {{organisme_representant_nom}}, {{organisme_representant_fonction}}

ET

LE CLIENT
{{entreprise_nom}}
SIRET : {{entreprise_siret}}
Adresse : {{entreprise_adresse}}, {{entreprise_code_postal}} {{entreprise_ville}}
Représenté par : {{entreprise_representant_nom}}, {{entreprise_representant_fonction}}

IL A ÉTÉ CONVENU CE QUI SUIT :

ARTICLE 1 - OBJET
La présente convention a pour objet la réalisation d'une formation "{{formation_titre}}"
d'une durée de {{formation_duree}} heures, du {{date_debut}} au {{date_fin}}, à {{lieu}}.

ARTICLE 2 - PRIX
Le coût total s'élève à {{prix_total_ht}}, soit {{prix_total_ttc}}.
```

### Convocation

**Texte original** :
```
CONVOCATION À UNE FORMATION

Madame, Monsieur Jean MARTIN
Responsable Commercial
Entreprise XYZ

Nous avons le plaisir de vous convoquer à la formation suivante :

Formation : PowerPoint Perfectionnement
Dates : Du 20/02/2025 au 21/02/2025
Horaires : De 09:00 à 17:00
Durée : 14 heures
Lieu : 15 Rue de la Formation, 75008 Paris
Formateur : Sophie BERNARD

Merci de vous présenter 15 minutes avant le début.

Cordialement,
Marie MARTIN
Gérante
```

**Texte avec variables** :
```
CONVOCATION À UNE FORMATION

{{participant_prenom}} {{participant_nom}}
{{participant_fonction}}
{{entreprise_nom}}

Nous avons le plaisir de vous convoquer à la formation suivante :

Formation : {{formation_titre}}
Dates : Du {{date_debut}} au {{date_fin}}
Horaires : De {{horaire_debut}} à {{horaire_fin}}
Durée : {{formation_duree}} heures
Lieu : {{lieu}}
Formateur : {{formateur_nom_complet}}

Merci de vous présenter 15 minutes avant le début.

Cordialement,
{{organisme_representant_nom}}
{{organisme_representant_fonction}}
```

### Certificat de réalisation

**Texte original** :
```
CERTIFICAT DE RÉALISATION

Aladé Conseil
Organisme de formation enregistré sous le numéro 11 75 12345 75
SIRET : 12345678900012

CERTIFIE QUE

Monsieur Paul DUBOIS
Chef de Projet
Entreprise TEST

A SUIVI LA FORMATION

"Gestion de Projet Agile"

D'une durée de 21 heures
Du 10/03/2025 au 12/03/2025
À Paris

Fait à Paris, le 12/03/2025

Marie MARTIN
Gérante
```

**Texte avec variables** :
```
CERTIFICAT DE RÉALISATION

{{organisme_raison_sociale}}
Organisme de formation enregistré sous le numéro {{organisme_nda}}
SIRET : {{organisme_siret}}

CERTIFIE QUE

{{participant_prenom}} {{participant_nom}}
{{participant_fonction}}
{{entreprise_nom}}

A SUIVI LA FORMATION

"{{formation_titre}}"

D'une durée de {{formation_duree}} heures
Du {{date_debut}} au {{date_fin}}
À {{lieu}}

Fait à {{organisme_ville}}, le {{date_aujourd_hui}}

{{organisme_representant_nom}}
{{organisme_representant_fonction}}
```

---

## ✅ Checklist de préparation

Pour chaque template Word :

- [ ] Ouvrir le fichier dans Microsoft Word
- [ ] Activer "Afficher les marques de paragraphe" (¶)
- [ ] Identifier toutes les valeurs à remplacer
- [ ] Remplacer par les variables correspondantes
- [ ] Vérifier l'orthographe des variables (sensible à la casse)
- [ ] Tester avec le script de génération
- [ ] Vérifier le rendu du document généré
- [ ] Sauvegarder le template

---

## 🎨 Conseils de mise en forme

### 1. Conserver la mise en forme

Les variables héritent de la mise en forme du texte :
- **Gras** : `**{{variable}}**` → Mettre la variable en gras dans Word
- *Italique* : `*{{variable}}*` → Mettre la variable en italique
- Couleur : Appliquer la couleur à la variable

### 2. Tableaux

Les variables fonctionnent aussi dans les tableaux :

| Champ | Valeur |
|-------|--------|
| Entreprise | `{{entreprise_nom}}` |
| SIRET | `{{entreprise_siret}}` |

### 3. En-têtes et pieds de page

Les variables sont remplacées partout, y compris :
- En-têtes
- Pieds de page
- Notes de bas de page

---

## 🔍 Variables les plus utilisées

### Top 10 des variables essentielles

1. `{{formation_titre}}` - Titre de la formation
2. `{{entreprise_nom}}` - Nom de l'entreprise cliente
3. `{{participant_nom_complet}}` - Nom complet du participant
4. `{{date_debut}}` - Date de début
5. `{{date_fin}}` - Date de fin
6. `{{lieu}}` - Lieu de la formation
7. `{{formation_duree}}` - Durée en heures
8. `{{prix_total_ht}}` - Prix HT
9. `{{organisme_nom}}` - Nom de l'organisme
10. `{{date_aujourd_hui}}` - Date actuelle

---

## 🚨 Erreurs courantes à éviter

### ❌ Erreur 1 : Espaces dans les accolades
```
Mauvais : {{ formation_titre }}
Correct : {{formation_titre}}
```

### ❌ Erreur 2 : Fautes de frappe
```
Mauvais : {{entreprise_non}}
Correct : {{entreprise_nom}}
```

### ❌ Erreur 3 : Majuscules/minuscules
```
Mauvais : {{Formation_Titre}}
Correct : {{formation_titre}}
```

### ❌ Erreur 4 : Variables inexistantes
```
Mauvais : {{client_nom}} (n'existe pas)
Correct : {{entreprise_nom}}
```

---

## 🧪 Tester un template

### 1. Sauvegarder le template modifié

Dans `Dossier exemple/`

### 2. Lancer le script de test

```bash
python test-document-generation.py
```

### 3. Vérifier le document généré

Ouvrir le fichier dans `generated_documents/`

### 4. Corriger si nécessaire

Si des variables ne sont pas remplacées :
- Vérifier l'orthographe exacte
- Vérifier qu'il n'y a pas d'espaces
- Consulter la liste des variables disponibles

---

## 📚 Liste complète des variables

Voir le fichier `GUIDE-GENERATION-DOCUMENTS.md` pour la liste exhaustive de toutes les variables disponibles.

---

## 💡 Astuces

### Valeurs par défaut

Si une variable n'a pas de valeur dans la base de données, elle sera remplacée par :
- Chaîne vide `""` pour les textes
- `"N/A"` pour certains champs optionnels
- `"À confirmer"` pour le formateur si non assigné

### Formatage automatique

- Les dates sont automatiquement formatées en `DD/MM/YYYY`
- Les prix sont formatés avec 2 décimales et le symbole €
- Les numéros de téléphone sont affichés tels quels

---

## 🎯 Prochaines étapes

Une fois vos templates préparés :

1. Tester la génération avec `test-document-generation.py`
2. Vérifier tous les documents générés
3. Ajuster la mise en forme si nécessaire
4. Intégrer dans le workflow automatique

---

**Document créé le 27 octobre 2025**
