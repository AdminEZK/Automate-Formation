import axios from 'axios';

// URL de base de l'API (doit inclure /api)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Service pour interagir avec l'API des sessions de formation
 */
class SessionService {
  /**
   * Récupère toutes les sessions de formation avec options de filtrage
   * @param {Object} options - Options de filtrage (statut, entrepriseId, formationId, ascending)
   * @returns {Promise<Array>} Liste des sessions
   */
  async getAllSessions(options = {}) {
    try {
      // Construction des paramètres de requête
      const params = new URLSearchParams();
      if (options.statut) params.append('statut', options.statut);
      if (options.entrepriseId) params.append('entrepriseId', options.entrepriseId);
      if (options.formationId) params.append('formationId', options.formationId);
      if (options.ascending !== undefined) params.append('ascending', options.ascending);

      const response = await axios.get(`${API_URL}/sessions`, { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      throw error;
    }
  }

  /**
   * Récupère une session par son ID
   * @param {string} id - ID de la session
   * @returns {Promise<Object>} Données de la session
   */
  async getSessionById(id) {
    try {
      const response = await axios.get(`${API_URL}/sessions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la session ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle session
   * @param {Object} sessionData - Données de la session
   * @returns {Promise<Object>} Session créée
   */
  async createSession(sessionData) {
    try {
      const response = await axios.post(`${API_URL}/sessions`, sessionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      throw error;
    }
  }

  /**
   * Met à jour une session
   * @param {string} id - ID de la session
   * @param {Object} sessionData - Données à mettre à jour
   * @returns {Promise<Object>} Session mise à jour
   */
  async updateSession(id, sessionData) {
    try {
      const response = await axios.put(`${API_URL}/sessions/${id}`, sessionData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la session ${id}:`, error);
      throw error;
    }
  }

  /**
   * Met à jour le statut d'une session
   * @param {string} id - ID de la session
   * @param {string} statut - Nouveau statut
   * @returns {Promise<Object>} Session mise à jour
   */
  async updateSessionStatus(id, statut) {
    try {
      const response = await axios.patch(`${API_URL}/sessions/${id}/statut`, { statut });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de la session ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime une session
   * @param {string} id - ID de la session
   * @returns {Promise<void>}
   */
  async deleteSession(id) {
    try {
      await axios.delete(`${API_URL}/sessions/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la session ${id}:`, error);
      throw error;
    }
  }
}

export default new SessionService();
