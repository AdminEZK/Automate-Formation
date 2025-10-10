# Guide d'exécution des scripts SQL dans Supabase

Ce guide explique comment exécuter les scripts SQL pour créer les tables et insérer les données d'exemple dans votre projet Supabase.

## Prérequis

- Avoir un compte Supabase
- Avoir créé un projet Supabase (référence du projet: `gasutiqukuekcnybwkrb`)
- Avoir configuré le MCP Supabase comme expliqué dans les scripts d'installation

## Étapes pour exécuter les scripts SQL

### 1. Accéder à l'interface SQL de Supabase

1. Connectez-vous à votre compte Supabase: [https://app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet (`gasutiqukuekcnybwkrb`)
3. Dans le menu de gauche, cliquez sur "SQL Editor"
4. Cliquez sur "New Query" pour créer une nouvelle requête

### 2. Exécuter le script de création des tables

1. Ouvrez le fichier `supabase-tables.sql` dans votre éditeur
2. Copiez tout le contenu du fichier
3. Collez le contenu dans l'éditeur SQL de Supabase
4. Cliquez sur "Run" pour exécuter le script
5. Vérifiez qu'aucune erreur n'est signalée

### 3. Exécuter le script d'insertion des données d'exemple

1. Ouvrez le fichier `supabase-sample-data.sql` dans votre éditeur
2. Copiez tout le contenu du fichier
3. Créez une nouvelle requête SQL dans Supabase
4. Collez le contenu dans l'éditeur SQL
5. Cliquez sur "Run" pour exécuter le script
6. Vérifiez qu'aucune erreur n'est signalée

### 4. Vérifier que les tables ont été créées correctement

1. Dans le menu de gauche de Supabase, cliquez sur "Table Editor"
2. Vous devriez voir les tables suivantes:
   - `entreprises`
   - `formations_catalogue`
   - `sessions_formation`
   - `participants`
3. Cliquez sur chaque table pour vérifier que les données d'exemple ont été correctement insérées

## Utilisation des tables dans Windmill

Une fois les tables créées, vous pouvez les utiliser dans vos scripts Windmill via le MCP Supabase. Voici un exemple de script Python:

```python
import wmill

async def main():
    # Récupérer toutes les entreprises
    entreprises = await wmill.get_resource("supabase/entreprises")
    
    # Récupérer toutes les formations
    formations = await wmill.get_resource("supabase/formations_catalogue")
    
    # Récupérer toutes les sessions de formation
    sessions = await wmill.get_resource("supabase/sessions_formation")
    
    # Récupérer tous les participants
    participants = await wmill.get_resource("supabase/participants")
    
    # Exemple: Compter le nombre d'éléments dans chaque table
    return {
        "nombre_entreprises": len(entreprises),
        "nombre_formations": len(formations),
        "nombre_sessions": len(sessions),
        "nombre_participants": len(participants)
    }
```

## Requêtes SQL utiles

Voici quelques requêtes SQL utiles pour manipuler vos données:

### Obtenir toutes les sessions de formation à venir

```sql
SELECT 
    s.id, 
    f.titre AS formation_titre, 
    e.nom AS entreprise_nom, 
    s.date_debut, 
    s.date_fin, 
    s.statut
FROM 
    sessions_formation s
JOIN 
    formations_catalogue f ON s.formation_catalogue_id = f.id
JOIN 
    entreprises e ON s.entreprise_id = e.id
WHERE 
    s.date_debut > CURRENT_DATE
ORDER BY 
    s.date_debut ASC;
```

### Obtenir le nombre de participants par session

```sql
SELECT 
    s.id, 
    f.titre AS formation_titre, 
    e.nom AS entreprise_nom, 
    s.date_debut, 
    COUNT(p.id) AS nombre_participants
FROM 
    sessions_formation s
JOIN 
    formations_catalogue f ON s.formation_catalogue_id = f.id
JOIN 
    entreprises e ON s.entreprise_id = e.id
LEFT JOIN 
    participants p ON p.session_formation_id = s.id
GROUP BY 
    s.id, f.titre, e.nom, s.date_debut
ORDER BY 
    s.date_debut ASC;
```

### Mettre à jour le statut d'une session

```sql
UPDATE sessions_formation
SET statut = 'confirmee', updated_at = NOW()
WHERE id = 'id-de-la-session';
```

## Résolution des problèmes courants

### Erreur "relation already exists"

Si vous obtenez une erreur indiquant qu'une relation existe déjà, cela signifie que la table a déjà été créée. Vous pouvez soit:

1. Supprimer la table existante avant de la recréer:
   ```sql
   DROP TABLE IF EXISTS nom_de_la_table CASCADE;
   ```

2. Modifier le script pour utiliser `CREATE TABLE IF NOT EXISTS` au lieu de `CREATE TABLE`.

### Erreur de clé étrangère

Si vous rencontrez des erreurs liées aux clés étrangères lors de l'insertion des données, assurez-vous que:

1. Les tables sont créées dans le bon ordre (les tables référencées doivent être créées avant les tables qui les référencent)
2. Les données sont insérées dans le bon ordre (les données dans les tables référencées doivent être insérées avant les données dans les tables qui les référencent)
3. Les valeurs des clés étrangères existent bien dans les tables référencées
