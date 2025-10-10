-- ============================================
-- SCHÉMA SQL COMPLET POUR CONFORMITÉ QUALIOPI
-- ============================================
-- Date: 8 octobre 2025
-- Version: 1.0
-- Description: Schéma complet avec toutes les tables nécessaires pour générer les 19 documents Qualiopi

-- ============================================
-- 1. TABLE ORGANISME_FORMATION
-- ============================================
-- Informations sur l'organisme de formation (vous)
CREATE TABLE IF NOT EXISTS organisme_formation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    raison_sociale VARCHAR(255),
    siret VARCHAR(14) NOT NULL UNIQUE,
    numero_declaration_activite VARCHAR(20) NOT NULL UNIQUE, -- NDA (Numéro de Déclaration d'Activité)
    adresse TEXT NOT NULL,
    code_postal VARCHAR(10) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    pays VARCHAR(100) DEFAULT 'France',
    telephone VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    site_web VARCHAR(255),
    
    -- Représentant légal
    representant_legal_nom VARCHAR(255) NOT NULL,
    representant_legal_prenom VARCHAR(255) NOT NULL,
    representant_legal_fonction VARCHAR(100) NOT NULL,
    representant_legal_email VARCHAR(255),
    
    -- Informations complémentaires
    logo_path TEXT, -- Chemin vers le logo dans Supabase Storage
    signature_path TEXT, -- Chemin vers la signature dans Supabase Storage
    
    -- Textes légaux standards
    reglement_interieur TEXT,
    conditions_generales_vente TEXT,
    politique_handicap TEXT,
    delai_retractation TEXT DEFAULT '10 jours',
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_organisme_siret ON organisme_formation(siret);
CREATE INDEX idx_organisme_nda ON organisme_formation(numero_declaration_activite);

-- ============================================
-- 2. MISE À JOUR TABLE ENTREPRISES
-- ============================================
-- Ajout des champs manquants pour les entreprises clientes
ALTER TABLE entreprises ADD COLUMN IF NOT EXISTS representant_legal_nom VARCHAR(255);
ALTER TABLE entreprises ADD COLUMN IF NOT EXISTS representant_legal_prenom VARCHAR(255);
ALTER TABLE entreprises ADD COLUMN IF NOT EXISTS representant_legal_fonction VARCHAR(100);
ALTER TABLE entreprises ADD COLUMN IF NOT EXISTS representant_legal_email VARCHAR(255);
ALTER TABLE entreprises ADD COLUMN IF NOT EXISTS numero_tva VARCHAR(20);

-- ============================================
-- 3. MISE À JOUR TABLE FORMATIONS_CATALOGUE
-- ============================================
-- Ajout des champs Qualiopi manquants
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS nature_action VARCHAR(100) DEFAULT 'Formation'; -- Formation, Bilan, VAE, Apprentissage
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS public_vise TEXT;
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS methodes_pedagogiques TEXT;
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS moyens_pedagogiques TEXT;
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS modalites_evaluation TEXT;
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS accessibilite_handicap TEXT;
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS modalites_acces TEXT;
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS delai_acces VARCHAR(100) DEFAULT '2 semaines';
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS competences_visees TEXT;
ALTER TABLE formations_catalogue ADD COLUMN IF NOT EXISTS certification VARCHAR(255); -- Nom de la certification si applicable

-- ============================================
-- 4. TABLE FORMATEURS
-- ============================================
-- Gestion des formateurs (au lieu d'un simple VARCHAR)
CREATE TABLE IF NOT EXISTS formateurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telephone VARCHAR(20),
    
    -- Informations professionnelles
    specialites TEXT[], -- Array de spécialités
    cv_path TEXT, -- Chemin vers le CV dans Supabase Storage
    diplomes TEXT,
    experience TEXT,
    certifications TEXT,
    
    -- Statut
    statut VARCHAR(50) DEFAULT 'actif', -- actif, inactif, externe
    type_contrat VARCHAR(50), -- CDI, freelance, sous-traitant
    
    -- Informations administratives
    siret VARCHAR(14), -- Si freelance
    numero_formateur VARCHAR(50), -- Numéro interne
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_formateurs_nom ON formateurs(nom, prenom);
CREATE INDEX idx_formateurs_email ON formateurs(email);
CREATE INDEX idx_formateurs_statut ON formateurs(statut);

CREATE TRIGGER update_formateurs_updated_at
BEFORE UPDATE ON formateurs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. MISE À JOUR TABLE SESSIONS_FORMATION
-- ============================================
-- Ajout des champs Qualiopi manquants
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

-- Créer un index sur formateur_id
CREATE INDEX IF NOT EXISTS idx_sessions_formateur_id ON sessions_formation(formateur_id);

-- ============================================
-- 6. TABLE EVALUATIONS
-- ============================================
-- Gestion des évaluations (à chaud, à froid, satisfaction client, OPCO)
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID NOT NULL REFERENCES sessions_formation(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE, -- NULL pour évaluation client ou OPCO
    
    -- Type d'évaluation
    type VARCHAR(50) NOT NULL, -- 'a_chaud', 'a_froid', 'satisfaction_client', 'opco', 'formateur'
    
    -- Questions standardisées (notes de 1 à 5)
    satisfaction_globale INTEGER CHECK (satisfaction_globale BETWEEN 1 AND 5),
    atteinte_objectifs INTEGER CHECK (atteinte_objectifs BETWEEN 1 AND 5),
    qualite_formateur INTEGER CHECK (qualite_formateur BETWEEN 1 AND 5),
    qualite_supports INTEGER CHECK (qualite_supports BETWEEN 1 AND 5),
    qualite_organisation INTEGER CHECK (qualite_organisation BETWEEN 1 AND 5),
    qualite_contenu INTEGER CHECK (qualite_contenu BETWEEN 1 AND 5),
    
    -- Questions spécifiques évaluation à froid
    mise_en_pratique BOOLEAN, -- A-t-il mis en pratique ?
    impact_travail INTEGER CHECK (impact_travail BETWEEN 1 AND 5), -- Impact sur le travail
    besoin_complement BOOLEAN, -- Besoin d'une formation complémentaire ?
    
    -- Questions ouvertes
    commentaires TEXT,
    points_forts TEXT,
    points_amelioration TEXT,
    suggestions TEXT,
    
    -- Recommandation
    recommandation BOOLEAN,
    note_recommandation INTEGER CHECK (note_recommandation BETWEEN 0 AND 10), -- NPS
    
    -- Métadonnées
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
CREATE INDEX idx_evaluations_repondu ON evaluations(repondu);

CREATE TRIGGER update_evaluations_updated_at
BEFORE UPDATE ON evaluations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. TABLE EMARGEMENTS
-- ============================================
-- Gestion des feuilles d'émargement (signatures)
CREATE TABLE IF NOT EXISTS emargements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID NOT NULL REFERENCES sessions_formation(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    
    -- Date et période
    date_emargement DATE NOT NULL,
    periode VARCHAR(20) NOT NULL, -- 'matin', 'apres-midi', 'journee'
    
    -- Horaires réels
    heure_arrivee TIME,
    heure_depart TIME,
    
    -- Signatures
    signature_stagiaire_path TEXT, -- Chemin vers la signature dans Supabase Storage
    signature_formateur_path TEXT,
    
    -- Présence
    present BOOLEAN DEFAULT TRUE,
    motif_absence TEXT,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte d'unicité : un participant ne peut signer qu'une fois par période
    UNIQUE(session_formation_id, participant_id, date_emargement, periode)
);

CREATE INDEX idx_emargements_session_id ON emargements(session_formation_id);
CREATE INDEX idx_emargements_participant_id ON emargements(participant_id);
CREATE INDEX idx_emargements_date ON emargements(date_emargement);
CREATE INDEX idx_emargements_present ON emargements(present);

CREATE TRIGGER update_emargements_updated_at
BEFORE UPDATE ON emargements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. TABLE QUESTIONNAIRES_PREALABLES
-- ============================================
-- Questionnaires préalables à la formation (J-7)
CREATE TABLE IF NOT EXISTS questionnaires_prealables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID NOT NULL REFERENCES sessions_formation(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    
    -- Informations sur le participant
    niveau_competence VARCHAR(50), -- debutant, intermediaire, avance, expert
    experience_domaine TEXT,
    attentes TEXT,
    besoins_specifiques TEXT,
    
    -- Questions spécifiques
    objectifs_personnels TEXT,
    questions_prealables TEXT,
    
    -- Accessibilité
    besoin_amenagement BOOLEAN DEFAULT FALSE,
    type_amenagement TEXT,
    
    -- Métadonnées
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
CREATE INDEX idx_questionnaires_repondu ON questionnaires_prealables(repondu);

CREATE TRIGGER update_questionnaires_updated_at
BEFORE UPDATE ON questionnaires_prealables
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. TABLE RECLAMATIONS
-- ============================================
-- Gestion des réclamations (obligatoire Qualiopi)
CREATE TABLE IF NOT EXISTS reclamations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID REFERENCES sessions_formation(id) ON DELETE SET NULL,
    participant_id UUID REFERENCES participants(id) ON DELETE SET NULL,
    
    -- Informations réclamation
    type VARCHAR(50) NOT NULL, -- 'qualite', 'organisation', 'formateur', 'contenu', 'autre'
    objet VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Traitement
    statut VARCHAR(50) DEFAULT 'nouvelle', -- nouvelle, en_cours, traitee, cloturee
    date_reception DATE NOT NULL,
    date_traitement DATE,
    date_cloture DATE,
    
    -- Réponse
    reponse TEXT,
    actions_correctives TEXT,
    responsable_traitement VARCHAR(255),
    
    -- Satisfaction après traitement
    satisfaction_resolution INTEGER CHECK (satisfaction_resolution BETWEEN 1 AND 5),
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reclamations_session_id ON reclamations(session_formation_id);
CREATE INDEX idx_reclamations_statut ON reclamations(statut);
CREATE INDEX idx_reclamations_type ON reclamations(type);

CREATE TRIGGER update_reclamations_updated_at
BEFORE UPDATE ON reclamations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. MISE À JOUR TABLE PARTICIPANTS
-- ============================================
-- Ajout de champs supplémentaires
ALTER TABLE participants ADD COLUMN IF NOT EXISTS date_naissance DATE;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS lieu_naissance VARCHAR(255);
ALTER TABLE participants ADD COLUMN IF NOT EXISTS adresse TEXT;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS code_postal VARCHAR(10);
ALTER TABLE participants ADD COLUMN IF NOT EXISTS ville VARCHAR(100);
ALTER TABLE participants ADD COLUMN IF NOT EXISTS niveau_etudes VARCHAR(100);
ALTER TABLE participants ADD COLUMN IF NOT EXISTS situation_handicap BOOLEAN DEFAULT FALSE;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS amenagements_necessaires TEXT;

-- ============================================
-- 11. MISE À JOUR TABLE DOCUMENTS
-- ============================================
-- Ajout de champs pour mieux gérer les documents
ALTER TABLE documents ADD COLUMN IF NOT EXISTS statut VARCHAR(50) DEFAULT 'genere'; -- genere, envoye, signe, archive
ALTER TABLE documents ADD COLUMN IF NOT EXISTS date_envoi TIMESTAMP WITH TIME ZONE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS date_signature TIMESTAMP WITH TIME ZONE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS signature_yousign_id VARCHAR(255); -- ID Yousign pour le suivi
ALTER TABLE documents ADD COLUMN IF NOT EXISTS url_signature TEXT; -- URL de signature Yousign

-- ============================================
-- 12. VUES UTILES
-- ============================================

-- Vue complète des sessions avec toutes les informations
CREATE OR REPLACE VIEW vue_sessions_complete AS
SELECT 
    s.id,
    s.date_debut,
    s.date_fin,
    s.lieu,
    s.nombre_participants,
    s.statut,
    s.prix_total_ht,
    s.notes,
    s.horaire_debut,
    s.horaire_fin,
    s.numero_convention,
    s.date_signature_convention,
    s.financement_opco,
    s.nom_opco,
    s.metadata,
    s.created_at,
    s.updated_at,
    
    -- Formation
    f.id AS formation_id,
    f.titre AS formation_titre,
    f.description AS formation_description,
    f.duree AS formation_duree,
    f.prix_ht AS formation_prix_ht,
    f.objectifs AS formation_objectifs,
    f.prerequis AS formation_prerequis,
    f.programme AS formation_programme,
    f.nature_action AS formation_nature_action,
    f.public_vise AS formation_public_vise,
    
    -- Entreprise
    e.id AS entreprise_id,
    e.nom AS entreprise_nom,
    e.siret AS entreprise_siret,
    e.adresse AS entreprise_adresse,
    e.code_postal AS entreprise_code_postal,
    e.ville AS entreprise_ville,
    e.email_contact AS entreprise_email,
    e.telephone AS entreprise_telephone,
    e.representant_legal_nom AS entreprise_representant_nom,
    e.representant_legal_prenom AS entreprise_representant_prenom,
    
    -- Formateur
    form.id AS formateur_id,
    form.nom AS formateur_nom,
    form.prenom AS formateur_prenom,
    form.email AS formateur_email,
    form.telephone AS formateur_telephone
    
FROM sessions_formation s
JOIN formations_catalogue f ON s.formation_catalogue_id = f.id
JOIN entreprises e ON s.entreprise_id = e.id
LEFT JOIN formateurs form ON s.formateur_id = form.id;

-- Vue des évaluations avec statistiques
CREATE OR REPLACE VIEW vue_evaluations_stats AS
SELECT 
    session_formation_id,
    type,
    COUNT(*) AS nombre_reponses,
    AVG(satisfaction_globale) AS avg_satisfaction,
    AVG(atteinte_objectifs) AS avg_objectifs,
    AVG(qualite_formateur) AS avg_formateur,
    AVG(qualite_supports) AS avg_supports,
    AVG(qualite_organisation) AS avg_organisation,
    COUNT(CASE WHEN recommandation = TRUE THEN 1 END) AS nombre_recommandations,
    AVG(note_recommandation) AS avg_nps
FROM evaluations
WHERE repondu = TRUE
GROUP BY session_formation_id, type;

-- Vue des émargements par session
CREATE OR REPLACE VIEW vue_emargements_session AS
SELECT 
    e.session_formation_id,
    e.date_emargement,
    COUNT(*) AS nombre_participants,
    COUNT(CASE WHEN e.present = TRUE THEN 1 END) AS nombre_presents,
    COUNT(CASE WHEN e.present = FALSE THEN 1 END) AS nombre_absents,
    ROUND(COUNT(CASE WHEN e.present = TRUE THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) AS taux_presence
FROM emargements e
GROUP BY e.session_formation_id, e.date_emargement;

-- ============================================
-- 13. FONCTIONS UTILES
-- ============================================

-- Fonction pour générer un numéro de convention unique
CREATE OR REPLACE FUNCTION generer_numero_convention()
RETURNS VARCHAR(50) AS $$
DECLARE
    annee VARCHAR(4);
    numero_sequence INTEGER;
    nouveau_numero VARCHAR(50);
BEGIN
    annee := EXTRACT(YEAR FROM NOW())::VARCHAR;
    
    -- Compter le nombre de conventions cette année
    SELECT COUNT(*) + 1 INTO numero_sequence
    FROM sessions_formation
    WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW())
    AND numero_convention IS NOT NULL;
    
    -- Format: CONV-2025-0001
    nouveau_numero := 'CONV-' || annee || '-' || LPAD(numero_sequence::VARCHAR, 4, '0');
    
    RETURN nouveau_numero;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer le taux de présence d'un participant
CREATE OR REPLACE FUNCTION calculer_taux_presence(p_participant_id UUID, p_session_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    total_emargements INTEGER;
    emargements_presents INTEGER;
    taux NUMERIC;
BEGIN
    SELECT COUNT(*) INTO total_emargements
    FROM emargements
    WHERE participant_id = p_participant_id AND session_formation_id = p_session_id;
    
    IF total_emargements = 0 THEN
        RETURN 0;
    END IF;
    
    SELECT COUNT(*) INTO emargements_presents
    FROM emargements
    WHERE participant_id = p_participant_id 
    AND session_formation_id = p_session_id 
    AND present = TRUE;
    
    taux := (emargements_presents::NUMERIC / total_emargements::NUMERIC) * 100;
    
    RETURN ROUND(taux, 2);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 14. POLITIQUES RLS (Row Level Security)
-- ============================================

-- Activer RLS sur les nouvelles tables
ALTER TABLE organisme_formation ENABLE ROW LEVEL SECURITY;
ALTER TABLE formateurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emargements ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires_prealables ENABLE ROW LEVEL SECURITY;
ALTER TABLE reclamations ENABLE ROW LEVEL SECURITY;

-- Politiques pour organisme_formation
CREATE POLICY "Accès complet pour les utilisateurs authentifiés" ON organisme_formation
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Lecture pour les utilisateurs anonymes" ON organisme_formation
    FOR SELECT TO anon USING (true);

-- Politiques pour formateurs
CREATE POLICY "Accès complet pour les utilisateurs authentifiés" ON formateurs
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Lecture pour les utilisateurs anonymes" ON formateurs
    FOR SELECT TO anon USING (true);

-- Politiques pour evaluations
CREATE POLICY "Accès complet pour les utilisateurs authentifiés" ON evaluations
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Lecture pour les utilisateurs anonymes" ON evaluations
    FOR SELECT TO anon USING (true);

-- Politiques pour emargements
CREATE POLICY "Accès complet pour les utilisateurs authentifiés" ON emargements
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Lecture pour les utilisateurs anonymes" ON emargements
    FOR SELECT TO anon USING (true);

-- Politiques pour questionnaires_prealables
CREATE POLICY "Accès complet pour les utilisateurs authentifiés" ON questionnaires_prealables
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Lecture pour les utilisateurs anonymes" ON questionnaires_prealables
    FOR SELECT TO anon USING (true);

-- Politiques pour reclamations
CREATE POLICY "Accès complet pour les utilisateurs authentifiés" ON reclamations
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Lecture pour les utilisateurs anonymes" ON reclamations
    FOR SELECT TO anon USING (true);

-- ============================================
-- 15. DONNÉES INITIALES
-- ============================================

-- Insérer un organisme de formation par défaut (à personnaliser)
INSERT INTO organisme_formation (
    nom,
    raison_sociale,
    siret,
    numero_declaration_activite,
    adresse,
    code_postal,
    ville,
    telephone,
    email,
    representant_legal_nom,
    representant_legal_prenom,
    representant_legal_fonction,
    reglement_interieur,
    delai_retractation
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
    'Directeur',
    'Le règlement intérieur est disponible sur demande et affiché dans les locaux de formation.',
    '10 jours'
) ON CONFLICT (siret) DO NOTHING;

-- ============================================
-- FIN DU SCHÉMA
-- ============================================

-- Afficher un message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Schéma Qualiopi créé avec succès !';
    RAISE NOTICE '📊 Tables créées : organisme_formation, formateurs, evaluations, emargements, questionnaires_prealables, reclamations';
    RAISE NOTICE '🔧 Tables mises à jour : entreprises, formations_catalogue, sessions_formation, participants, documents';
    RAISE NOTICE '👁️ Vues créées : vue_sessions_complete, vue_evaluations_stats, vue_emargements_session';
    RAISE NOTICE '⚙️ Fonctions créées : generer_numero_convention(), calculer_taux_presence()';
    RAISE NOTICE '🔒 Politiques RLS activées sur toutes les tables';
END $$;
