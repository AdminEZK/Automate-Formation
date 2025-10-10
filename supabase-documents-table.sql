-- Création de la table documents pour stocker les métadonnées des documents générés
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID NOT NULL REFERENCES sessions_formation(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- convocation, certificat, evaluation, etc.
    nom_fichier VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL, -- Chemin dans Supabase Storage
    taille_fichier INTEGER, -- Taille en bytes
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    metadata JSONB DEFAULT '{}'::jsonb, -- Métadonnées supplémentaires
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création d'index pour accélérer les recherches
CREATE INDEX idx_documents_session_id ON documents(session_formation_id);
CREATE INDEX idx_documents_participant_id ON documents(participant_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_created_at ON documents(created_at);

-- Trigger pour mettre à jour le champ updated_at automatiquement
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Activation de Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Politique pour les utilisateurs authentifiés
CREATE POLICY "Accès complet pour les utilisateurs authentifiés" ON documents
    FOR ALL
    TO authenticated
    USING (true);

-- Politique de lecture pour les utilisateurs anonymes
CREATE POLICY "Lecture pour les utilisateurs anonymes" ON documents
    FOR SELECT
    TO anon
    USING (true);

-- Création du bucket de stockage pour les documents
-- Note: Cette commande doit être exécutée via l'interface Supabase ou l'API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Politique de stockage pour permettre l'upload de documents
-- CREATE POLICY "Permettre l'upload de documents aux utilisateurs authentifiés"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'documents');

-- Politique de stockage pour permettre la lecture de documents
-- CREATE POLICY "Permettre la lecture de documents aux utilisateurs authentifiés"
-- ON storage.objects FOR SELECT
-- TO authenticated
-- USING (bucket_id = 'documents');

-- Politique de stockage pour permettre la suppression de documents
-- CREATE POLICY "Permettre la suppression de documents aux utilisateurs authentifiés"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'documents');
