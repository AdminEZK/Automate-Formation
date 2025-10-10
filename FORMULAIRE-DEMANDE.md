# 📝 Formulaire de Demande de Formation

## 🎯 Objectif

Permettre aux clients de faire une demande de formation en ligne, qui sera automatiquement enregistrée dans le système et apparaîtra dans le dashboard.

---

## 🚀 Accès au Formulaire

### URL Publique
**http://localhost:3001/demande-formation**

En production : `https://votre-domaine.fr/demande-formation`

### Depuis le Dashboard
Cliquez sur le bouton **"Nouvelle Demande"** (vert) dans la barre de navigation.

---

## 📋 Étapes du Formulaire

### **Étape 1 : Informations Entreprise** 🏢

**Champs obligatoires :**
- Nom de l'entreprise
- Email de contact
- Téléphone

**Champs optionnels :**
- SIRET (14 chiffres)
- Adresse complète
- Code postal
- Ville

**Logique :**
- Si l'entreprise existe déjà (même email ou SIRET), elle est réutilisée
- Les informations sont mises à jour si nécessaire

---

### **Étape 2 : Formation Souhaitée** 📚

**Champs obligatoires :**
- Choix de la formation (liste déroulante depuis la BDD)
- Date de début souhaitée

**Champs optionnels :**
- Date de fin souhaitée
- Modalité : Présentiel / Distanciel / Mixte (par défaut : Présentiel)

**Formations disponibles :**
Les formations sont chargées automatiquement depuis `formations_catalogue`.

---

### **Étape 3 : Participants** 👥

**Pour chaque participant :**

**Champs obligatoires :**
- Nom
- Prénom
- Email

**Champs optionnels :**
- Téléphone
- Fonction

**Actions :**
- ➕ **Ajouter un participant** : Bouton en haut à droite
- ❌ **Supprimer un participant** : Icône X (si plus d'un participant)

**Minimum :** 1 participant requis

---

## ⚙️ Fonctionnement Automatique

### 1. **Soumission du Formulaire**

Quand le client clique sur "Envoyer la demande" :

```
1. Vérification de l'entreprise (par email ou SIRET)
   ├─ Si existe → Réutilisation + mise à jour
   └─ Si n'existe pas → Création

2. Création de la session de formation
   ├─ Statut : "demande"
   ├─ Lien vers entreprise et formation
   └─ Dates renseignées

3. Ajout des participants
   └─ Tous les participants sont liés à la session

4. Log de l'action
   └─ Enregistrement dans actions_log

5. Confirmation au client
   └─ Message de succès + redirection
```

### 2. **Dans le Dashboard**

La nouvelle session apparaît **immédiatement** :

- ✅ Visible dans la liste des sessions
- ✅ Statut : **"Demande"** (badge orange)
- ✅ Toutes les informations renseignées
- ✅ Bouton "Envoyer le devis" disponible

### 3. **Workflow Automatique**

```
Demande reçue (formulaire)
    ↓
Statut: "demande" (dashboard)
    ↓
Action manuelle: "Envoyer le devis"
    ↓
Statut: "devis_envoye"
    ↓
Client accepte → Statut: "en_attente"
    ↓
Signature convention → Statut: "confirmee"
    ↓
etc.
```

---

## 🎨 Design du Formulaire

### Caractéristiques

- ✅ **Responsive** : Fonctionne sur mobile, tablette et desktop
- ✅ **Barre de progression** : Indicateur visuel des étapes
- ✅ **Validation en temps réel** : Messages d'erreur clairs
- ✅ **Navigation fluide** : Boutons Précédent/Suivant
- ✅ **Design moderne** : Gradient bleu, ombres, animations

### Couleurs

- **Fond** : Gradient bleu clair → indigo
- **Boutons** : Bleu (#2563eb) et Vert (#16a34a)
- **Erreurs** : Rouge (#dc2626)
- **Succès** : Vert (#16a34a)

---

## 🔧 Configuration Backend

### Route API

**POST** `/api/demandes`

**Body :**
```json
{
  "entreprise": {
    "nom": "TechCorp",
    "siret": "12345678901234",
    "adresse": "123 rue...",
    "code_postal": "75001",
    "ville": "Paris",
    "email_contact": "contact@techcorp.fr",
    "telephone": "01 23 45 67 89"
  },
  "formation": {
    "formation_catalogue_id": "uuid-formation",
    "date_debut": "2025-11-15",
    "date_fin": "2025-11-17",
    "modalite": "presentiel"
  },
  "participants": [
    {
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean.dupont@techcorp.fr",
      "telephone": "06 12 34 56 78",
      "fonction": "Chef de Projet"
    }
  ]
}
```

**Réponse (201) :**
```json
{
  "success": true,
  "message": "Demande de formation enregistrée avec succès",
  "session_id": "uuid-session",
  "entreprise_id": "uuid-entreprise"
}
```

---

## 📧 Emails Automatiques (À Venir)

### Email au Client
```
Objet: Votre demande de formation a bien été reçue

Bonjour,

Nous avons bien reçu votre demande de formation pour :
- Formation : [Titre]
- Date souhaitée : [Date]
- Nombre de participants : [X]

Nous vous contacterons très prochainement avec un devis personnalisé.

Cordialement,
L'équipe ALADE Formation
```

### Email à l'Organisme
```
Objet: 🔔 Nouvelle demande de formation

Une nouvelle demande de formation a été reçue :

Entreprise : [Nom]
Formation : [Titre]
Date : [Date]
Participants : [X]

→ Voir dans le dashboard : [Lien]
```

---

## 🧪 Test du Formulaire

### 1. Accéder au formulaire
```bash
# Ouvrir dans le navigateur
http://localhost:3001/demande-formation
```

### 2. Remplir le formulaire
- Étape 1 : Informations entreprise
- Étape 2 : Choisir une formation
- Étape 3 : Ajouter des participants

### 3. Vérifier dans le dashboard
```bash
# Retourner au dashboard
http://localhost:3001/

# La nouvelle session doit apparaître avec statut "Demande"
```

### 4. Vérifier en base de données
```sql
-- Dernière session créée
SELECT * FROM vue_sessions_formation 
WHERE statut = 'demande' 
ORDER BY session_created_at DESC 
LIMIT 1;

-- Participants de cette session
SELECT * FROM participants 
WHERE session_formation_id = 'uuid-session';
```

---

## 🔒 Sécurité

### Validation Côté Client
- ✅ Champs obligatoires vérifiés
- ✅ Format email validé
- ✅ SIRET limité à 14 chiffres
- ✅ Code postal limité à 5 chiffres

### Validation Côté Serveur
- ✅ Vérification des données reçues
- ✅ Protection contre les injections SQL (Supabase)
- ✅ Gestion des erreurs
- ✅ Logs de toutes les actions

---

## 📊 Données Enregistrées

### Table `entreprises`
- Création ou mise à jour automatique
- Détection par email ou SIRET

### Table `sessions_formation`
- Statut initial : `demande`
- Lien vers entreprise et formation
- Dates renseignées
- Nombre de participants calculé

### Table `participants`
- Tous les participants ajoutés
- Lien vers la session

### Table `actions_log`
- Type : `creation_demande`
- Métadonnées : modalité, nombre de participants
- Email du demandeur

---

## 🚀 Prochaines Améliorations

### Phase 1 (Actuel)
- ✅ Formulaire 3 étapes
- ✅ Création automatique session
- ✅ Ajout participants
- ✅ Apparition dans dashboard

### Phase 2 (À venir)
- [ ] Emails de confirmation automatiques
- [ ] Validation avancée (dates, disponibilités)
- [ ] Upload de documents (cahier des charges)
- [ ] Choix de plusieurs formations
- [ ] Récapitulatif PDF de la demande

### Phase 3 (Future)
- [ ] Espace client pour suivre la demande
- [ ] Chat en direct avec l'organisme
- [ ] Proposition de dates alternatives
- [ ] Paiement en ligne du devis

---

## 📝 Notes Importantes

1. **Le formulaire est accessible publiquement** : Aucune authentification requise

2. **Détection automatique des doublons** : Si une entreprise existe déjà (même email ou SIRET), elle est réutilisée

3. **Statut initial** : Toutes les demandes sont créées avec le statut `demande`

4. **Notifications** : Pour l'instant, pas d'email automatique (à configurer avec Resend)

5. **Validation** : Les données sont validées côté client ET serveur

---

## 🎯 Utilisation Recommandée

### Pour les Clients
1. Partager le lien du formulaire : `https://votre-domaine.fr/demande-formation`
2. Ajouter le lien sur votre site web
3. Inclure dans vos emails marketing
4. QR Code pour les salons/événements

### Pour l'Organisme
1. Vérifier régulièrement les nouvelles demandes dans le dashboard
2. Traiter les demandes par ordre de réception
3. Envoyer le devis rapidement (bouton dans le dashboard)
4. Suivre le workflow jusqu'à la formation

---

**Le formulaire est maintenant opérationnel ! 🎉**

Pour toute question ou amélioration, consultez la documentation complète dans `README-PRINCIPAL.md`.
