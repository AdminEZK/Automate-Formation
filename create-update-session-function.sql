-- ============================================================================
-- FONCTION SQL POUR METTRE À JOUR UNE SESSION
-- ============================================================================
-- Cette fonction contourne les problèmes de PostgREST et garantit que l'UPDATE
-- est bien exécuté, même avec RLS activé
-- ============================================================================

CREATE OR REPLACE FUNCTION update_session_status(
  p_session_id UUID,
  p_statut TEXT,
  p_demande_validee_le TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_devis_envoye_le TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_devis_accepte_le TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_convention_signee_le TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_convocations_envoyees_le TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  statut VARCHAR(50),
  demande_validee_le TIMESTAMP WITH TIME ZONE,
  devis_envoye_le TIMESTAMP WITHOUT TIME ZONE,
  devis_accepte_le TIMESTAMP WITHOUT TIME ZONE,
  convention_signee_le TIMESTAMP WITHOUT TIME ZONE,
  convocations_envoyees_le TIMESTAMP WITHOUT TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER -- Exécute avec les privilèges du créateur (bypass RLS)
AS $$
BEGIN
  -- Mettre à jour la session
  UPDATE sessions_formation
  SET 
    statut = COALESCE(p_statut, sessions_formation.statut),
    demande_validee_le = COALESCE(p_demande_validee_le, sessions_formation.demande_validee_le),
    devis_envoye_le = COALESCE(p_devis_envoye_le, sessions_formation.devis_envoye_le),
    devis_accepte_le = COALESCE(p_devis_accepte_le, sessions_formation.devis_accepte_le),
    convention_signee_le = COALESCE(p_convention_signee_le, sessions_formation.convention_signee_le),
    convocations_envoyees_le = COALESCE(p_convocations_envoyees_le, sessions_formation.convocations_envoyees_le),
    updated_at = NOW()
  WHERE sessions_formation.id = p_session_id;

  -- Vérifier qu'une ligne a été mise à jour
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session % non trouvée', p_session_id;
  END IF;

  -- Retourner la session mise à jour
  RETURN QUERY
  SELECT 
    s.id,
    s.statut,
    s.demande_validee_le,
    s.devis_envoye_le,
    s.devis_accepte_le,
    s.convention_signee_le,
    s.convocations_envoyees_le,
    s.updated_at
  FROM sessions_formation s
  WHERE s.id = p_session_id;
END;
$$;

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION update_session_status TO service_role;
GRANT EXECUTE ON FUNCTION update_session_status TO authenticated;

-- ============================================================================
-- EXEMPLE D'UTILISATION
-- ============================================================================
-- SELECT * FROM update_session_status(
--   'b10071c3-f4bf-4c9f-82f2-8ef88cc5f5ab'::UUID,
--   'en_attente',
--   NOW(),
--   NULL,
--   NULL,
--   NULL,
--   NULL
-- );
-- ============================================================================
