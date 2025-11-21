-- ============================================================================
-- FIX RLS pour sessions_formation
-- ============================================================================
-- Ce script corrige les politiques RLS pour permettre au backend (service_role)
-- de mettre à jour les sessions_formation
-- ============================================================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Service role can manage all sessions" ON sessions_formation;
DROP POLICY IF EXISTS "Public can insert sessions" ON sessions_formation;
DROP POLICY IF EXISTS "Authenticated users can read sessions" ON sessions_formation;

-- Politique 1: Le service_role peut tout faire (INSERT, UPDATE, DELETE, SELECT)
CREATE POLICY "Service role can manage all sessions"
ON sessions_formation
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Politique 2: Permettre l'insertion publique (pour le formulaire)
CREATE POLICY "Public can insert sessions"
ON sessions_formation
FOR INSERT
TO anon
WITH CHECK (true);

-- Politique 3: Les utilisateurs authentifiés peuvent lire
CREATE POLICY "Authenticated users can read sessions"
ON sessions_formation
FOR SELECT
TO authenticated
USING (true);

-- Vérifier que RLS est bien activé
ALTER TABLE sessions_formation ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- VÉRIFICATION
-- ============================================================================
-- Pour vérifier que les politiques sont bien appliquées, exécute :
-- SELECT * FROM pg_policies WHERE tablename = 'sessions_formation';
-- ============================================================================
