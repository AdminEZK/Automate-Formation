-- ============================================
-- DONNÉES DE TEST - Entreprise Fictive
-- ============================================
-- Date: 2025-10-08
-- Description: Création d'une entreprise fictive avec une session de formation complète

-- ============================================
-- 1. ENTREPRISE FICTIVE
-- ============================================

INSERT INTO entreprises (id, nom, adresse, code_postal, ville, siret, email_contact, telephone)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'TechCorp Solutions',
    '123 Avenue de l''Innovation',
    '75001',
    'Paris',
    '12345678901234',
    'contact@techcorp.fr',
    '01 23 45 67 89'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. FORMATION CATALOGUE
-- ============================================

INSERT INTO formations_catalogue (id, titre, description, duree, prix_ht, objectifs, programme)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Gestion de Projet Agile',
    'Formation complète sur les méthodologies agiles (Scrum, Kanban)',
    21,
    1500.00,
    'Maîtriser les principes agiles, Gérer un projet Scrum, Utiliser les outils collaboratifs',
    'Jour 1: Introduction à l''Agile
Jour 2: Framework Scrum
Jour 3: Pratique et mise en situation'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. SESSION DE FORMATION
-- ============================================

INSERT INTO sessions_formation (
    id,
    entreprise_id,
    formation_catalogue_id,
    date_debut,
    date_fin,
    statut,
    nombre_participants
)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '2025-11-15',
    '2025-11-17',
    'demande',
    3
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. PARTICIPANTS
-- ============================================

INSERT INTO participants (id, session_formation_id, nom, prenom, email, telephone, fonction)
VALUES 
(
    '44444444-4444-4444-4444-444444444444',
    '33333333-3333-3333-3333-333333333333',
    'Dupont',
    'Jean',
    'jean.dupont@techcorp.fr',
    '06 12 34 56 78',
    'Chef de Projet'
),
(
    '55555555-5555-5555-5555-555555555555',
    '33333333-3333-3333-3333-333333333333',
    'Martin',
    'Marie',
    'marie.martin@techcorp.fr',
    '06 23 45 67 89',
    'Product Owner'
),
(
    '66666666-6666-6666-6666-666666666666',
    '33333333-3333-3333-3333-333333333333',
    'Durand',
    'Paul',
    'paul.durand@techcorp.fr',
    '06 34 56 78 90',
    'Scrum Master'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. SESSION SUPPLÉMENTAIRE (en cours)
-- ============================================

INSERT INTO entreprises (id, nom, email_contact, telephone)
VALUES (
    '77777777-7777-7777-7777-777777777777',
    'Digital Innovations',
    'contact@digital-innov.fr',
    '01 98 76 54 32'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO sessions_formation (
    id,
    entreprise_id,
    formation_catalogue_id,
    date_debut,
    date_fin,
    statut,
    nombre_participants,
    devis_envoye_le,
    devis_accepte_le
)
VALUES (
    '88888888-8888-8888-8888-888888888888',
    '77777777-7777-7777-7777-777777777777',
    '22222222-2222-2222-2222-222222222222',
    '2025-10-20',
    '2025-10-22',
    'en_attente',
    2,
    '2025-10-05 10:00:00',
    '2025-10-07 14:30:00'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO participants (id, session_formation_id, nom, prenom, email)
VALUES 
(
    '99999999-9999-9999-9999-999999999999',
    '88888888-8888-8888-8888-888888888888',
    'Bernard',
    'Sophie',
    'sophie.bernard@digital-innov.fr'
),
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '88888888-8888-8888-8888-888888888888',
    'Petit',
    'Thomas',
    'thomas.petit@digital-innov.fr'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RÉSUMÉ
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ DONNÉES DE TEST CRÉÉES AVEC SUCCÈS!';
    RAISE NOTICE '';
    RAISE NOTICE '🏢 2 Entreprises:';
    RAISE NOTICE '   - TechCorp Solutions (3 participants)';
    RAISE NOTICE '   - Digital Innovations (2 participants)';
    RAISE NOTICE '';
    RAISE NOTICE '📚 1 Formation:';
    RAISE NOTICE '   - Gestion de Projet Agile (3 jours)';
    RAISE NOTICE '';
    RAISE NOTICE '📋 2 Sessions:';
    RAISE NOTICE '   - Session 1: TechCorp (statut: demande)';
    RAISE NOTICE '   - Session 2: Digital Innovations (statut: en_attente)';
    RAISE NOTICE '';
    RAISE NOTICE '👥 5 Participants au total';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Vous pouvez maintenant démarrer le dashboard!';
    RAISE NOTICE '   npm start';
    RAISE NOTICE '';
END $$;

-- Afficher les données créées
SELECT 
    'Entreprises' as type,
    COUNT(*) as nombre
FROM entreprises
WHERE id IN ('11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777')
UNION ALL
SELECT 
    'Sessions' as type,
    COUNT(*) as nombre
FROM sessions_formation
WHERE id IN ('33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888')
UNION ALL
SELECT 
    'Participants' as type,
    COUNT(*) as nombre
FROM participants
WHERE session_formation_id IN ('33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888');
