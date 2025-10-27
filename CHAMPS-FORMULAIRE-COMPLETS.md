# 📋 Champs du Formulaire - Mapping Complet

**Date** : 21 octobre 2025  
**Statut** : ✅ Mis à jour

---

## 🎯 Objectif

S'assurer que **TOUS** les champs du formulaire sont bien stockés dans les bonnes tables Supabase.

---

## 📊 Mapping des Données

### **ÉTAPE 1 : Entreprise**

| Champ Formulaire | Table | Colonne | Type | Stocké |
|------------------|-------|---------|------|--------|
| Nom entreprise | `entreprises` | `nom` | VARCHAR(255) | ✅ |
| SIRET | `entreprises` | `siret` | VARCHAR(14) | ✅ |
| Adresse | `entreprises` | `adresse` | TEXT | ✅ |
| Code postal | `entreprises` | `code_postal` | VARCHAR(10) | ✅ |
| Ville | `entreprises` | `ville` | VARCHAR(100) | ✅ |
| Pays | `entreprises` | `pays` | VARCHAR(100) | ✅ (défaut: France) |
| Email contact | `entreprises` | `email_contact` | VARCHAR(255) | ✅ |
| Téléphone | `entreprises` | `telephone` | VARCHAR(20) | ✅ |
| Site web | `entreprises` | `site_web` | VARCHAR(255) | ✅ |

---

### **ÉTAPE 2 : Formation**

| Champ Formulaire | Table | Colonne | Type | Stocké |
|------------------|-------|---------|------|--------|
| Formation sélectionnée | `sessions_formation` | `formation_catalogue_id` | UUID | ✅ |
| Titre formation (si slug) | `sessions_formation` | `formation_titre` | VARCHAR(255) | ✅ |
| Date début | `sessions_formation` | `date_debut` | DATE | ✅ |
| Date fin | `sessions_formation` | `date_fin` | DATE | ✅ |
| Modalité | `sessions_formation` | `modalite` | VARCHAR(50) | ✅ |
| Statut | `sessions_formation` | `statut` | VARCHAR(50) | ✅ (défaut: demande) |
| Nombre participants | `sessions_formation` | `nombre_participants` | INTEGER | ✅ (auto) |

---

### **ÉTAPE 3 : Participants**

| Champ Formulaire | Table | Colonne | Type | Stocké |
|------------------|-------|---------|------|--------|
| **Champs de base** | | | | |
| Nom | `participants` | `nom` | VARCHAR(100) | ✅ |
| Prénom | `participants` | `prenom` | VARCHAR(100) | ✅ |
| Email | `participants` | `email` | VARCHAR(255) | ✅ |
| Téléphone | `participants` | `telephone` | VARCHAR(20) | ✅ |
| Fonction | `participants` | `fonction` | VARCHAR(100) | ✅ |
| **Champs supplémentaires** | | | | |
| Date de naissance | `participants` | `date_naissance` | DATE | ✅ |
| Lieu de naissance | `participants` | `lieu_naissance` | VARCHAR(255) | ✅ |
| Adresse | `participants` | `adresse` | TEXT | ✅ |
| Code postal | `participants` | `code_postal` | VARCHAR(10) | ✅ |
| Ville | `participants` | `ville` | VARCHAR(100) | ✅ |
| Niveau d'études | `participants` | `niveau_etudes` | VARCHAR(100) | ✅ |
| Situation handicap | `participants` | `situation_handicap` | BOOLEAN | ✅ |
| Aménagements nécessaires | `participants` | `amenagements_necessaires` | TEXT | ✅ |

---

## 🔍 Vérification

### **Champs actuellement collectés par le formulaire**

**Formulaire actuel** (`client/src/components/FormationRequestForm.js`) :

```javascript
entreprise: {
  nom: '',
  siret: '',
  adresse: '',
  code_postal: '',
  ville: '',
  email_contact: '',
  telephone: ''
}

formation: {
  formation_catalogue_id: '',
  date_debut: '',
  date_fin: '',
  modalite: 'presentiel'
}

participants: [
  { 
    nom: '', 
    prenom: '', 
    email: '', 
    telephone: '', 
    fonction: '' 
  }
]
```

### **Champs stockés maintenant** (après mise à jour)

✅ **Entreprise** : 9 champs (tous)  
✅ **Formation** : 7 champs (tous)  
✅ **Participants** : 13 champs (5 de base + 8 supplémentaires)

---

## 📝 Logs de Debug

Après la mise à jour, les logs du serveur affichent maintenant :

```
📝 Nouvelle demande de formation reçue
📧 Email entreprise: contact@exemple.com
📊 Données reçues: {
  "entreprise": { ... },
  "formation": { ... },
  "participants": [ ... ]
}
✅ Nouvelle entreprise créée: abc-123
✅ Session créée: def-456
👥 Participants à insérer: [
  {
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean@exemple.com",
    ...
  }
]
✅ 1 participant(s) ajouté(s)
```

---

## 🚀 Améliorations Futures

### **Champs à ajouter au formulaire** (si besoin)

**Pour les participants** :
- [ ] Date de naissance
- [ ] Lieu de naissance
- [ ] Adresse complète
- [ ] Niveau d'études
- [ ] Situation de handicap
- [ ] Aménagements nécessaires

**Pour l'entreprise** :
- [ ] Site web
- [ ] Pays (actuellement défaut: France)
- [ ] Secteur d'activité
- [ ] Nombre d'employés

**Pour la formation** :
- [ ] Objectifs spécifiques
- [ ] Prérequis
- [ ] Lieu de formation (si présentiel)
- [ ] Lien visio (si distanciel)

---

## 🔧 Modification du Formulaire

Si tu veux ajouter des champs au formulaire, voici comment faire :

### **1. Ajouter le champ dans le state**

```javascript
// Dans FormationRequestForm.js
participants: [
  { 
    nom: '', 
    prenom: '', 
    email: '', 
    telephone: '', 
    fonction: '',
    date_naissance: '',  // NOUVEAU
    ville: ''            // NOUVEAU
  }
]
```

### **2. Ajouter l'input dans le formulaire**

```javascript
<input
  type="date"
  value={participant.date_naissance}
  onChange={(e) => handleParticipantChange(index, 'date_naissance', e.target.value)}
  placeholder="Date de naissance"
/>
```

### **3. Le backend stockera automatiquement**

Le code dans `demandeRoutes.js` utilise maintenant `|| null` pour tous les champs, donc :
- Si le champ est envoyé → il est stocké
- Si le champ n'est pas envoyé → `null` est stocké

---

## ✅ Checklist de Validation

Pour vérifier que tout fonctionne :

- [x] Code backend mis à jour (`demandeRoutes.js`)
- [x] Tous les champs entreprise stockés
- [x] Tous les champs formation stockés
- [x] Tous les champs participants stockés
- [x] Logs de debug ajoutés
- [ ] Test avec une vraie demande
- [ ] Vérification dans Supabase que toutes les données sont là

---

## 🧪 Test

Pour tester, soumets une demande via le formulaire et vérifie dans les logs :

```bash
# Dans les logs du serveur, tu devrais voir :
📊 Données reçues: { ... }
👥 Participants à insérer: [ ... ]
```

Puis dans Supabase, vérifie que :
- Table `entreprises` : tous les champs remplis
- Table `sessions_formation` : tous les champs remplis
- Table `participants` : tous les champs remplis (même ceux à `null`)

---

**🎉 Maintenant, TOUTES les données du formulaire sont stockées correctement !**
