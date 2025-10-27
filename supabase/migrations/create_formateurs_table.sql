-- Migration: Création de la table formateurs
-- Date: 2024-10-27

-- Créer la table formateurs
CREATE TABLE IF NOT EXISTS formateurs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telephone VARCHAR(20),
  specialites TEXT[], -- Array de spécialités
  tarif_horaire DECIMAL(10,2),
  tarif_journalier DECIMAL(10,2),
  cv_url TEXT, -- URL vers le CV stocké
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Créer un index sur l'email pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_formateurs_email ON formateurs(email);

-- Créer un index sur le statut actif
CREATE INDEX IF NOT EXISTS idx_formateurs_actif ON formateurs(actif);

-- Créer un index sur le nom complet pour les recherches
CREATE INDEX IF NOT EXISTS idx_formateurs_nom_prenom ON formateurs(nom, prenom);

-- Ajouter une colonne formateur_id dans la table sessions
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS formateur_id UUID REFERENCES formateurs(id);

-- Créer un index sur formateur_id dans sessions
CREATE INDEX IF NOT EXISTS idx_sessions_formateur_id ON sessions(formateur_id);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_formateurs_updated_at BEFORE UPDATE ON formateurs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Ajouter quelques commentaires pour la documentation
COMMENT ON TABLE formateurs IS 'Table des formateurs/intervenants';
COMMENT ON COLUMN formateurs.specialites IS 'Array de spécialités du formateur (ex: ["Excel", "PowerPoint", "Management"])';
COMMENT ON COLUMN formateurs.actif IS 'Indique si le formateur est actif (disponible pour de nouvelles sessions)';
