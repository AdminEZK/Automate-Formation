-- Vérifier et corriger les politiques RLS pour organisme_formation

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Accès complet pour les utilisateurs authentifiés" ON organisme_formation;
DROP POLICY IF EXISTS "Lecture pour les utilisateurs anonymes" ON organisme_formation;

-- Créer des politiques permissives
CREATE POLICY "Lecture publique organisme" ON organisme_formation
    FOR SELECT
    USING (true);

CREATE POLICY "Modification authentifiée organisme" ON organisme_formation
    FOR ALL
    TO authenticated
    USING (true);

-- Vérifier
SELECT * FROM organisme_formation;
