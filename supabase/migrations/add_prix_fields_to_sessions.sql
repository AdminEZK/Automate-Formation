-- Migration: Ajout des champs de prix manuels dans la table sessions
-- Date: 2024-10-27

-- Ajouter les colonnes de prix
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS prix_unitaire_ht DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS prix_total_ht DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS frais_deplacement DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS statut_devis VARCHAR(50) DEFAULT 'brouillon';

-- Ajouter un commentaire pour documenter les statuts possibles
COMMENT ON COLUMN sessions.statut_devis IS 'Statuts possibles: brouillon, en_attente_validation, valide, refuse';

-- Créer un index sur le statut du devis pour les requêtes
CREATE INDEX IF NOT EXISTS idx_sessions_statut_devis ON sessions(statut_devis);

-- Mettre à jour les sessions existantes avec un statut par défaut
UPDATE sessions 
SET statut_devis = 'brouillon' 
WHERE statut_devis IS NULL;
