# Configuration Supabase pour le formulaire de demande

## Problème actuel
Le formulaire ne peut pas envoyer de demandes car le **Row Level Security (RLS)** de Supabase bloque les insertions.

## Solutions

### Solution 1 : Utiliser la clé SERVICE_ROLE (Recommandé pour le backend)

1. Allez dans votre dashboard Supabase : https://gasutiqukuekcnybwkrb.supabase.co
2. Allez dans **Settings** > **API**
3. Copiez la clé **service_role** (⚠️ ATTENTION : Cette clé est secrète et bypass le RLS)
4. Ajoutez-la dans votre fichier `.env` :

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. Redémarrez le serveur backend

### Solution 2 : Désactiver le RLS sur les tables (Plus simple mais moins sécurisé)

1. Allez dans **Table Editor** > **entreprises**
2. Cliquez sur les trois points > **Edit table**
3. Décochez **Enable Row Level Security (RLS)**
4. Répétez pour les tables : `sessions_formation` et `participants`

⚠️ **Attention** : Cette solution rend vos tables accessibles publiquement. À utiliser uniquement en développement.

### Solution 3 : Créer des politiques RLS appropriées

Exécutez ce SQL dans **SQL Editor** :

```sql
-- Politique pour permettre l'insertion dans entreprises
CREATE POLICY "Permettre insertion entreprises" ON entreprises
  FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre l'insertion dans sessions_formation
CREATE POLICY "Permettre insertion sessions" ON sessions_formation
  FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre l'insertion dans participants
CREATE POLICY "Permettre insertion participants" ON participants
  FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre la lecture des formations
CREATE POLICY "Permettre lecture formations" ON formations_catalogue
  FOR SELECT
  USING (true);
```

## Vérification

Après avoir appliqué une des solutions, testez avec :

```bash
curl -X POST http://localhost:3000/api/demandes \
  -H "Content-Type: application/json" \
  -d '{
    "entreprise": {
      "nom": "Test Entreprise",
      "email_contact": "test@test.com",
      "telephone": "0123456789"
    },
    "formation": {
      "formation_catalogue_id": "maitre-apprentissage",
      "date_debut": "2025-11-01",
      "modalite": "presentiel"
    },
    "participants": [
      {
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean.dupont@test.com"
      }
    ]
  }'
```

Vous devriez recevoir une réponse `201` avec `"success": true`.
