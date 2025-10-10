-- ============================================
-- TRIGGERS D'AUTOMATISATION DU WORKFLOW
-- ============================================
-- Date: 2025-10-08
-- Description: Triggers pour automatiser l'envoi de convention et convocations

-- Prérequis: Installer l'extension pg_net pour les appels HTTP
-- CREATE EXTENSION IF NOT EXISTS pg_net;

-- Note: Les triggers ci-dessous utilisent pg_net pour appeler l'API Express
-- Si pg_net n'est pas disponible, vous pouvez utiliser des webhooks Supabase à la place

-- ============================================
-- 1. TRIGGER: Envoi automatique de la convention après acceptation du devis
-- ============================================

CREATE OR REPLACE FUNCTION auto_send_convention()
RETURNS TRIGGER AS $$
DECLARE
    api_url TEXT;
BEGIN
    -- Si le statut passe à 'en_attente' (devis accepté)
    IF NEW.statut = 'en_attente' AND OLD.statut = 'devis_envoye' THEN
        
        -- URL de l'API (à adapter selon votre configuration)
        api_url := 'http://localhost:3000/api/sessions/' || NEW.id || '/send-convention';
        
        -- Log de l'action
        RAISE NOTICE 'Déclenchement automatique: Envoi de la convention pour la session %', NEW.id;
        
        -- Appel HTTP vers l'API Express (nécessite pg_net)
        -- Décommentez si pg_net est installé:
        /*
        PERFORM net.http_post(
            url := api_url,
            headers := '{"Content-Type": "application/json"}'::jsonb,
            body := '{}'::jsonb
        );
        */
        
        -- Alternative: Utiliser un webhook Supabase configuré dans le dashboard
        -- Ou appeler directement depuis l'application après la mise à jour
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
DROP TRIGGER IF EXISTS trigger_auto_send_convention ON sessions_formation;

CREATE TRIGGER trigger_auto_send_convention
AFTER UPDATE ON sessions_formation
FOR EACH ROW
WHEN (NEW.statut = 'en_attente' AND OLD.statut = 'devis_envoye')
EXECUTE FUNCTION auto_send_convention();

-- ============================================
-- 2. TRIGGER: Envoi automatique des convocations après signature convention
-- ============================================

CREATE OR REPLACE FUNCTION auto_send_convocations()
RETURNS TRIGGER AS $$
DECLARE
    api_url TEXT;
    participants_count INTEGER;
BEGIN
    -- Si le statut passe à 'confirmee' (convention signée)
    IF NEW.statut = 'confirmee' AND OLD.statut = 'en_attente' THEN
        
        -- Vérifier qu'il y a des participants
        SELECT COUNT(*) INTO participants_count
        FROM participants
        WHERE session_formation_id = NEW.id;
        
        IF participants_count > 0 THEN
            -- URL de l'API (à adapter selon votre configuration)
            api_url := 'http://localhost:3000/api/sessions/' || NEW.id || '/send-convocations';
            
            -- Log de l'action
            RAISE NOTICE 'Déclenchement automatique: Envoi de % convocations pour la session %', participants_count, NEW.id;
            
            -- Appel HTTP vers l'API Express (nécessite pg_net)
            -- Décommentez si pg_net est installé:
            /*
            PERFORM net.http_post(
                url := api_url,
                headers := '{"Content-Type": "application/json"}'::jsonb,
                body := '{}'::jsonb
            );
            */
            
        ELSE
            RAISE WARNING 'Aucun participant pour la session %, convocations non envoyées', NEW.id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
DROP TRIGGER IF EXISTS trigger_auto_send_convocations ON sessions_formation;

CREATE TRIGGER trigger_auto_send_convocations
AFTER UPDATE ON sessions_formation
FOR EACH ROW
WHEN (NEW.statut = 'confirmee' AND OLD.statut = 'en_attente')
EXECUTE FUNCTION auto_send_convocations();

-- ============================================
-- 3. TRIGGER: Webhook DocuSeal pour signature convention
-- ============================================
-- Ce trigger sera appelé par le webhook DocuSeal quand la convention est signée

CREATE OR REPLACE FUNCTION handle_docuseal_signature()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour le statut de la session quand la convention est signée
    -- Cette fonction sera appelée par un webhook ou une fonction edge
    
    RAISE NOTICE 'Convention signée pour la session %', NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: Ce trigger sera configuré via un webhook Supabase Edge Function
-- qui recevra les événements de DocuSeal

-- ============================================
-- 4. FONCTION: Notification par email (intégration Resend)
-- ============================================

CREATE OR REPLACE FUNCTION send_email_notification(
    p_session_id UUID,
    p_notification_type VARCHAR
)
RETURNS VOID AS $$
DECLARE
    api_url TEXT;
BEGIN
    -- URL de l'API pour l'envoi d'emails
    api_url := 'http://localhost:3000/api/notifications/' || p_notification_type;
    
    -- Log
    RAISE NOTICE 'Envoi notification % pour session %', p_notification_type, p_session_id;
    
    -- Appel HTTP (nécessite pg_net)
    -- Décommentez si pg_net est installé:
    /*
    PERFORM net.http_post(
        url := api_url,
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := jsonb_build_object('session_id', p_session_id)
    );
    */
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. FONCTION: Logs d'audit pour traçabilité Qualiopi
-- ============================================

CREATE OR REPLACE FUNCTION log_session_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Logger chaque changement de statut pour la traçabilité
    IF OLD.statut IS DISTINCT FROM NEW.statut THEN
        RAISE NOTICE 'Session %: Changement de statut % -> %', 
            NEW.id, OLD.statut, NEW.statut;
        
        -- Vous pouvez créer une table d'audit si nécessaire
        -- INSERT INTO session_audit_log (session_id, old_status, new_status, changed_at)
        -- VALUES (NEW.id, OLD.statut, NEW.statut, NOW());
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger d'audit
DROP TRIGGER IF EXISTS trigger_log_status_change ON sessions_formation;

CREATE TRIGGER trigger_log_status_change
AFTER UPDATE ON sessions_formation
FOR EACH ROW
WHEN (OLD.statut IS DISTINCT FROM NEW.statut)
EXECUTE FUNCTION log_session_status_change();

-- ============================================
-- 6. ALTERNATIVE: Configuration via Webhooks Supabase
-- ============================================

-- Si pg_net n'est pas disponible, vous pouvez configurer des webhooks dans le dashboard Supabase:
-- 
-- 1. Aller dans Database > Webhooks
-- 2. Créer un webhook pour la table 'sessions_formation'
-- 3. Événement: UPDATE
-- 4. Condition: NEW.statut = 'en_attente' AND OLD.statut = 'devis_envoye'
-- 5. URL: http://votre-api.com/api/sessions/{NEW.id}/send-convention
--
-- Répéter pour les autres événements (convocations, etc.)

-- ============================================
-- RÉSUMÉ DES TRIGGERS CRÉÉS
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Triggers d''automatisation créés avec succès!';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Triggers actifs:';
    RAISE NOTICE '   1. trigger_auto_send_convention';
    RAISE NOTICE '      → Déclenché quand: statut passe à "en_attente"';
    RAISE NOTICE '      → Action: Envoie la convention via DocuSeal';
    RAISE NOTICE '';
    RAISE NOTICE '   2. trigger_auto_send_convocations';
    RAISE NOTICE '      → Déclenché quand: statut passe à "confirmee"';
    RAISE NOTICE '      → Action: Envoie les convocations aux participants';
    RAISE NOTICE '';
    RAISE NOTICE '   3. trigger_log_status_change';
    RAISE NOTICE '      → Déclenché quand: statut change';
    RAISE NOTICE '      → Action: Log pour traçabilité';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT:';
    RAISE NOTICE '   - Les appels HTTP nécessitent l''extension pg_net';
    RAISE NOTICE '   - Alternative: Utiliser les webhooks Supabase';
    RAISE NOTICE '   - Configurer les webhooks dans le dashboard Supabase';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Prochaines étapes:';
    RAISE NOTICE '   1. Installer pg_net: CREATE EXTENSION pg_net;';
    RAISE NOTICE '   2. Ou configurer les webhooks dans le dashboard';
    RAISE NOTICE '   3. Mettre à jour les URLs d''API dans les fonctions';
END $$;
