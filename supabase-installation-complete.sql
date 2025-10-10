-- ============================================
-- INSTALLATION COMPLÈTE - AUTOMATE FORMATION
-- ============================================
-- Date: 2025-10-08
-- Description: Script d'installation complet pour la base de données
--              Exécuter ce fichier pour créer toutes les tables nécessaires
-- 
-- ORDRE D'EXÉCUTION:
-- 1. Tables de base (entreprises, formations, sessions, participants)
-- 2. Champs workflow (devis, convention, convocations)
-- 3. Tables d'automatisation (documents, emails, logs, etc.)
-- 4. Vues et fonctions utilitaires

-- ============================================
-- PARTIE 1: TABLES DE BASE
-- ============================================

-- Table: entreprises
CREATE TABLE IF NOT EXISTS entreprises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    siret VARCHAR(14),
    email_contact VARCHAR(255),
    telephone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: formations_catalogue
CREATE TABLE IF NOT EXISTS formations_catalogue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    duree INTEGER, -- en heures
    prix_ht DECIMAL(10,2),
    objectifs TEXT,
    programme TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: sessions_formation
CREATE TABLE IF NOT EXISTS sessions_formation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entreprise_id UUID NOT NULL REFERENCES entreprises(id) ON DELETE CASCADE,
    formation_catalogue_id UUID NOT NULL REFERENCES formations_catalogue(id) ON DELETE CASCADE,
    date_debut DATE,
    date_fin DATE,
    statut VARCHAR(50) DEFAULT 'demande',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: participants
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID NOT NULL REFERENCES sessions_formation(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    telephone VARCHAR(20),
    fonction VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PARTIE 2: CHAMPS WORKFLOW
-- ============================================

-- Ajouter les champs de workflow à sessions_formation
ALTER TABLE sessions_formation 
ADD COLUMN IF NOT EXISTS nombre_participants INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS devis_envoye_le TIMESTAMP,
ADD COLUMN IF NOT EXISTS devis_accepte_le TIMESTAMP,
ADD COLUMN IF NOT EXISTS devis_refuse_le TIMESTAMP,
ADD COLUMN IF NOT EXISTS raison_annulation VARCHAR(100),
ADD COLUMN IF NOT EXISTS convention_signee_le TIMESTAMP,
ADD COLUMN IF NOT EXISTS convocations_envoyees_le TIMESTAMP,
ADD COLUMN IF NOT EXISTS docuseal_url TEXT;

-- ============================================
-- PARTIE 3: TABLES D'AUTOMATISATION
-- ============================================

-- Table: documents
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID NOT NULL REFERENCES sessions_formation(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    type_document VARCHAR(50) NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    chemin_fichier TEXT,
    url_fichier TEXT,
    taille_octets INTEGER,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    genere_automatiquement BOOLEAN DEFAULT TRUE,
    genere_par UUID,
    template_utilise VARCHAR(100),
    statut VARCHAR(50) DEFAULT 'genere',
    date_generation TIMESTAMP DEFAULT NOW(),
    date_envoi TIMESTAMP,
    date_signature TIMESTAMP,
    docuseal_submission_id VARCHAR(255),
    docuseal_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: emails_log
CREATE TABLE IF NOT EXISTS emails_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID REFERENCES sessions_formation(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    destinataire_email VARCHAR(255) NOT NULL,
    destinataire_nom VARCHAR(255),
    sujet TEXT NOT NULL,
    corps_text TEXT,
    corps_html TEXT,
    type_email VARCHAR(50) NOT NULL,
    statut VARCHAR(50) DEFAULT 'en_attente',
    resend_email_id VARCHAR(255),
    resend_response JSONB,
    date_envoi TIMESTAMP,
    date_delivre TIMESTAMP,
    date_ouvert TIMESTAMP,
    date_clique TIMESTAMP,
    erreur_message TEXT,
    nombre_tentatives INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: actions_log
CREATE TABLE IF NOT EXISTS actions_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID REFERENCES sessions_formation(id) ON DELETE CASCADE,
    user_id UUID,
    user_email VARCHAR(255),
    user_nom VARCHAR(255),
    type_action VARCHAR(100) NOT NULL,
    description TEXT,
    donnees_avant JSONB,
    donnees_apres JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table: evaluations
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID NOT NULL REFERENCES sessions_formation(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    type_evaluation VARCHAR(50) NOT NULL,
    reponses JSONB NOT NULL DEFAULT '{}'::jsonb,
    score_global DECIMAL(3,2),
    score_contenu DECIMAL(3,2),
    score_formateur DECIMAL(3,2),
    score_organisation DECIMAL(3,2),
    score_satisfaction DECIMAL(3,2),
    commentaires TEXT,
    points_forts TEXT,
    points_amelioration TEXT,
    statut VARCHAR(50) DEFAULT 'en_attente',
    date_envoi TIMESTAMP,
    date_completion TIMESTAMP,
    date_expiration TIMESTAMP,
    token_unique VARCHAR(255) UNIQUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: emargements
CREATE TABLE IF NOT EXISTS emargements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID NOT NULL REFERENCES sessions_formation(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    date_emargement DATE NOT NULL,
    heure_debut TIME,
    heure_fin TIME,
    duree_heures DECIMAL(4,2),
    present BOOLEAN DEFAULT TRUE,
    retard_minutes INTEGER DEFAULT 0,
    depart_anticipe BOOLEAN DEFAULT FALSE,
    signature_presente BOOLEAN DEFAULT FALSE,
    signature_numerique TEXT,
    signature_date TIMESTAMP,
    valide_par_formateur BOOLEAN DEFAULT FALSE,
    formateur_nom VARCHAR(255),
    formateur_signature TEXT,
    formateur_date TIMESTAMP,
    commentaires TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: notifications_queue
CREATE TABLE IF NOT EXISTS notifications_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_formation_id UUID REFERENCES sessions_formation(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    type_notification VARCHAR(50) NOT NULL,
    destinataire VARCHAR(255) NOT NULL,
    sujet TEXT,
    message TEXT,
    template_id VARCHAR(100),
    variables JSONB DEFAULT '{}'::jsonb,
    statut VARCHAR(50) DEFAULT 'en_attente',
    priorite INTEGER DEFAULT 5,
    date_planifiee TIMESTAMP,
    date_traitement TIMESTAMP,
    nombre_tentatives INTEGER DEFAULT 0,
    max_tentatives INTEGER DEFAULT 3,
    derniere_erreur TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: templates
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL UNIQUE,
    type_template VARCHAR(50) NOT NULL,
    categorie VARCHAR(50),
    contenu TEXT NOT NULL,
    variables_disponibles JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    actif BOOLEAN DEFAULT TRUE,
    version INTEGER DEFAULT 1,
    fichier_template TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PARTIE 4: INDEX
-- ============================================

-- Index entreprises
CREATE INDEX IF NOT EXISTS idx_entreprises_nom ON entreprises(nom);
CREATE INDEX IF NOT EXISTS idx_entreprises_email ON entreprises(email_contact);

-- Index sessions_formation
CREATE INDEX IF NOT EXISTS idx_sessions_statut ON sessions_formation(statut);
CREATE INDEX IF NOT EXISTS idx_sessions_entreprise ON sessions_formation(entreprise_id);
CREATE INDEX IF NOT EXISTS idx_sessions_formation_catalogue ON sessions_formation(formation_catalogue_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date_debut ON sessions_formation(date_debut);

-- Index participants
CREATE INDEX IF NOT EXISTS idx_participants_session ON participants(session_formation_id);
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);

-- Index documents
CREATE INDEX IF NOT EXISTS idx_documents_session ON documents(session_formation_id);
CREATE INDEX IF NOT EXISTS idx_documents_participant ON documents(participant_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type_document);
CREATE INDEX IF NOT EXISTS idx_documents_statut ON documents(statut);

-- Index emails_log
CREATE INDEX IF NOT EXISTS idx_emails_session ON emails_log(session_formation_id);
CREATE INDEX IF NOT EXISTS idx_emails_participant ON emails_log(participant_id);
CREATE INDEX IF NOT EXISTS idx_emails_type ON emails_log(type_email);
CREATE INDEX IF NOT EXISTS idx_emails_statut ON emails_log(statut);

-- Index actions_log
CREATE INDEX IF NOT EXISTS idx_actions_session ON actions_log(session_formation_id);
CREATE INDEX IF NOT EXISTS idx_actions_type ON actions_log(type_action);
CREATE INDEX IF NOT EXISTS idx_actions_date ON actions_log(created_at);

-- Index evaluations
CREATE INDEX IF NOT EXISTS idx_evaluations_session ON evaluations(session_formation_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_participant ON evaluations(participant_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_type ON evaluations(type_evaluation);

-- Index emargements
CREATE INDEX IF NOT EXISTS idx_emargements_session ON emargements(session_formation_id);
CREATE INDEX IF NOT EXISTS idx_emargements_participant ON emargements(participant_id);
CREATE INDEX IF NOT EXISTS idx_emargements_date ON emargements(date_emargement);

-- Index notifications_queue
CREATE INDEX IF NOT EXISTS idx_notifications_statut ON notifications_queue(statut);
CREATE INDEX IF NOT EXISTS idx_notifications_date_planifiee ON notifications_queue(date_planifiee);

-- Index templates
CREATE INDEX IF NOT EXISTS idx_templates_nom ON templates(nom);
CREATE INDEX IF NOT EXISTS idx_templates_type ON templates(type_template);

-- ============================================
-- PARTIE 5: TRIGGERS
-- ============================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers updated_at
DROP TRIGGER IF EXISTS update_entreprises_updated_at ON entreprises;
CREATE TRIGGER update_entreprises_updated_at
BEFORE UPDATE ON entreprises
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_formations_catalogue_updated_at ON formations_catalogue;
CREATE TRIGGER update_formations_catalogue_updated_at
BEFORE UPDATE ON formations_catalogue
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_formation_updated_at ON sessions_formation;
CREATE TRIGGER update_sessions_formation_updated_at
BEFORE UPDATE ON sessions_formation
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_participants_updated_at ON participants;
CREATE TRIGGER update_participants_updated_at
BEFORE UPDATE ON participants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_emails_log_updated_at ON emails_log;
CREATE TRIGGER update_emails_log_updated_at
BEFORE UPDATE ON emails_log
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_evaluations_updated_at ON evaluations;
CREATE TRIGGER update_evaluations_updated_at
BEFORE UPDATE ON evaluations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_emargements_updated_at ON emargements;
CREATE TRIGGER update_emargements_updated_at
BEFORE UPDATE ON emargements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notifications_queue_updated_at ON notifications_queue;
CREATE TRIGGER update_notifications_queue_updated_at
BEFORE UPDATE ON notifications_queue
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at
BEFORE UPDATE ON templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour mettre à jour le nombre de participants
CREATE OR REPLACE FUNCTION update_session_participants_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE sessions_formation
    SET nombre_participants = (
        SELECT COUNT(*)
        FROM participants
        WHERE session_formation_id = COALESCE(NEW.session_formation_id, OLD.session_formation_id)
    )
    WHERE id = COALESCE(NEW.session_formation_id, OLD.session_formation_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger pour compter les participants
DROP TRIGGER IF EXISTS trigger_update_participants_count ON participants;
CREATE TRIGGER trigger_update_participants_count
AFTER INSERT OR DELETE ON participants
FOR EACH ROW
EXECUTE FUNCTION update_session_participants_count();

-- Initialiser le nombre de participants pour les sessions existantes
UPDATE sessions_formation s
SET nombre_participants = (
    SELECT COUNT(*)
    FROM participants p
    WHERE p.session_formation_id = s.id
);

-- ============================================
-- PARTIE 6: VUES
-- ============================================

-- Vue: sessions avec toutes les informations
DROP VIEW IF EXISTS vue_sessions_formation CASCADE;
CREATE VIEW vue_sessions_formation AS
SELECT 
    s.id,
    s.entreprise_id,
    s.formation_catalogue_id,
    s.date_debut,
    s.date_fin,
    s.statut,
    s.nombre_participants,
    s.devis_envoye_le,
    s.devis_accepte_le,
    s.devis_refuse_le,
    s.raison_annulation,
    s.convocations_envoyees_le,
    s.docuseal_url,
    s.created_at AS session_created_at,
    s.updated_at AS session_updated_at,
    s.modalite,
    COALESCE(s.formation_titre, f.titre) AS formation_titre,
    e.nom AS entreprise_nom,
    e.email_contact AS entreprise_email,
    e.telephone AS entreprise_telephone,
    e.adresse AS entreprise_adresse,
    e.code_postal AS entreprise_code_postal,
    e.ville AS entreprise_ville,
    f.titre AS formation_catalogue_titre,
    f.description AS formation_description,
    f.duree AS formation_duree,
    f.prix_ht AS formation_prix_ht
FROM sessions_formation s
LEFT JOIN entreprises e ON s.entreprise_id = e.id
LEFT JOIN formations_catalogue f ON s.formation_catalogue_id = f.id;

-- Vue: statistiques dashboard
DROP VIEW IF EXISTS vue_dashboard_stats CASCADE;
CREATE VIEW vue_dashboard_stats AS
SELECT 
    COUNT(*) FILTER (WHERE statut IN ('demande', 'devis_envoye', 'en_attente', 'confirmee', 'convoquee', 'en_cours')) AS sessions_actives,
    COUNT(*) FILTER (WHERE statut = 'devis_envoye') AS sessions_en_attente_action,
    COUNT(*) FILTER (WHERE statut = 'terminee') AS sessions_terminees,
    COUNT(*) FILTER (WHERE statut = 'annulee') AS sessions_annulees,
    COUNT(DISTINCT entreprise_id) AS nombre_entreprises,
    SUM(nombre_participants) AS total_participants
FROM sessions_formation;

-- ============================================
-- PARTIE 7: COMMENTAIRES
-- ============================================

COMMENT ON TABLE entreprises IS 'Entreprises clientes';
COMMENT ON TABLE formations_catalogue IS 'Catalogue des formations disponibles';
COMMENT ON TABLE sessions_formation IS 'Sessions de formation planifiées';
COMMENT ON TABLE participants IS 'Participants aux sessions';
COMMENT ON TABLE documents IS 'Documents PDF générés (devis, conventions, certificats, etc.)';
COMMENT ON TABLE emails_log IS 'Historique des emails envoyés (traçabilité Qualiopi)';
COMMENT ON TABLE actions_log IS 'Audit de toutes les actions utilisateur';
COMMENT ON TABLE evaluations IS 'Évaluations à chaud, à froid et client';
COMMENT ON TABLE emargements IS 'Feuilles d''émargement (traçabilité Qualiopi)';
COMMENT ON TABLE notifications_queue IS 'File d''attente pour notifications asynchrones';
COMMENT ON TABLE templates IS 'Modèles réutilisables pour documents et emails';

COMMENT ON COLUMN sessions_formation.statut IS 
'Statuts: demande, devis_envoye, en_attente, confirmee, convoquee, en_cours, terminee, archivee, annulee';

-- ============================================
-- RÉSUMÉ
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 ============================================';
    RAISE NOTICE '✅ INSTALLATION COMPLÈTE TERMINÉE!';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 TABLES CRÉÉES (11):';
    RAISE NOTICE '   Base: entreprises, formations_catalogue, sessions_formation, participants';
    RAISE NOTICE '   Automatisation: documents, emails_log, actions_log, evaluations';
    RAISE NOTICE '                   emargements, notifications_queue, templates';
    RAISE NOTICE '';
    RAISE NOTICE '📈 VUES CRÉÉES (2):';
    RAISE NOTICE '   - vue_sessions_formation';
    RAISE NOTICE '   - vue_dashboard_stats';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 TRIGGERS CRÉÉS:';
    RAISE NOTICE '   - Auto-update updated_at (toutes les tables)';
    RAISE NOTICE '   - Auto-count participants';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 PROCHAINES ÉTAPES:';
    RAISE NOTICE '   1. Exécuter: supabase-donnees-test.sql (données de test)';
    RAISE NOTICE '   2. Démarrer backend: npm start';
    RAISE NOTICE '   3. Démarrer frontend: cd dashboard-client && npm run dev';
    RAISE NOTICE '   4. Ouvrir: http://localhost:3001';
    RAISE NOTICE '';
END $$;
