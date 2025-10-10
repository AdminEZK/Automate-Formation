const express = require('express');
const router = express.Router();
const supabaseService = require('../services/supabaseService');

// NOTE: Les routes /entreprises ont été déplacées dans routes/entrepriseRoutes.js

// Routes pour les formations du catalogue
router.get('/formations', async (req, res) => {
  try {
    const formations = await supabaseService.getAllFormations();
    res.json(formations);
  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des formations' });
  }
});

router.get('/formations/:id', async (req, res) => {
  try {
    const formation = await supabaseService.getFormationById(req.params.id);
    if (!formation) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }
    res.json(formation);
  } catch (error) {
    console.error(`Erreur lors de la récupération de la formation ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la formation' });
  }
});

router.post('/formations', async (req, res) => {
  try {
    // Validation des données requises
    const { titre } = req.body;
    if (!titre) {
      return res.status(400).json({ error: 'Le titre de la formation est requis' });
    }

    const nouvelleFormation = await supabaseService.createFormation(req.body);
    res.status(201).json(nouvelleFormation);
  } catch (error) {
    console.error('Erreur lors de la création de la formation:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la formation' });
  }
});

router.put('/formations/:id', async (req, res) => {
  try {
    const formationExistante = await supabaseService.getFormationById(req.params.id);
    if (!formationExistante) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }

    const formationMiseAJour = await supabaseService.updateFormation(req.params.id, req.body);
    res.json(formationMiseAJour);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la formation ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la formation' });
  }
});

router.delete('/formations/:id', async (req, res) => {
  try {
    const formationExistante = await supabaseService.getFormationById(req.params.id);
    if (!formationExistante) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }

    await supabaseService.deleteFormation(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(`Erreur lors de la suppression de la formation ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la formation' });
  }
});

// Routes pour les sessions de formation
router.get('/sessions', async (req, res) => {
  try {
    // Extraction des paramètres de filtrage de la requête
    const { statut, entrepriseId, formationId, ascending } = req.query;
    const options = {
      statut,
      entrepriseId,
      formationId,
      ascending: ascending === 'true'
    };

    const sessions = await supabaseService.getAllSessions(options);
    res.json(sessions);
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions de formation:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des sessions de formation' });
  }
});

router.get('/sessions/:id', async (req, res) => {
  try {
    const session = await supabaseService.getSessionById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session de formation non trouvée' });
    }
    res.json(session);
  } catch (error) {
    console.error(`Erreur lors de la récupération de la session ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la session de formation' });
  }
});

router.post('/sessions', async (req, res) => {
  try {
    // Validation des données requises
    const { entreprise_id, formation_catalogue_id } = req.body;
    if (!entreprise_id || !formation_catalogue_id) {
      return res.status(400).json({ error: 'L\'ID de l\'entreprise et l\'ID de la formation sont requis' });
    }

    // Vérification que l'entreprise et la formation existent
    const entreprise = await supabaseService.getEntrepriseById(entreprise_id);
    if (!entreprise) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }

    const formation = await supabaseService.getFormationById(formation_catalogue_id);
    if (!formation) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }

    const nouvelleSession = await supabaseService.createSession(req.body);
    res.status(201).json(nouvelleSession);
  } catch (error) {
    console.error('Erreur lors de la création de la session de formation:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la session de formation' });
  }
});

router.put('/sessions/:id', async (req, res) => {
  try {
    // Vérification que la session existe
    const sessionExistante = await supabaseService.getSessionById(req.params.id);
    if (!sessionExistante) {
      return res.status(404).json({ error: 'Session de formation non trouvée' });
    }

    // Si on modifie l'entreprise ou la formation, vérifier qu'elles existent
    if (req.body.entreprise_id) {
      const entreprise = await supabaseService.getEntrepriseById(req.body.entreprise_id);
      if (!entreprise) {
        return res.status(404).json({ error: 'Entreprise non trouvée' });
      }
    }

    if (req.body.formation_catalogue_id) {
      const formation = await supabaseService.getFormationById(req.body.formation_catalogue_id);
      if (!formation) {
        return res.status(404).json({ error: 'Formation non trouvée' });
      }
    }

    const sessionMiseAJour = await supabaseService.updateSession(req.params.id, req.body);
    res.json(sessionMiseAJour);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la session ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la session de formation' });
  }
});

router.patch('/sessions/:id/statut', async (req, res) => {
  try {
    const { statut } = req.body;
    if (!statut) {
      return res.status(400).json({ error: 'Le statut est requis' });
    }

    // Vérification que la session existe
    const sessionExistante = await supabaseService.getSessionById(req.params.id);
    if (!sessionExistante) {
      return res.status(404).json({ error: 'Session de formation non trouvée' });
    }

    const sessionMiseAJour = await supabaseService.updateSessionStatus(req.params.id, statut);
    res.json(sessionMiseAJour);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du statut de la session ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut de la session de formation' });
  }
});

router.delete('/sessions/:id', async (req, res) => {
  try {
    const sessionExistante = await supabaseService.getSessionById(req.params.id);
    if (!sessionExistante) {
      return res.status(404).json({ error: 'Session de formation non trouvée' });
    }

    await supabaseService.deleteSession(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(`Erreur lors de la suppression de la session ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la session de formation' });
  }
});

module.exports = router;
