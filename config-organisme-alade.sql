-- ============================================
-- CONFIGURATION ORGANISME : ALADÉ CONSEIL
-- ============================================
-- Informations définitives de votre centre de formation
-- À exécuter UNE SEULE FOIS dans le nouveau projet Supabase

INSERT INTO organisme_formation (
    nom,
    raison_sociale,
    siret,
    numero_declaration_activite,
    adresse,
    code_postal,
    ville,
    pays,
    telephone,
    email,
    site_web,
    representant_legal_nom,
    representant_legal_prenom,
    representant_legal_fonction,
    representant_legal_email,
    delai_retractation,
    reglement_interieur,
    politique_handicap,
    conditions_generales_vente
) VALUES (
    'Aladé Conseil',
    'Aladé Conseil SAS',
    '804133155',
    'FR68804133155',
    '22 RUE DE LA CLARISSE',
    '35400',
    'SAINT-MALO',
    'France',
    '02.99.19.37.09',
    'contact@aladeconseils.com',
    NULL,  -- Site web à ajouter si vous en avez un
    'MAZOU',
    'Liassissi',
    'Directeur',
    'contact@aladeconseils.com',  -- Email du représentant (à modifier si différent)
    '10 jours',
    'Le règlement intérieur est disponible sur demande et affiché dans les locaux de formation.',
    'Formation accessible aux personnes en situation de handicap. Locaux PMR. Adaptation pédagogique possible sur demande. Référent handicap disponible.',
    'Conditions générales de vente disponibles sur demande.'
) ON CONFLICT (siret) DO NOTHING;

-- Vérification
SELECT 
    '✅ ORGANISME CONFIGURÉ' as "═══════════════════════════════════",
    nom as "Nom",
    raison_sociale as "Raison Sociale",
    siret as "SIRET",
    numero_declaration_activite as "NDA",
    ville as "Ville",
    representant_legal_prenom || ' ' || representant_legal_nom as "Représentant"
FROM organisme_formation
WHERE siret = '804133155';
