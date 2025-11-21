-- Vérifier les types exacts des colonnes de sessions_formation
SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'sessions_formation'
AND column_name IN (
  'id',
  'statut',
  'demande_validee_le',
  'devis_envoye_le',
  'devis_accepte_le',
  'convention_signee_le',
  'convocations_envoyees_le',
  'updated_at'
)
ORDER BY ordinal_position;
