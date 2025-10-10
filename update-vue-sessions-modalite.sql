-- Mise à jour de la vue vue_sessions_formation pour inclure modalite et formation_titre
-- Exécuter ce fichier pour ajouter les champs manquants à la vue

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
    -- Nouveaux champs
    s.modalite,
    COALESCE(s.formation_titre, f.titre) AS formation_titre,
    -- Informations entreprise
    e.nom AS entreprise_nom,
    e.email_contact AS entreprise_email,
    e.telephone AS entreprise_telephone,
    e.adresse AS entreprise_adresse,
    e.code_postal AS entreprise_code_postal,
    e.ville AS entreprise_ville,
    -- Informations formation (du catalogue)
    f.titre AS formation_catalogue_titre,
    f.description AS formation_description,
    f.duree AS formation_duree,
    f.prix_ht AS formation_prix_ht
FROM sessions_formation s
LEFT JOIN entreprises e ON s.entreprise_id = e.id
LEFT JOIN formations_catalogue f ON s.formation_catalogue_id = f.id;

COMMENT ON VIEW vue_sessions_formation IS 'Vue enrichie des sessions avec informations entreprise et formation, incluant modalité';
