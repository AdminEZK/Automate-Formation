-- Insertion de données d'exemple dans la table entreprises
INSERT INTO entreprises (nom, adresse, code_postal, ville, siret, email_contact, telephone, site_web)
VALUES
    ('Acme Corporation', '123 Avenue des Champs-Élysées', '75008', 'Paris', '12345678901234', 'contact@acme.com', '01 23 45 67 89', 'https://www.acme.com'),
    ('Dunder Mifflin', '45 Rue de la Paix', '69002', 'Lyon', '98765432109876', 'info@dundermifflin.com', '04 56 78 90 12', 'https://www.dundermifflin.com'),
    ('Stark Industries', '8 Place de la Concorde', '33000', 'Bordeaux', '45678901234567', 'contact@stark.com', '05 67 89 01 23', 'https://www.stark-industries.com'),
    ('Wayne Enterprises', '27 Boulevard Haussmann', '13001', 'Marseille', '78901234567890', 'info@wayne.com', '04 12 34 56 78', 'https://www.wayne-enterprises.com'),
    ('Umbrella Corporation', '15 Rue du Faubourg Saint-Honoré', '59000', 'Lille', '23456789012345', 'contact@umbrella.com', '03 45 67 89 01', 'https://www.umbrella-corp.com');

-- Insertion de données d'exemple dans la table formations_catalogue
INSERT INTO formations_catalogue (titre, description, duree, prix_ht, objectifs, prerequis, programme, categorie, niveau, format)
VALUES
    ('Introduction à la Gestion de Projet', 'Formation complète pour maîtriser les fondamentaux de la gestion de projet', 14, 1200.00, 'Comprendre les principes de base de la gestion de projet, Maîtriser les outils de planification, Savoir gérer une équipe projet', 'Aucun prérequis nécessaire', 'Jour 1: Introduction et concepts de base\nJour 2: Outils et méthodologies', 'Management', 'Débutant', 'présentiel'),
    
    ('Excel Avancé', 'Maîtrisez les fonctionnalités avancées d''Excel pour l''analyse de données', 7, 800.00, 'Maîtriser les formules avancées, Créer des tableaux croisés dynamiques, Automatiser avec VBA', 'Connaissances de base d''Excel', 'Matin: Formules et fonctions avancées\nAprès-midi: Tableaux croisés et macros', 'Bureautique', 'Avancé', 'présentiel'),
    
    ('Leadership et Management d''Équipe', 'Développez vos compétences en leadership pour mieux gérer votre équipe', 21, 2500.00, 'Développer son style de leadership, Améliorer la communication d''équipe, Gérer les conflits efficacement', 'Expérience en management recommandée', 'Module 1: Styles de leadership\nModule 2: Communication efficace\nModule 3: Gestion des conflits', 'Management', 'Intermédiaire', 'mixte'),
    
    ('Cybersécurité pour les Entreprises', 'Protégez votre entreprise contre les menaces informatiques modernes', 14, 1800.00, 'Identifier les risques de sécurité, Mettre en place des protocoles de protection, Réagir en cas d''incident', 'Connaissances de base en informatique', 'Jour 1: Identification des risques\nJour 2: Stratégies de protection', 'Informatique', 'Intermédiaire', 'distanciel'),
    
    ('Marketing Digital', 'Stratégies et outils pour réussir votre présence en ligne', 14, 1500.00, 'Élaborer une stratégie digitale, Maîtriser les réseaux sociaux, Analyser les performances', 'Connaissances de base en marketing', 'Jour 1: Stratégie et planification\nJour 2: Mise en œuvre et analyse', 'Marketing', 'Débutant', 'distanciel');

-- Insertion de données d'exemple dans la table sessions_formation
INSERT INTO sessions_formation (formation_catalogue_id, entreprise_id, date_debut, date_fin, lieu, nombre_participants, statut, formateur, prix_total_ht, notes)
VALUES
    -- Sessions pour Acme Corporation
    ((SELECT id FROM formations_catalogue WHERE titre = 'Introduction à la Gestion de Projet'), 
     (SELECT id FROM entreprises WHERE nom = 'Acme Corporation'),
     '2025-09-15', '2025-09-16', 'Siège Acme Paris', 8, 'confirmee', 'Jean Dupont', 9600.00, 'Session confirmée, documents envoyés'),
    
    ((SELECT id FROM formations_catalogue WHERE titre = 'Excel Avancé'), 
     (SELECT id FROM entreprises WHERE nom = 'Acme Corporation'),
     '2025-10-05', '2025-10-05', 'Salle de formation Acme', 5, 'demande', NULL, 4000.00, 'Demande reçue, en attente de validation'),
    
    -- Sessions pour Dunder Mifflin
    ((SELECT id FROM formations_catalogue WHERE titre = 'Leadership et Management d''Équipe'), 
     (SELECT id FROM entreprises WHERE nom = 'Dunder Mifflin'),
     '2025-09-20', '2025-09-26', 'Bureaux Lyon', 6, 'en_attente', 'Marie Martin', 15000.00, 'En attente de confirmation du client'),
    
    -- Sessions pour Stark Industries
    ((SELECT id FROM formations_catalogue WHERE titre = 'Cybersécurité pour les Entreprises'), 
     (SELECT id FROM entreprises WHERE nom = 'Stark Industries'),
     '2025-11-10', '2025-11-11', 'En ligne', 12, 'convoquee', 'Sophie Leclerc', 21600.00, 'Convocations envoyées le 25/08/2025'),
    
    -- Sessions pour Wayne Enterprises
    ((SELECT id FROM formations_catalogue WHERE titre = 'Marketing Digital'), 
     (SELECT id FROM entreprises WHERE nom = 'Wayne Enterprises'),
     '2025-08-15', '2025-08-16', 'En ligne', 10, 'terminee', 'Pierre Durand', 15000.00, 'Formation terminée, évaluations positives'),
    
    -- Sessions pour Umbrella Corporation
    ((SELECT id FROM formations_catalogue WHERE titre = 'Introduction à la Gestion de Projet'), 
     (SELECT id FROM entreprises WHERE nom = 'Umbrella Corporation'),
     '2025-12-01', '2025-12-02', 'Siège Umbrella Lille', 15, 'confirmee', 'Jean Dupont', 18000.00, 'Session confirmée, en attente d''envoi des convocations');

-- Insertion de données d'exemple dans la table participants
INSERT INTO participants (session_formation_id, nom, prenom, email, telephone, fonction, present)
VALUES
    -- Participants pour la première session (Acme - Gestion de Projet)
    ((SELECT id FROM sessions_formation WHERE entreprise_id = (SELECT id FROM entreprises WHERE nom = 'Acme Corporation') AND formation_catalogue_id = (SELECT id FROM formations_catalogue WHERE titre = 'Introduction à la Gestion de Projet')),
     'Martin', 'Thomas', 'thomas.martin@acme.com', '06 12 34 56 78', 'Chef de projet', NULL),
    
    ((SELECT id FROM sessions_formation WHERE entreprise_id = (SELECT id FROM entreprises WHERE nom = 'Acme Corporation') AND formation_catalogue_id = (SELECT id FROM formations_catalogue WHERE titre = 'Introduction à la Gestion de Projet')),
     'Dubois', 'Julie', 'julie.dubois@acme.com', '06 23 45 67 89', 'Responsable marketing', NULL),
    
    -- Participants pour la session Stark Industries - Cybersécurité
    ((SELECT id FROM sessions_formation WHERE entreprise_id = (SELECT id FROM entreprises WHERE nom = 'Stark Industries') AND formation_catalogue_id = (SELECT id FROM formations_catalogue WHERE titre = 'Cybersécurité pour les Entreprises')),
     'Leroy', 'Marc', 'marc.leroy@stark.com', '06 34 56 78 90', 'Responsable IT', NULL),
    
    ((SELECT id FROM sessions_formation WHERE entreprise_id = (SELECT id FROM entreprises WHERE nom = 'Stark Industries') AND formation_catalogue_id = (SELECT id FROM formations_catalogue WHERE titre = 'Cybersécurité pour les Entreprises')),
     'Petit', 'Sophie', 'sophie.petit@stark.com', '06 45 67 89 01', 'Développeuse', NULL),
    
    -- Participants pour la session Wayne Enterprises - Marketing Digital (terminée)
    ((SELECT id FROM sessions_formation WHERE entreprise_id = (SELECT id FROM entreprises WHERE nom = 'Wayne Enterprises') AND formation_catalogue_id = (SELECT id FROM formations_catalogue WHERE titre = 'Marketing Digital')),
     'Moreau', 'Philippe', 'philippe.moreau@wayne.com', '06 56 78 90 12', 'Directeur marketing', TRUE),
    
    ((SELECT id FROM sessions_formation WHERE entreprise_id = (SELECT id FROM entreprises WHERE nom = 'Wayne Enterprises') AND formation_catalogue_id = (SELECT id FROM formations_catalogue WHERE titre = 'Marketing Digital')),
     'Robert', 'Céline', 'celine.robert@wayne.com', '06 67 89 01 23', 'Community manager', TRUE);
