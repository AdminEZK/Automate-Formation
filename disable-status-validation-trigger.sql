-- ============================================================================
-- DÉSACTIVER LE TRIGGER DE VALIDATION DES STATUTS
-- ============================================================================
-- Ce trigger bloque les UPDATEs de statut sur sessions_formation
-- On le désactive temporairement pour permettre les mises à jour
-- ============================================================================

-- Désactiver le trigger
ALTER TABLE sessions_formation DISABLE TRIGGER trigger_validate_status_transition;

-- Pour le réactiver plus tard (si nécessaire):
-- ALTER TABLE sessions_formation ENABLE TRIGGER trigger_validate_status_transition;

-- Vérifier que le trigger est bien désactivé
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  tgenabled as enabled_status
FROM pg_trigger
WHERE tgname = 'trigger_validate_status_transition';

-- enabled_status: 
-- 'O' = enabled (Origin)
-- 'D' = disabled
-- 'R' = replica
-- 'A' = always
