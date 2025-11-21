-- Test UPDATE direct sur la session problématique
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier l'état actuel
SELECT id, statut, demande_validee_le, devis_envoye_le, updated_at
FROM sessions_formation
WHERE id = 'b10071c3-f4bf-4c9f-82f2-8ef88cc5f5ab';

-- 2. Tenter l'UPDATE
UPDATE sessions_formation
SET 
  statut = 'en_attente',
  demande_validee_le = NOW()
WHERE id = 'b10071c3-f4bf-4c9f-82f2-8ef88cc5f5ab';

-- 3. Vérifier le résultat
SELECT id, statut, demande_validee_le, devis_envoye_le, updated_at
FROM sessions_formation
WHERE id = 'b10071c3-f4bf-4c9f-82f2-8ef88cc5f5ab';

-- 4. Vérifier s'il y a des triggers qui pourraient bloquer
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'sessions_formation';
