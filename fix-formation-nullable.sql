-- Permettre que formation_catalogue_id soit NULL
-- (pour les formations qui ne sont pas encore dans le catalogue)

ALTER TABLE sessions_formation 
ALTER COLUMN formation_catalogue_id DROP NOT NULL;

-- Ajouter une colonne pour stocker le titre de la formation si elle n'est pas dans le catalogue
ALTER TABLE sessions_formation 
ADD COLUMN IF NOT EXISTS formation_titre TEXT;

-- Ajouter la colonne modalite (présentiel, distanciel, mixte)
ALTER TABLE sessions_formation 
ADD COLUMN IF NOT EXISTS modalite TEXT DEFAULT 'presentiel';

-- Mettre à jour les notes existantes si besoin
COMMENT ON COLUMN sessions_formation.formation_catalogue_id IS 'ID de la formation dans le catalogue (peut être NULL si formation personnalisée)';
COMMENT ON COLUMN sessions_formation.formation_titre IS 'Titre de la formation si elle n''est pas dans le catalogue';
COMMENT ON COLUMN sessions_formation.modalite IS 'Modalité de la formation: presentiel, distanciel, ou mixte';
