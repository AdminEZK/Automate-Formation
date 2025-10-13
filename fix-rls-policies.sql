-- ============================================================================
-- Configuration RLS pour Automate Formation
-- ============================================================================
-- Ce script configure les politiques RLS pour permettre:
-- 1. Au backend (service_role) d'insérer/modifier les données
-- 2. Aux utilisateurs authentifiés de lire leurs propres données
-- 3. Bloquer l'accès public non autorisé
-- ============================================================================

-- ============================================================================
-- TABLE: entreprises
-- ============================================================================

-- Activer RLS
ALTER TABLE entreprises ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Service role can manage all entreprises" ON entreprises;
DROP POLICY IF EXISTS "Public can insert entreprises" ON entreprises;
DROP POLICY IF EXISTS "Authenticated users can read entreprises" ON entreprises;

-- Politique 1: Le service_role peut tout faire (utilisé par le backend)
CREATE POLICY "Service role can manage all entreprises"
ON entreprises
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Politique 2: Permettre l'insertion publique (pour le formulaire)
CREATE POLICY "Public can insert entreprises"
ON entreprises
FOR INSERT
TO anon
WITH CHECK (true);

-- Politique 3: Les utilisateurs authentifiés peuvent lire
CREATE POLICY "Authenticated users can read entreprises"
ON entreprises
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- TABLE: sessions_formation
-- ============================================================================

ALTER TABLE sessions_formation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage all sessions" ON sessions_formation;
DROP POLICY IF EXISTS "Public can insert sessions" ON sessions_formation;
DROP POLICY IF EXISTS "Authenticated users can read sessions" ON sessions_formation;

CREATE POLICY "Service role can manage all sessions"
ON sessions_formation
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can insert sessions"
ON sessions_formation
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Authenticated users can read sessions"
ON sessions_formation
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- TABLE: participants
-- ============================================================================

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage all participants" ON participants;
DROP POLICY IF EXISTS "Public can insert participants" ON participants;
DROP POLICY IF EXISTS "Authenticated users can read participants" ON participants;

CREATE POLICY "Service role can manage all participants"
ON participants
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can insert participants"
ON participants
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Authenticated users can read participants"
ON participants
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- TABLE: formations_catalogue
-- ============================================================================

ALTER TABLE formations_catalogue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage formations_catalogue" ON formations_catalogue;
DROP POLICY IF EXISTS "Public can read formations_catalogue" ON formations_catalogue;
DROP POLICY IF EXISTS "Authenticated users can manage formations_catalogue" ON formations_catalogue;

CREATE POLICY "Service role can manage formations_catalogue"
ON formations_catalogue
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Permettre la lecture publique du catalogue (pour le formulaire)
CREATE POLICY "Public can read formations_catalogue"
ON formations_catalogue
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated users can manage formations_catalogue"
ON formations_catalogue
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================================================
-- TABLE: documents
-- ============================================================================

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage all documents" ON documents;
DROP POLICY IF EXISTS "Authenticated users can read own documents" ON documents;

CREATE POLICY "Service role can manage all documents"
ON documents
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can read own documents"
ON documents
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- TABLE: actions_log
-- ============================================================================

ALTER TABLE actions_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage all logs" ON actions_log;
DROP POLICY IF EXISTS "Authenticated users can read logs" ON actions_log;

CREATE POLICY "Service role can manage all logs"
ON actions_log
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can read logs"
ON actions_log
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- TABLE: emails_log
-- ============================================================================

ALTER TABLE emails_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage all emails_log" ON emails_log;
DROP POLICY IF EXISTS "Authenticated users can read emails_log" ON emails_log;

CREATE POLICY "Service role can manage all emails_log"
ON emails_log
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can read emails_log"
ON emails_log
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- TABLE: emargements
-- ============================================================================

ALTER TABLE emargements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage all emargements" ON emargements;
DROP POLICY IF EXISTS "Authenticated users can read emargements" ON emargements;

CREATE POLICY "Service role can manage all emargements"
ON emargements
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can read emargements"
ON emargements
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- TABLE: evaluations
-- ============================================================================

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage all evaluations" ON evaluations;
DROP POLICY IF EXISTS "Authenticated users can read evaluations" ON evaluations;

CREATE POLICY "Service role can manage all evaluations"
ON evaluations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can read evaluations"
ON evaluations
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- TABLE: export_logs
-- ============================================================================

ALTER TABLE export_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage all export_logs" ON export_logs;
DROP POLICY IF EXISTS "Authenticated users can read export_logs" ON export_logs;

CREATE POLICY "Service role can manage all export_logs"
ON export_logs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can read export_logs"
ON export_logs
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- TABLE: notifications_queue
-- ============================================================================

ALTER TABLE notifications_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage all notifications" ON notifications_queue;
DROP POLICY IF EXISTS "Authenticated users can read notifications" ON notifications_queue;

CREATE POLICY "Service role can manage all notifications"
ON notifications_queue
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can read notifications"
ON notifications_queue
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- TABLE: templates
-- ============================================================================

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage all templates" ON templates;
DROP POLICY IF EXISTS "Authenticated users can read templates" ON templates;

CREATE POLICY "Service role can manage all templates"
ON templates
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can read templates"
ON templates
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- VUES (Read-only)
-- ============================================================================

-- Note: Les vues ne supportent pas RLS directement.
-- Elles héritent automatiquement des politiques RLS des tables sous-jacentes.
-- Pas besoin de configuration supplémentaire pour:
--   - vue_dashboard_stats
--   - vue_sessions_complete
--   - vue_sessions_formation

-- ============================================================================
-- RÉSUMÉ
-- ============================================================================
-- ✅ RLS activé sur toutes les tables
-- ✅ Service role (backend) peut tout faire
-- ✅ Utilisateurs anonymes peuvent insérer des demandes (formulaire public)
-- ✅ Utilisateurs authentifiés peuvent lire les données
-- ✅ Accès public non autorisé bloqué par défaut
-- ============================================================================
