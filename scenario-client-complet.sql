-- ============================================
-- SCÉNARIO COMPLET : NOUVEAU CLIENT
-- ============================================
-- Simulation d'un client qui remplit le formulaire de contact
-- et demande une formation

-- ============================================
-- ÉTAPE 1 : Création du Client (Entreprise)
-- ============================================
-- Le client remplit le formulaire avec ses informations

INSERT INTO entreprises (
    nom,
    adresse,
    code_postal,
    ville,
    pays,
    siret,
    email_contact,
    telephone,
    site_web,
    representant_legal_nom,
    representant_legal_prenom,
    representant_legal_fonction,
    representant_legal_email
) VALUES (
    'TechCorp Solutions',
    '42 Avenue de l''Innovation',
    '92100',
    'Boulogne-Billancourt',
    'France',
    '85234567800012',
    'rh@techcorp-solutions.fr',
    '01 45 67 89 00',
    'www.techcorp-solutions.fr',
    'Durand',
    'Isabelle',
    'Directrice des Ressources Humaines',
    'isabelle.durand@techcorp-solutions.fr'
);

-- ============================================
-- ÉTAPE 2 : Création de la Formation Demandée
-- ============================================
-- La formation que le client souhaite suivre

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
    accessibilite_handicap,
    delai_acces,
    competences_visees
) VALUES (
    'Gestion de Projet Agile - Scrum Master',
    'Formation certifiante pour devenir Scrum Master et maîtriser les méthodologies agiles',
    21,
    2100.00,
    'Comprendre les principes Agile et Scrum. Maîtriser le rôle de Scrum Master. Animer les cérémonies Scrum. Gérer un backlog produit. Faciliter la collaboration d''équipe.',
    'Expérience en gestion de projet souhaitée',
    'Module 1 (2j): Introduction à l''Agile et Scrum
Module 2 (2j): Le rôle du Scrum Master
Module 3 (2j): Cérémonies et artefacts Scrum
Module 4 (1j): Outils et pratiques avancées
Module 5 (1j): Préparation certification',
    'Management',
    'Intermédiaire',
    'Présentiel',
    'Formation',
    'Chefs de projet, Product Owners, Développeurs, Managers',
    'Formation interactive avec ateliers pratiques, jeux de rôle, études de cas réels, simulations de sprints',
    'Salle de formation équipée, supports numériques, accès plateforme e-learning, outils Scrum (Jira, Trello)',
    'QCM quotidiens, mise en situation, projet fil rouge, examen blanc certification',
    'Formation accessible aux personnes en situation de handicap. Locaux PMR. Adaptation pédagogique possible. Référent handicap disponible.',
    '2 semaines',
    'Maîtrise du framework Scrum, Animation d''équipe agile, Gestion de backlog, Facilitation de réunions'
);

-- ============================================
-- ÉTAPE 3 : Création de la Session (Demande)
-- ============================================
-- Le client demande une session pour son équipe
-- Statut initial : "demande"

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
    conditions_annulation,
    financement_opco,
    nom_opco,
    notes
) VALUES (
    (SELECT id FROM formations_catalogue WHERE titre LIKE 'Gestion de Projet Agile%' LIMIT 1),
    (SELECT id FROM entreprises WHERE nom = 'TechCorp Solutions' LIMIT 1),
    '2025-12-02',  -- Début dans 2 mois
    '2025-12-06',  -- 5 jours
    'Paris - Centre de Formation TechCorp, 42 Avenue de l''Innovation, 92100 Boulogne-Billancourt',
    8,  -- 8 participants
    'demande',  -- Statut initial
    16800.00,  -- 8 participants × 2100€
    '09:00',
    '17:30',
    '12:30',
    '13:30',
    'Paiement à 30 jours fin de mois par virement bancaire. Acompte de 30% à la signature.',
    'Annulation gratuite jusqu''à 14 jours avant le début. Entre 14 et 7 jours : 50% du montant. Moins de 7 jours : 100% du montant.',
    TRUE,  -- Financement OPCO
    'OPCO Atlas',
    'Demande urgente - Équipe de 8 personnes à former avant fin d''année. Budget validé. OPCO contacté.'
);

-- ============================================
-- ÉTAPE 4 : Liste des Participants
-- ============================================
-- Le client fournit la liste de son équipe

INSERT INTO participants (
    session_formation_id,
    nom,
    prenom,
    email,
    telephone,
    fonction,
    adresse,
    code_postal,
    ville,
    niveau_etudes,
    situation_handicap
) VALUES 
    (
        (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1),
        'Durand',
        'Isabelle',
        'isabelle.durand@techcorp-solutions.fr',
        '06 12 34 56 78',
        'Directrice RH',
        '15 Rue des Lilas',
        '92100',
        'Boulogne-Billancourt',
        'Master',
        FALSE
    ),
    (
        (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1),
        'Lefebvre',
        'Marc',
        'marc.lefebvre@techcorp-solutions.fr',
        '06 23 45 67 89',
        'Chef de Projet Senior',
        '28 Avenue Mozart',
        '75016',
        'Paris',
        'Ingénieur',
        FALSE
    ),
    (
        (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1),
        'Moreau',
        'Sophie',
        'sophie.moreau@techcorp-solutions.fr',
        '06 34 56 78 90',
        'Product Owner',
        '42 Rue de la Paix',
        '75002',
        'Paris',
        'Master',
        FALSE
    ),
    (
        (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1),
        'Petit',
        'Thomas',
        'thomas.petit@techcorp-solutions.fr',
        '06 45 67 89 01',
        'Lead Developer',
        '67 Boulevard Haussmann',
        '75008',
        'Paris',
        'Ingénieur',
        FALSE
    ),
    (
        (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1),
        'Roux',
        'Julie',
        'julie.roux@techcorp-solutions.fr',
        '06 56 78 90 12',
        'Scrum Master Junior',
        '89 Rue du Faubourg',
        '75010',
        'Paris',
        'Licence',
        FALSE
    ),
    (
        (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1),
        'Blanc',
        'Alexandre',
        'alexandre.blanc@techcorp-solutions.fr',
        '06 67 89 01 23',
        'Chef de Projet',
        '34 Avenue Victor Hugo',
        '92100',
        'Boulogne-Billancourt',
        'Master',
        FALSE
    ),
    (
        (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1),
        'Girard',
        'Émilie',
        'emilie.girard@techcorp-solutions.fr',
        '06 78 90 12 34',
        'Business Analyst',
        '56 Rue de Rivoli',
        '75001',
        'Paris',
        'Master',
        FALSE
    ),
    (
        (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1),
        'Fournier',
        'David',
        'david.fournier@techcorp-solutions.fr',
        '06 89 01 23 45',
        'Développeur Senior',
        '78 Boulevard Saint-Germain',
        '75005',
        'Paris',
        'Ingénieur',
        FALSE
    );

-- ============================================
-- RÉSUMÉ DE LA DEMANDE
-- ============================================

SELECT 
    '🎉 DEMANDE DE FORMATION CRÉÉE' as "═══════════════════════════════════",
    '' as " ";

SELECT 
    '📋 INFORMATIONS CLIENT' as "═══════════════════════════════════",
    '' as " ";

SELECT 
    e.nom as "Entreprise",
    e.representant_legal_prenom || ' ' || e.representant_legal_nom as "Contact",
    e.email_contact as "Email",
    e.telephone as "Téléphone"
FROM entreprises e
WHERE e.nom = 'TechCorp Solutions';

SELECT 
    '📚 FORMATION DEMANDÉE' as "═══════════════════════════════════",
    '' as " ";

SELECT 
    f.titre as "Formation",
    f.duree || ' heures' as "Durée",
    f.prix_ht || ' € HT' as "Prix unitaire",
    f.niveau as "Niveau"
FROM formations_catalogue f
WHERE f.titre LIKE 'Gestion de Projet Agile%';

SELECT 
    '📅 SESSION' as "═══════════════════════════════════",
    '' as " ";

SELECT 
    s.id as "ID Session",
    TO_CHAR(s.date_debut, 'DD/MM/YYYY') as "Date début",
    TO_CHAR(s.date_fin, 'DD/MM/YYYY') as "Date fin",
    s.nombre_participants as "Participants",
    s.prix_total_ht || ' € HT' as "Prix total",
    s.statut as "Statut",
    s.nom_opco as "OPCO"
FROM sessions_formation s
ORDER BY s.created_at DESC
LIMIT 1;

SELECT 
    '👥 PARTICIPANTS (' || COUNT(*) || ')' as "═══════════════════════════════════",
    '' as " "
FROM participants p
WHERE p.session_formation_id = (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1);

SELECT 
    p.prenom || ' ' || p.nom as "Nom",
    p.fonction as "Fonction",
    p.email as "Email"
FROM participants p
WHERE p.session_formation_id = (SELECT id FROM sessions_formation ORDER BY created_at DESC LIMIT 1)
ORDER BY p.nom;

SELECT 
    '✅ PROCHAINES ÉTAPES' as "═══════════════════════════════════",
    '' as " ";

SELECT 
    '1. Valider la demande (statut → en_attente)' as "Étape",
    '2. Générer la proposition commerciale' as " ",
    '3. Envoyer au client pour acceptation' as "  ",
    '4. Signature de la convention' as "   ",
    '5. Génération des documents Qualiopi' as "    ";
