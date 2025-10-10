-- ============================================
-- DONNÉES DE TEST POUR QUALIOPI
-- ============================================
-- Exécuter ce SQL dans Supabase pour créer des données de test

-- 1. Créer une entreprise de test
INSERT INTO entreprises (
    nom, 
    adresse, 
    code_postal, 
    ville, 
    email_contact, 
    telephone,
    siret,
    representant_legal_nom,
    representant_legal_prenom,
    representant_legal_fonction
) VALUES (
    'Entreprise Test SARL',
    '123 Avenue des Tests',
    '75001',
    'Paris',
    'contact@entreprise-test.fr',
    '01 23 45 67 89',
    '98765432100019',
    'Martin',
    'Sophie',
    'Directrice RH'
);

-- 2. Créer une formation de test
INSERT INTO formations_catalogue (
    titre,
    description,
    duree,
    prix_ht,
    objectifs,
    prerequis,
    programme,
    categorie,
    niveau,
    format,
    nature_action,
    public_vise,
    methodes_pedagogiques,
    moyens_pedagogiques,
    modalites_evaluation,
    accessibilite_handicap
) VALUES (
    'Formation Python Avancé',
    'Formation complète sur Python pour développeurs',
    14,
    1500.00,
    'Maîtriser Python et ses frameworks. Développer des applications web. Gérer des bases de données.',
    'Connaissances de base en programmation',
    'Jour 1-2: Fondamentaux Python. Jour 3-4: POO et design patterns. Jour 5-6: Frameworks web (Django/Flask). Jour 7: Projet pratique.',
    'Développement',
    'Avancé',
    'Présentiel',
    'Formation',
    'Développeurs, Ingénieurs logiciels',
    'Formation en présentiel avec alternance théorie/pratique, exercices, études de cas',
    'Salle équipée, ordinateurs, supports de cours, accès plateforme en ligne',
    'QCM, exercices pratiques, projet final',
    'Locaux accessibles PMR. Adaptation possible selon besoins. Contactez-nous.'
);

-- 3. Créer une session de formation
INSERT INTO sessions_formation (
    formation_catalogue_id,
    entreprise_id,
    date_debut,
    date_fin,
    lieu,
    nombre_participants,
    statut,
    prix_total_ht,
    horaire_debut,
    horaire_fin,
    horaire_pause_debut,
    horaire_pause_fin,
    modalites_reglement,
    conditions_annulation
) VALUES (
    (SELECT id FROM formations_catalogue WHERE titre = 'Formation Python Avancé' LIMIT 1),
    (SELECT id FROM entreprises WHERE nom = 'Entreprise Test SARL' LIMIT 1),
    '2025-11-15',
    '2025-11-21',
    'Paris - 123 Avenue des Tests',
    5,
    'confirmee',
    7500.00,
    '09:00',
    '17:00',
    '12:00',
    '13:00',
    'Paiement à 30 jours fin de mois par virement bancaire',
    'Annulation gratuite jusqu''à 7 jours avant le début. Au-delà, 50% du montant sera facturé.'
);

-- 4. Créer des participants de test
INSERT INTO participants (
    session_formation_id,
    nom,
    prenom,
    email,
    telephone,
    fonction,
    adresse,
    code_postal,
    ville
) VALUES 
    (
        (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1),
        'Dupont',
        'Jean',
        'jean.dupont@entreprise-test.fr',
        '06 12 34 56 78',
        'Développeur Senior',
        '45 Rue du Code',
        '75002',
        'Paris'
    ),
    (
        (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1),
        'Martin',
        'Marie',
        'marie.martin@entreprise-test.fr',
        '06 23 45 67 89',
        'Lead Developer',
        '78 Avenue Python',
        '75003',
        'Paris'
    ),
    (
        (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1),
        'Bernard',
        'Pierre',
        'pierre.bernard@entreprise-test.fr',
        '06 34 56 78 90',
        'Développeur Full Stack',
        '12 Boulevard Django',
        '75004',
        'Paris'
    ),
    (
        (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1),
        'Dubois',
        'Claire',
        'claire.dubois@entreprise-test.fr',
        '06 45 67 89 01',
        'Développeur Backend',
        '56 Rue Flask',
        '75005',
        'Paris'
    ),
    (
        (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1),
        'Leroy',
        'Thomas',
        'thomas.leroy@entreprise-test.fr',
        '06 56 78 90 12',
        'Développeur Junior',
        '89 Avenue FastAPI',
        '75006',
        'Paris'
    );

-- Vérification
SELECT 
    'Données créées avec succès!' as message,
    (SELECT COUNT(*) FROM entreprises) as nb_entreprises,
    (SELECT COUNT(*) FROM formations_catalogue) as nb_formations,
    (SELECT COUNT(*) FROM sessions_formation) as nb_sessions,
    (SELECT COUNT(*) FROM participants) as nb_participants;
