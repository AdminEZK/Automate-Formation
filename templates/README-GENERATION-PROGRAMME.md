# 📄 Génération Automatique du Programme de Formation

## 🎯 Vue d'ensemble

Ce système permet de générer automatiquement des programmes de formation conformes Qualiopi à partir des données de votre catalogue.

---

## 📋 Comment ça fonctionne ?

### **Étape 1 : Remplir le catalogue de formations (UNE SEULE FOIS)**

Vous devez remplir la table `formations_catalogue` dans Supabase avec toutes les informations de chaque formation.

**Exemple SQL :**

```sql
INSERT INTO formations_catalogue (
    titre,
    description,
    duree,
    objectifs,
    programme,
    public_vise,
    prerequis,
    competences_visees,
    methodes_pedagogiques,
    moyens_pedagogiques,
    modalites_evaluation,
    accessibilite_handicap,
    delai_acces,
    modalites_acces,
    prix_ht
) VALUES (
    'Gestion de Projet Agile - Scrum & Kanban',
    'Formation complète aux méthodes agiles',
    35,
    '- Comprendre les principes de l''agilité
     - Maîtriser le framework Scrum
     - Mettre en place Kanban',
    'JOUR 1 : INTRODUCTION À L''AGILITÉ
     • Historique et contexte
     • Le manifeste agile
     ...
     
     JOUR 2 : SCRUM EN DÉTAIL
     • Les 3 rôles
     • Les 5 événements
     ...',
    'Chefs de projet, managers, product owners',
    'Aucun prérequis technique nécessaire',
    '- Animer les cérémonies Scrum
     - Créer et gérer un backlog produit',
    '• Apports théoriques
     • Ateliers pratiques
     • Études de cas',
    '• Support PDF
     • Vidéos pédagogiques
     • Accès plateforme e-learning',
    '• QCM de validation
     • Projet fil rouge
     • Évaluation à chaud et à froid',
    'Locaux accessibles PMR. Adaptation possible pour personnes en situation de handicap.',
    '2 semaines minimum',
    'Inscription en ligne ou par email',
    2500.00
);
```

### **Étape 2 : Client fait une demande**

Le client choisit une formation → Une session est créée automatiquement.

### **Étape 3 : Générer le programme**

Dans le dashboard, cliquez sur **"Télécharger le programme"** → Le PDF se génère automatiquement !

---

## 🔧 Configuration requise

### **1. Variables d'environnement**

Ajoutez ces variables dans votre fichier `.env` :

```env
# Informations de l'organisme
ORGANISME_NOM=Aladé Conseil
ORGANISME_ADRESSE=123 Avenue de la Formation
ORGANISME_CODE_POSTAL=75015
ORGANISME_VILLE=Paris
ORGANISME_SIRET=123 456 789 00012
ORGANISME_NDA=11 75 12345 75
ORGANISME_TELEPHONE=01 23 45 67 89
ORGANISME_EMAIL=contact@aladeconseils.com
ORGANISME_LOGO_URL=https://votre-domaine.com/logo.png
ORGANISME_REFERENT_HANDICAP=Marie MARTIN - handicap@aladeconseils.com
```

### **2. Installer Puppeteer**

```bash
npm install puppeteer
```

---

## 📊 Champs obligatoires Qualiopi

### **Dans `formations_catalogue` :**

| Champ | Obligatoire | Description |
|-------|-------------|-------------|
| `titre` | ✅ | Intitulé de la formation |
| `duree` | ✅ | Durée en heures |
| `objectifs` | ✅ | Objectifs pédagogiques |
| `programme` | ✅ | Contenu détaillé |
| `public_vise` | ✅ | Public concerné |
| `prerequis` | ⚠️ | Prérequis (ou "Aucun") |
| `competences_visees` | ✅ | Compétences acquises |
| `methodes_pedagogiques` | ✅ | Méthodes utilisées |
| `moyens_pedagogiques` | ✅ | Supports et outils |
| `modalites_evaluation` | ✅ | Comment évaluer |
| `accessibilite_handicap` | ✅ | Accessibilité PMR |
| `delai_acces` | ✅ | Délai d'inscription |
| `modalites_acces` | ✅ | Comment s'inscrire |
| `prix_ht` | ✅ | Tarif HT |

---

## 🎨 Personnalisation du template

Le template HTML est dans : `/templates/programme-formation-template.html`

Vous pouvez le modifier pour :
- Changer les couleurs
- Ajouter votre logo
- Modifier la mise en page
- Ajouter des sections

**Placeholders disponibles :**
- `{{titre}}` - Titre de la formation
- `{{duree}}` - Durée en heures
- `{{date_debut}}` - Date de début
- `{{entreprise_nom}}` - Nom du client
- ... (voir le fichier `programme-formation-data-example.json`)

---

## 🚀 Utilisation dans le dashboard

### **Option 1 : Bouton dans la page de détail**

```javascript
// Dans SessionDetail.jsx
<Button onClick={handleDownloadProgramme}>
  📄 Télécharger le programme
</Button>

const handleDownloadProgramme = async () => {
  try {
    const response = await axios.get(
      `/api/sessions/${sessionId}/generate-programme`,
      { responseType: 'blob' }
    );
    
    // Télécharger le fichier
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Programme_${session.formation_titre}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur lors de la génération du programme');
  }
};
```

---

## 📝 Exemple de données

Voir le fichier `programme-formation-data-example.json` pour un exemple complet de données.

---

## ✅ Checklist de mise en place

- [ ] Installer Puppeteer : `npm install puppeteer`
- [ ] Configurer les variables d'environnement (`.env`)
- [ ] Remplir le catalogue de formations dans Supabase
- [ ] Tester la génération avec une session
- [ ] Ajouter le bouton dans le dashboard
- [ ] Vérifier que le PDF est conforme Qualiopi

---

## 🐛 Dépannage

### **Erreur : "Puppeteer not found"**
```bash
npm install puppeteer
```

### **Erreur : "Template not found"**
Vérifiez que le fichier `templates/programme-formation-template.html` existe.

### **PDF vide ou incomplet**
Vérifiez que toutes les données sont présentes dans `formations_catalogue`.

### **Logo ne s'affiche pas**
Vérifiez que `ORGANISME_LOGO_URL` pointe vers une URL accessible.

---

## 📚 Ressources

- [Référentiel Qualiopi](https://travail-emploi.gouv.fr/formation-professionnelle/acteurs-cadre-et-qualite-de-la-formation-professionnelle/article/qualiopi-marque-de-certification-qualite-des-prestataires-de-formation)
- [Documentation Puppeteer](https://pptr.dev/)
- Voir aussi : `QUALIOPI-conformite.md`

---

**🎉 Votre système de génération automatique est prêt !**
