-- ============================================
-- SCHÉMA COMPLET DANS LE BON ORDRE
-- ============================================
-- Exécuter ce fichier APRÈS avoir créé les tables de base

-- 1. Table documents (manquante)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID NOT NULL REFERENCES sessions_formation(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    taille_fichier INTEGER,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    statut VARCHAR(50) DEFAULT 'genere',
    date_envoi TIMESTAMP WITH TIME ZONE,
    date_signature TIMESTAMP WITH TIME ZONE,
    signature_yousign_id VARCHAR(255),
    url_signature TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_documents_session_id ON documents(session_formation_id);
CREATE INDEX idx_documents_participant_id ON documents(participant_id);
CREATE INDEX idx_documents_type ON documents(type);

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 2. Table organisme_formation
CREATE TABLE IF NOT EXISTS organisme_formation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    raison_sociale VARCHAR(255),
    siret VARCHAR(14) NOT NULL UNIQUE,
    numero_declaration_activite VARCHAR(20) NOT NULL UNIQUE,
    adresse TEXT NOT NULL,
    code_postal VARCHAR(10) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    pays VARCHAR(100) DEFAULT 'France',
    telephone VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    site_web VARCHAR(255),
    representant_legal_nom VARCHAR(255) NOT NULL,
    representant_legal_prenom VARCHAR(255) NOT NULL,
    representant_legal_fonction VARCHAR(100) NOT NULL,
    representant_legal_email VARCHAR(255),
    logo_path TEXT,
    signature_path TEXT,
    reglement_interieur TEXT,
    conditions_generales_vente TEXT,
    politique_handicap TEXT,
    delai_retractation TEXT DEFAULT '10 jours',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_organisme_updated_at
BEFORE UPDATE ON organisme_formation
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 3. Table formateurs
CREATE TABLE IF NOT EXISTS formateurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telephone VARCHAR(20),
    specialites TEXT[],
    cv_path TEXT,
    diplomes TEXT,
    experience TEXT,
    certifications TEXT,
    statut VARCHAR(50) DEFAULT 'actif',
    type_contrat VARCHAR(50),
    siret VARCHAR(14),
    numero_formateur VARCHAR(50),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_formateurs_nom ON formateurs(nom, prenom);
CREATE INDEX idx_formateurs_email ON formateurs(email);

CREATE TRIGGER update_formateurs_updated_at
BEFORE UPDATE ON formateurs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. Ajouter colonnes aux tables existantes
ALTER TABLE entreprises ADD COLUMN IF NOT EXISTS representant_legal_nom VARCHAR(255);
ALTER TABLE entreprises ADD COLUMN IF NOT EXISTS representant_legal_prenom VARCHAR(255);
ALTER TABLE entreprises ADD COLUMN IF NOT EXISTS representant_legal_fonction VARCHAR(100);
ALTER TABLE entreprises ADD COLUMN IF NOT EXISTS representant_legal_email VARCHAR(255);
ALTER TABLE entreprises ADD COLUMN IF NOT EXISTS numero_tva VARCHAR(20);

ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS nature_action VARCHAR(100) DEFAULT 'Formation';
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS public_vise TEXT;
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS methodes_pedagogiques TEXT;
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS moyens_pedagogiques TEXT;
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS modalites_evaluation TEXT;
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS accessibilite_handicap TEXT;
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS modalites_acces TEXT;
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS delai_acces VARCHAR(100) DEFAULT '2 semaines';
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS competences_visees TEXT;
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS certification VARCHAR(255);

ALTER TABLE sessions_formation ADD COLUMN IF NOT EXISTS formateur_id UUID REFERENCES formateurs(id);
ALTER TABLE sessions_formation ADD COLUMN IF NOT EXISTS horaire_debut TIME DEFAULT '09:00';
ALTER TABLE sessions_formation ADD COLUMN IF NOT EXISTS horaire_fin TIME DEFAULT '17:00';
ALTER TABLE sessions_formation ADD COLUMN IF NOT EXISTS horaire_pause_debut TIME DEFAULT '12:00';
ALTER TABLE sessions_formation ADD COLUMN IF NOT EXISTS horaire_pause_fin TIME DEFAULT '13:00';
ALTER TABLE sessions_formation ADD COLUMN IF NOT EXISTS modalites_reglement TEXT;
ALTER TABLE sessions_formation ADD COLUMN IF NOT EXISTS conditions_annulation TEXT;
ALTER TABLE sessions_formation ADD COLUMN IF NOT EXISTS numero_convention VARCHAR(50) UNIQUE;
ALTER TABLE sessions_formation ADD COLUMN IF NOT EXISTS date_signature_convention DATE;
ALTER TABLE sessions_formation ADD COLUMN IF NOT EXISTS date_envoi_convocation DATE;
ALTER TABLE sessions_formation ADD COLUMN IF NOT EXISTS date_envoi_certificat DATE;
ALTER TABLE sessions_formation ADD COLUMN IF NOT EXISTS financement_opco BOOLEAN DEFAULT FALSE;
ALTER TABLE sessions_formation ADD COLUMN IF NOT EXISTS nom_opco VARCHAR(255);

ALTER TABLE participants ADD COLUMN IF NOT EXISTS date_naissance DATE;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS lieu_naissance VARCHAR(255);
ALTER TABLE participants ADD COLUMN IF NOT EXISTS adresse TEXT;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS code_postal VARCHAR(10);
ALTER TABLE participants ADD COLUMN IF NOT EXISTS ville VARCHAR(100);
ALTER TABLE participants ADD COLUMN IF NOT EXISTS niveau_etudes VARCHAR(100);
ALTER TABLE participants ADD COLUMN IF NOT EXISTS situation_handicap BOOLEAN DEFAULT FALSE;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS amenagements_necessaires TEXT;

-- 5. Tables évaluations, emargements, etc.
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID NOT NULL REFERENCES sessions_formation(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    satisfaction_globale INTEGER CHECK (satisfaction_globale BETWEEN 1 AND 5),
    atteinte_objectifs INTEGER CHECK (atteinte_objectifs BETWEEN 1 AND 5),
    qualite_formateur INTEGER CHECK (qualite_formateur BETWEEN 1 AND 5),
    qualite_supports INTEGER CHECK (qualite_supports BETWEEN 1 AND 5),
    qualite_organisation INTEGER CHECK (qualite_organisation BETWEEN 1 AND 5),
    qualite_contenu INTEGER CHECK (qualite_contenu BETWEEN 1 AND 5),
    mise_en_pratique BOOLEAN,
    impact_travail INTEGER CHECK (impact_travail BETWEEN 1 AND 5),
    besoin_complement BOOLEAN,
    commentaires TEXT,
    points_forts TEXT,
    points_amelioration TEXT,
    suggestions TEXT,
    recommandation BOOLEAN,
    note_recommandation INTEGER CHECK (note_recommandation BETWEEN 0 AND 10),
    date_evaluation DATE,
    repondu BOOLEAN DEFAULT FALSE,
    date_reponse TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_evaluations_session_id ON evaluations(session_formation_id);
CREATE INDEX idx_evaluations_participant_id ON evaluations(participant_id);
CREATE INDEX idx_evaluations_type ON evaluations(type);

CREATE TRIGGER update_evaluations_updated_at
BEFORE UPDATE ON evaluations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS emargements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID NOT NULL REFERENCES sessions_formation(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    date_emargement DATE NOT NULL,
    periode VARCHAR(20) NOT NULL,
    heure_arrivee TIME,
    heure_depart TIME,
    signature_stagiaire_path TEXT,
    signature_formateur_path TEXT,
    present BOOLEAN DEFAULT TRUE,
    motif_absence TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_formation_id, participant_id, date_emargement, periode)
);

CREATE INDEX idx_emargements_session_id ON emargements(session_formation_id);
CREATE INDEX idx_emargements_participant_id ON emargements(participant_id);

CREATE TRIGGER update_emargements_updated_at
BEFORE UPDATE ON emargements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS questionnaires_prealables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID NOT NULL REFERENCES sessions_formation(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    niveau_competence VARCHAR(50),
    experience_domaine TEXT,
    attentes TEXT,
    besoins_specifiques TEXT,
    objectifs_personnels TEXT,
    questions_prealables TEXT,
    besoin_amenagement BOOLEAN DEFAULT FALSE,
    type_amenagement TEXT,
    date_envoi DATE,
    date_reponse DATE,
    repondu BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_formation_id, participant_id)
);

CREATE INDEX idx_questionnaires_session_id ON questionnaires_prealables(session_formation_id);
CREATE INDEX idx_questionnaires_participant_id ON questionnaires_prealables(participant_id);

CREATE TRIGGER update_questionnaires_updated_at
BEFORE UPDATE ON questionnaires_prealables
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS reclamations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID REFERENCES sessions_formation(id) ON DELETE SET NULL,
    participant_id UUID REFERENCES participants(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    objet VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    statut VARCHAR(50) DEFAULT 'nouvelle',
    date_reception DATE NOT NULL,
    date_traitement DATE,
    date_cloture DATE,
    reponse TEXT,
    actions_correctives TEXT,
    responsable_traitement VARCHAR(255),
    satisfaction_resolution INTEGER CHECK (satisfaction_resolution BETWEEN 1 AND 5),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reclamations_session_id ON reclamations(session_formation_id);
CREATE INDEX idx_reclamations_statut ON reclamations(statut);

CREATE TRIGGER update_reclamations_updated_at
BEFORE UPDATE ON reclamations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 6. Vues
CREATE OR REPLACE VIEW vue_sessions_complete AS
SELECT 
    s.*,
    f.titre AS formation_titre,
    f.description AS formation_description,
    f.duree AS formation_duree,
    f.prix_ht AS formation_prix_ht,
    f.objectifs AS formation_objectifs,
    f.prerequis AS formation_prerequis,
    f.programme AS formation_programme,
    f.nature_action AS formation_nature_action,
    f.public_vise AS formation_public_vise,
    e.nom AS entreprise_nom,
    e.siret AS entreprise_siret,
    e.adresse AS entreprise_adresse,
    e.code_postal AS entreprise_code_postal,
    e.ville AS entreprise_ville,
    e.email_contact AS entreprise_email,
    e.telephone AS entreprise_telephone,
    e.representant_legal_nom AS entreprise_representant_nom,
    e.representant_legal_prenom AS entreprise_representant_prenom,
    form.nom AS formateur_nom,
    form.prenom AS formateur_prenom,
    form.email AS formateur_email,
    form.telephone AS formateur_telephone
FROM sessions_formation s
JOIN formations_catalogue f ON s.formation_catalogue_id = f.id
JOIN entreprises e ON s.entreprise_id = e.id
LEFT JOIN formateurs form ON s.formateur_id = form.id;

-- 7. Fonctions
CREATE OR REPLACE FUNCTION generer_numero_convention()
RETURNS VARCHAR(50) AS $$
DECLARE
    annee VARCHAR(4);
    numero_sequence INTEGER;
    nouveau_numero VARCHAR(50);
BEGIN
    annee := EXTRACT(YEAR FROM NOW())::VARCHAR;
    SELECT COUNT(*) + 1 INTO numero_sequence
    FROM sessions_formation
    WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW())
    AND numero_convention IS NOT NULL;
    nouveau_numero := 'CONV-' || annee || '-' || LPAD(numero_sequence::VARCHAR, 4, '0');
    RETURN nouveau_numero;
END;
$$ LANGUAGE plpgsql;

-- 8. RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisme_formation ENABLE ROW LEVEL SECURITY;
ALTER TABLE formateurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emargements ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires_prealables ENABLE ROW LEVEL SECURITY;
ALTER TABLE reclamations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accès complet pour les utilisateurs authentifiés" ON documents FOR ALL TO authenticated USING (true);
CREATE POLICY "Accès complet pour les utilisateurs authentifiés" ON organisme_formation FOR ALL TO authenticated USING (true);
CREATE POLICY "Accès complet pour les utilisateurs authentifiés" ON formateurs FOR ALL TO authenticated USING (true);
CREATE POLICY "Accès complet pour les utilisateurs authentifiés" ON evaluations FOR ALL TO authenticated USING (true);
CREATE POLICY "Accès complet pour les utilisateurs authentifiés" ON emargements FOR ALL TO authenticated USING (true);
CREATE POLICY "Accès complet pour les utilisateurs authentifiés" ON questionnaires_prealables FOR ALL TO authenticated USING (true);
CREATE POLICY "Accès complet pour les utilisateurs authentifiés" ON reclamations FOR ALL TO authenticated USING (true);

-- 9. Données initiales
INSERT INTO organisme_formation (
    nom, raison_sociale, siret, numero_declaration_activite,
    adresse, code_postal, ville, telephone, email,
    representant_legal_nom, representant_legal_prenom, representant_legal_fonction
) VALUES (
    'Mon Organisme de Formation',
    'Mon Organisme de Formation SARL',
    '12345678901234',
    '11755123456',
    '123 Rue de la Formation',
    '75001',
    'Paris',
    '01 23 45 67 89',
    'contact@monorganisme.fr',
    'Dupont',
    'Jean',
    'Directeur'
) ON CONFLICT (siret) DO NOTHING;
