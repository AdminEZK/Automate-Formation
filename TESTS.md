# 🧪 Plan de Tests - Automate Formation

## ✅ Services Déployés

- **Backend**: https://automate-formation.onrender.com
- **Frontend**: https://automate-formation-1.onrender.com
- **Base de données**: Supabase

---

## 1. Tests Backend (API)

### 1.1 Test des Formations
```bash
# Liste des formations
curl https://automate-formation.onrender.com/api/formations

# Détail d'une formation (remplacer {id} par un vrai ID)
curl https://automate-formation.onrender.com/api/formations/{id}
```

**Résultat attendu**: JSON avec la liste des formations

### 1.2 Test des Entreprises
```bash
# Liste des entreprises
curl https://automate-formation.onrender.com/api/entreprises
```

**Résultat attendu**: JSON avec la liste des entreprises

### 1.3 Test des Sessions
```bash
# Liste des sessions
curl https://automate-formation.onrender.com/api/sessions
```

**Résultat attendu**: JSON avec la liste des sessions

### 1.4 Test de Création de Demande
```bash
# Créer une demande de formation
curl -X POST https://automate-formation.onrender.com/api/demandes \
  -H "Content-Type: application/json" \
  -d '{
    "entreprise_id": "ID_ENTREPRISE",
    "formation_id": "ID_FORMATION",
    "nombre_participants": 5,
    "date_souhaitee": "2025-11-01",
    "commentaires": "Test depuis l API"
  }'
```

**Résultat attendu**: JSON avec `success: true` et les IDs créés

---

## 2. Tests Frontend (Interface Web)

### 2.1 Page d'Accueil
1. Ouvrir: https://automate-formation-1.onrender.com
2. Vérifier que le formulaire de demande s'affiche
3. Vérifier que les listes déroulantes se chargent (entreprises, formations)

**✅ À vérifier**:
- [ ] Le formulaire s'affiche correctement
- [ ] Les champs sont tous présents
- [ ] Le design est responsive (mobile/desktop)

### 2.2 Soumission de Demande
1. Remplir le formulaire avec des données de test
2. Soumettre la demande
3. Vérifier le message de succès

**✅ À vérifier**:
- [ ] Le formulaire se soumet sans erreur
- [ ] Un message de confirmation s'affiche
- [ ] Les données sont bien enregistrées dans Supabase

### 2.3 Dashboard
1. Aller sur: https://automate-formation-1.onrender.com/dashboard
2. Vérifier que les données s'affichent

**✅ À vérifier**:
- [ ] Le dashboard se charge
- [ ] Les statistiques s'affichent
- [ ] Les données sont à jour

### 2.4 Gestion des Entreprises
1. Aller sur: https://automate-formation-1.onrender.com/entreprises
2. Vérifier la liste des entreprises

**✅ À vérifier**:
- [ ] La liste s'affiche
- [ ] Les informations sont complètes
- [ ] Les actions (modifier, supprimer) fonctionnent

### 2.5 Gestion des Sessions
1. Aller sur: https://automate-formation-1.onrender.com/sessions
2. Vérifier la liste des sessions

**✅ À vérifier**:
- [ ] La liste s'affiche
- [ ] Les détails sont accessibles
- [ ] La création de session fonctionne

---

## 3. Tests d'Intégration

### 3.1 Flux Complet de Demande
1. Un client remplit le formulaire sur le frontend
2. La demande est envoyée au backend
3. Le backend crée/met à jour l'entreprise dans Supabase
4. Le backend crée la session de formation
5. Le backend ajoute les participants
6. (Optionnel) Un email de confirmation est envoyé

**✅ À vérifier**:
- [ ] Toutes les étapes se déroulent sans erreur
- [ ] Les données sont cohérentes dans Supabase
- [ ] Les emails sont envoyés (si configuré)

### 3.2 Test de Charge
```bash
# Test avec Apache Bench (si installé)
ab -n 100 -c 10 https://automate-formation.onrender.com/api/formations
```

**Résultat attendu**: Le serveur répond correctement à 100 requêtes

---

## 4. Tests de Sécurité

### 4.1 Variables d'Environnement
**✅ À vérifier**:
- [ ] Les clés API ne sont pas exposées dans le code
- [ ] Les variables sensibles sont dans les variables d'environnement Render
- [ ] Le fichier `.env` est dans `.gitignore`

### 4.2 CORS
**✅ À vérifier**:
- [ ] Le backend accepte les requêtes du frontend
- [ ] Le backend rejette les requêtes d'autres origines

### 4.3 Supabase RLS (Row Level Security)
**✅ À vérifier**:
- [ ] Les politiques RLS sont activées sur Supabase
- [ ] Les données sensibles sont protégées

---

## 5. Tests de Performance

### 5.1 Temps de Chargement
**✅ À vérifier**:
- [ ] Le frontend se charge en moins de 3 secondes
- [ ] Les API répondent en moins de 500ms
- [ ] Les images sont optimisées

### 5.2 Render Free Tier
**⚠️ Limitations à connaître**:
- Le service s'endort après 15 minutes d'inactivité
- Le premier démarrage peut prendre 30-60 secondes
- 750 heures gratuites par mois

---

## 6. Tests de Monitoring

### 6.1 Logs Render
1. Aller sur le dashboard Render
2. Consulter les logs du backend et frontend
3. Vérifier qu'il n'y a pas d'erreurs

**✅ À vérifier**:
- [ ] Pas d'erreurs 500 dans les logs
- [ ] Les requêtes sont bien loggées
- [ ] Les performances sont acceptables

### 6.2 Supabase Dashboard
1. Aller sur le dashboard Supabase
2. Vérifier les métriques
3. Consulter les logs SQL

**✅ À vérifier**:
- [ ] Le nombre de requêtes est normal
- [ ] Pas d'erreurs SQL
- [ ] Les tables sont bien remplies

---

## 7. Tests de Régression

Après chaque mise à jour, vérifier:
- [ ] Le backend démarre sans erreur
- [ ] Le frontend se charge correctement
- [ ] Les fonctionnalités principales fonctionnent
- [ ] Pas de régression sur les performances

---

## 🐛 Problèmes Connus

### Backend
- ⚠️ `libreoffice-convert` désactivé (nécessite LibreOffice sur le serveur)
- ⚠️ Génération de documents PDF limitée

### Frontend
- ✅ Tous les composants sont présents

### Supabase
- ✅ Connexion fonctionnelle

---

## 📞 Support

En cas de problème:
1. Consulter les logs Render
2. Vérifier les variables d'environnement
3. Tester les endpoints API individuellement
4. Vérifier la connexion Supabase

---

## 🎯 Prochaines Étapes

1. **Configurer les emails** (Resend)
2. **Activer RLS sur Supabase** (sécurité)
3. **Ajouter des tests automatisés**
4. **Configurer un domaine personnalisé**
5. **Mettre en place un monitoring** (Sentry, LogRocket)
6. **Optimiser les performances**
7. **Ajouter la génération de documents** (avec alternative à LibreOffice)

---

## ✅ Checklist de Déploiement

- [x] Backend déployé et fonctionnel
- [x] Frontend déployé et fonctionnel
- [x] Variables d'environnement configurées
- [x] Connexion Supabase fonctionnelle
- [ ] Emails configurés (Resend)
- [ ] RLS activé sur Supabase
- [ ] Tests manuels effectués
- [ ] Documentation à jour
- [ ] Monitoring en place
