import axios from 'axios';

// En production, utiliser l'URL complète de l'API
// En développement, utiliser le proxy local
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sessions API
export const sessionsApi = {
  // Récupérer toutes les sessions
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/sessions?${params}`);
  },

  // Récupérer une session par ID
  getById: (id) => api.get(`/sessions/${id}`),

  // Valider une demande
  validateDemande: (id) => api.post(`/sessions/${id}/validate`),

  // Marquer le devis comme envoyé
  markDevisSent: (id) => api.post(`/sessions/${id}/mark-devis-sent`),

  // Réponse au devis (accepté/refusé)
  devisResponse: (id, response) => 
    api.post(`/sessions/${id}/devis-response`, { response }),

  // Envoyer la convention
  sendConvention: (id) => api.post(`/sessions/${id}/send-convention`),

  // Envoyer les convocations
  sendConvocations: (id) => api.post(`/sessions/${id}/send-convocations`),

  // Télécharger le programme de formation
  downloadProgramme: (id) => api.get(`/sessions/${id}/generate-programme`, {
    responseType: 'blob',
  }),
};

// Participants API
export const participantsApi = {
  // Récupérer les participants d'une session
  getBySession: (sessionId) => api.get(`/participants/session/${sessionId}`),

  // Récupérer tous les participants
  getAll: () => api.get('/participants'),
};

// Entreprises API
export const entreprisesApi = {
  // Récupérer toutes les entreprises
  getAll: () => api.get('/entreprises'),

  // Récupérer une entreprise par ID
  getById: (id) => api.get(`/entreprises/${id}`),

  // Récupérer les sessions d'une entreprise
  getSessions: (id) => api.get(`/entreprises/${id}/sessions`),

  // Exporter les infos d'une entreprise en CSV
  exportCSV: (id) => api.get(`/entreprises/${id}/export-csv`, {
    responseType: 'blob',
  }),
};

// Documents API
export const documentsApi = {
  // Récupérer les documents d'une session
  getBySession: (sessionId) => api.get(`/documents/session/${sessionId}`),

  // Télécharger un document
  download: (id) => api.get(`/documents/${id}/download`, {
    responseType: 'blob',
  }),
};

export default api;
