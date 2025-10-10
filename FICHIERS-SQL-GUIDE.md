# 📁 Guide des Fichiers SQL

Ce document explique l'utilité de chaque fichier SQL du projet.

---

## ⭐ Fichiers à Utiliser

### 1. `supabase-installation-complete.sql` ⭐⭐⭐

**C'EST LE FICHIER PRINCIPAL À UTILISER**

**Contenu :**
- ✅ Toutes les tables de base (entreprises, formations, sessions, participants)
- ✅ Tous les champs workflow (devis, convention, convocations)
- ✅ Toutes les tables d'automatisation (documents, emails, logs, etc.)
- ✅ Tous les index optimisés
- ✅ Tous les triggers automatiques
- ✅ Toutes les vues utiles

**Quand l'utiliser :**
- Installation initiale du projet
- Réinstallation complète
- Nouvelle instance de base de données

**Comment l'utiliser :**
```sql
-- Copiez-collez tout le contenu dans Supabase SQL Editor
-- Puis cliquez sur "Run"
```

---

### 2. `supabase-donnees-test.sql` ⭐⭐

**Données de test pour développement**

**Contenu :**
- 2 entreprises fictives
- 1 formation (Gestion de Projet Agile)
- 2 sessions de formation
- 5 participants

**Quand l'utiliser :**
- Après avoir installé la base de données
- Pour tester le dashboard
- Pour développer de nouvelles fonctionnalités

**Comment l'utiliser :**
```sql
-- Après avoir exécuté supabase-installation-complete.sql
-- Copiez-collez ce fichier dans SQL Editor
```

---

## 📦 Fichiers Obsolètes (Ne Plus Utiliser)

Ces fichiers ont été fusionnés dans `supabase-installation-complete.sql`.
Ils sont conservés pour référence historique.

### ~~`supabase-tables.sql`~~
❌ **Obsolète** - Remplacé par `supabase-installation-complete.sql`

Contenait uniquement les tables de base sans les champs workflow.

### ~~`supabase-schema-update-workflow.sql`~~
❌ **Obsolète** - Fusionné dans `supabase-installation-complete.sql`

Ajoutait les champs workflow (devis_envoye_le, etc.) aux tables existantes.

### ~~`supabase-tables-dashboard-automation.sql`~~
❌ **Obsolète** - Fusionné dans `supabase-installation-complete.sql`

Créait les tables d'automatisation (documents, emails_log, etc.).

### ~~`supabase-tables-only.sql`~~
❌ **Obsolète** - Fusionné dans `supabase-installation-complete.sql`

Version sans vues des tables d'automatisation.

### ~~`supabase-drop-vues.sql`~~
❌ **Obsolète** - Plus nécessaire

Supprimait les vues avant de recréer les tables. Le nouveau script gère ça automatiquement.

---

## 🗂️ Fichiers de Configuration Spécifiques

### `config-organisme-alade.sql`

Configuration spécifique pour l'organisme ALADE.

**Contenu :**
- Informations de l'organisme
- Numéro Qualiopi
- Coordonnées

**Quand l'utiliser :**
- Après l'installation complète
- Pour personnaliser les informations de l'organisme

### `scenario-client-complet.sql`

Scénario de test complet avec un client fictif.

**Contenu :**
- Entreprise complète
- Session avec workflow complet
- Participants
- Documents générés
- Emails envoyés

**Quand l'utiliser :**
- Pour tester le workflow complet
- Pour démonstration client

---

## 📊 Ordre d'Exécution Recommandé

### Installation Initiale

```bash
1. supabase-installation-complete.sql   # Base de données complète
2. supabase-donnees-test.sql            # Données de test (optionnel)
3. config-organisme-alade.sql           # Configuration organisme (optionnel)
```

### Réinstallation Complète

Si vous voulez repartir de zéro :

```sql
-- 1. Supprimer toutes les tables (ATTENTION: perte de données!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- 2. Réinstaller
-- Exécuter supabase-installation-complete.sql
```

---

## 🔍 Vérification de l'Installation

Après avoir exécuté `supabase-installation-complete.sql`, vérifiez :

```sql
-- Lister toutes les tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Résultat attendu (11 tables):
-- actions_log
-- documents
-- emails_log
-- emargements
-- entreprises
-- evaluations
-- formations_catalogue
-- notifications_queue
-- participants
-- sessions_formation
-- templates

-- Vérifier les vues
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';

-- Résultat attendu (2 vues):
-- vue_dashboard_stats
-- vue_sessions_formation

-- Vérifier les données de test
SELECT COUNT(*) as nb_sessions FROM sessions_formation;
SELECT COUNT(*) as nb_entreprises FROM entreprises;
SELECT COUNT(*) as nb_participants FROM participants;
```

---

## 🧹 Nettoyage des Fichiers Obsolètes

Vous pouvez supprimer ces fichiers en toute sécurité :

```bash
rm supabase-tables.sql
rm supabase-schema-update-workflow.sql
rm supabase-tables-dashboard-automation.sql
rm supabase-tables-only.sql
rm supabase-drop-vues.sql
```

**Gardez uniquement :**
- ✅ `supabase-installation-complete.sql`
- ✅ `supabase-donnees-test.sql`
- ✅ `config-organisme-alade.sql` (si utilisé)
- ✅ `scenario-client-complet.sql` (si utilisé)

---

## 📝 Résumé

| Fichier | Statut | Usage |
|---------|--------|-------|
| `supabase-installation-complete.sql` | ⭐ **À UTILISER** | Installation complète |
| `supabase-donnees-test.sql` | ⭐ **À UTILISER** | Données de test |
| `config-organisme-alade.sql` | ✅ Optionnel | Configuration organisme |
| `scenario-client-complet.sql` | ✅ Optionnel | Scénario de test |
| Tous les autres fichiers SQL | ❌ Obsolètes | Peuvent être supprimés |

---

**Conseil :** Utilisez uniquement `supabase-installation-complete.sql` pour toute nouvelle installation. C'est le fichier le plus à jour et le plus complet ! 🎯
