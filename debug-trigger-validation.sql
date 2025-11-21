-- Récupérer la définition de la fonction validate_status_transition
SELECT 
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'validate_status_transition'
AND n.nspname = 'public';

-- Alternative: voir le code source de la fonction
SELECT 
  routine_name,
  routine_definition
FROM information_schema.routines
WHERE routine_name = 'validate_status_transition'
AND routine_schema = 'public';

-- Voir tous les triggers sur sessions_formation
SELECT 
  t.trigger_name,
  t.event_manipulation,
  t.action_timing,
  t.action_statement,
  pg_get_triggerdef(tr.oid) as trigger_definition
FROM information_schema.triggers t
JOIN pg_trigger tr ON tr.tgname = t.trigger_name
WHERE t.event_object_table = 'sessions_formation'
ORDER BY t.trigger_name;
