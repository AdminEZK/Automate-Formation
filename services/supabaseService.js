const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialisation du client Supabase avec les variables d'environnement
const supabaseUrl = process.env.SUPABASE_URL;
// Utiliser SERVICE_ROLE_KEY en priorité, sinon ANON_KEY, sinon SUPABASE_KEY (legacy)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

// Vérification des variables d'environnement
if (!supabaseUrl || !supabaseKey) {
  console.error('Erreur: Les variables d\'environnement SUPABASE_URL et SUPABASE_ANON_KEY (ou SUPABASE_SERVICE_ROLE_KEY) doivent être définies');
  console.error('SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗');
  process.exit(1);
}

// Création du client Supabase avec options pour bypasser RLS
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Log pour vérifier quelle clé est utilisée
console.log('[SupabaseService] Initialisation avec:', {
  url: supabaseUrl,
  keyType: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE_KEY' : 'ANON_KEY',
  keyPrefix: supabaseKey?.substring(0, 20) + '...'
});

/**
 * Service pour interagir avec la base de données Supabase
 */
class SupabaseService {
  /**
   * Récupère toutes les entreprises
   * @returns {Promise<Array>} Liste des entreprises
   */
  async getAllEntreprises() {
    try {
      const { data, error } = await supabase
        .from('entreprises')
        .select('*')
        .order('nom_entreprise', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des entreprises:', error);
      throw error;
    }
  }

  /**
   * Récupère une entreprise par son ID
   * @param {string} id - ID de l'entreprise
   * @returns {Promise<Object>} Données de l'entreprise
   */
  async getEntrepriseById(id) {
    try {
      const { data, error } = await supabase
        .from('entreprises')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'entreprise ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle entreprise
   * @param {Object} entrepriseData - Données de l'entreprise
   * @returns {Promise<Object>} Entreprise créée
   */
  async createEntreprise(entrepriseData) {
    try {
      const { data, error } = await supabase
        .from('entreprises')
        .insert([entrepriseData])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erreur lors de la création de l\'entreprise:', error);
      throw error;
    }
  }

  /**
   * Met à jour une entreprise
   * @param {string} id - ID de l'entreprise
   * @param {Object} entrepriseData - Données à mettre à jour
   * @returns {Promise<Object>} Entreprise mise à jour
   */
  async updateEntreprise(id, entrepriseData) {
    try {
      const { data, error } = await supabase
        .from('entreprises')
        .update(entrepriseData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'entreprise ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime une entreprise
   * @param {string} id - ID de l'entreprise
   * @returns {Promise<boolean>} Succès de la suppression
   */
  async deleteEntreprise(id) {
    try {
      const { error } = await supabase
        .from('entreprises')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'entreprise ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère toutes les formations du catalogue
   * @returns {Promise<Array>} Liste des formations
   */
  async getAllFormations() {
    try {
      const { data, error } = await supabase
        .from('formations_catalogue')
        .select('*')
        .order('titre', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des formations:', error);
      throw error;
    }
  }

  /**
   * Récupère une formation par son ID
   * @param {string} id - ID de la formation
   * @returns {Promise<Object>} Données de la formation
   */
  async getFormationById(id) {
    try {
      const { data, error } = await supabase
        .from('formations_catalogue')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la formation ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle formation dans le catalogue
   * @param {Object} formationData - Données de la formation
   * @returns {Promise<Object>} Formation créée
   */
  async createFormation(formationData) {
    try {
      const { data, error } = await supabase
        .from('formations_catalogue')
        .insert([formationData])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erreur lors de la création de la formation:', error);
      throw error;
    }
  }

  /**
   * Met à jour une formation
   * @param {string} id - ID de la formation
   * @param {Object} formationData - Données à mettre à jour
   * @returns {Promise<Object>} Formation mise à jour
   */
  async updateFormation(id, formationData) {
    try {
      const { data, error } = await supabase
        .from('formations_catalogue')
        .update(formationData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la formation ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime une formation
   * @param {string} id - ID de la formation
   * @returns {Promise<boolean>} Succès de la suppression
   */
  async deleteFormation(id) {
    try {
      const { error } = await supabase
        .from('formations_catalogue')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la formation ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère toutes les sessions de formation
   * @param {Object} options - Options de filtrage
   * @returns {Promise<Array>} Liste des sessions de formation
   */
  async getAllSessions(options = {}) {
    try {
      let query = supabase
        .from('vue_sessions_formation')
        .select('*');

      // Filtrage par statut si spécifié
      if (options.statut) {
        query = query.eq('statut', options.statut);
      }

      // Filtrage par entreprise si spécifié
      if (options.entrepriseId) {
        query = query.eq('entreprise_id', options.entrepriseId);
      }

      // Filtrage par formation si spécifié
      if (options.formationId) {
        query = query.eq('formation_id', options.formationId);
      }

      // Tri par date de création (par défaut du plus récent au plus ancien)
      query = query.order('session_created_at', { ascending: options.ascending || false });

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions de formation:', error);
      throw error;
    }
  }

  /**
   * Récupère une session de formation par son ID
   * @param {string} id - ID de la session
   * @returns {Promise<Object>} Données de la session
   */
  async getSessionById(id) {
    try {
      const { data, error } = await supabase
        .from('vue_sessions_formation')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la session ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle session de formation
   * @param {Object} sessionData - Données de la session
   * @returns {Promise<Object>} Session créée
   */
  async createSession(sessionData) {
    try {
      const { data, error } = await supabase
        .from('sessions_formation')
        .insert([sessionData])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erreur lors de la création de la session de formation:', error);
      throw error;
    }
  }

  /**
   * Met à jour une session de formation
   * @param {string} id - ID de la session
   * @param {Object} sessionData - Données à mettre à jour
   * @returns {Promise<Object>} Session mise à jour
   */
  async updateSession(id, sessionData) {
    try {
      console.log('[updateSession] Demande de mise à jour', { id, sessionData });

      // Lire la session AVANT l'update pour comparer
      const { data: beforeUpdate, error: beforeError } = await supabase
        .from('sessions_formation')
        .select('statut, demande_validee_le, devis_envoye_le')
        .eq('id', id)
        .single();

      if (beforeError) {
        console.error('[updateSession] Erreur lecture avant UPDATE', { id, beforeError });
      } else {
        console.log('[updateSession] État AVANT UPDATE', { id, before: beforeUpdate });
      }

      // Faire l'UPDATE avec .match() au lieu de .eq() pour forcer la mise à jour
      const updateResult = await supabase
        .from('sessions_formation')
        .update(sessionData)
        .match({ id: id });
      
      const { error, status, statusText, count } = updateResult;

      console.log('[updateSession] Résultat UPDATE', { id, error, status, statusText, count });

      if (error) {
        console.error('[updateSession] Erreur Supabase UPDATE', { id, sessionData, error });
        throw error;
      }

      console.log('[updateSession] UPDATE exécuté sans erreur, rechargement direct depuis sessions_formation');

      // Recharger directement depuis la table sessions_formation (pas la vue qui peut être en cache)
      const { data: updatedSession, error: selectError } = await supabase
        .from('sessions_formation')
        .select('*')
        .eq('id', id)
        .single();

      if (selectError) {
        console.error('[updateSession] Erreur lors du rechargement', { id, selectError });
        throw selectError;
      }

      console.log('[updateSession] Session rechargée depuis la table', { 
        id, 
        statut: updatedSession?.statut, 
        demande_validee_le: updatedSession?.demande_validee_le,
        devis_envoye_le: updatedSession?.devis_envoye_le
      });

      return updatedSession;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la session ${id}:`, error);
      throw error;
    }
  }

  /**
   * Met à jour le statut d'une session de formation
   * @param {string} id - ID de la session
   * @param {string} statut - Nouveau statut
   * @returns {Promise<Object>} Session mise à jour
   */
  async updateSessionStatus(id, statut) {
    return this.updateSession(id, { statut });
  }

  /**
   * Supprime une session de formation
   * @param {string} id - ID de la session
   * @returns {Promise<boolean>} Succès de la suppression
   */
  async deleteSession(id) {
    try {
      const { error } = await supabase
        .from('sessions_formation')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la session ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère tous les participants
   * @returns {Promise<Array>} Liste des participants
   */
  async getAllParticipants() {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('nom', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des participants:', error);
      throw error;
    }
  }

  /**
   * Récupère les participants d'une session
   * @param {string} sessionId - ID de la session
   * @returns {Promise<Array>} Liste des participants
   */
  async getParticipantsBySession(sessionId) {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('session_formation_id', sessionId)
        .order('nom', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des participants de la session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les sessions d'une entreprise
   * @param {string} entrepriseId - ID de l'entreprise
   * @returns {Promise<Array>} Liste des sessions
   */
  async getSessionsByEntreprise(entrepriseId) {
    try {
      const { data, error } = await supabase
        .from('vue_sessions_formation')
        .select('*')
        .eq('entreprise_id', entrepriseId)
        .order('session_created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des sessions de l'entreprise ${entrepriseId}:`, error);
      throw error;
    }
  }
}

const supabaseServiceInstance = new SupabaseService();
supabaseServiceInstance.supabase = supabase; // Exposer le client supabase

module.exports = supabaseServiceInstance;
