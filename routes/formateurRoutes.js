const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialisation du client Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY
);

// ============================================
// ROUTES FORMATEURS
// ============================================

/**
 * GET /api/formateurs
 * Récupérer tous les formateurs
 */
router.get('/formateurs', async (req, res) => {
  try {
    const { actif } = req.query;
    
    let query = supabase
      .from('formateurs')
      .select('*')
      .order('nom', { ascending: true });
    
    // Filtrer par statut actif si spécifié
    if (actif !== undefined) {
      query = query.eq('actif', actif === 'true');
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json({ success: true, formateurs: data });
  } catch (error) {
    console.error('Erreur lors de la récupération des formateurs:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération des formateurs',
      details: error.message 
    });
  }
});

/**
 * GET /api/formateurs/:id
 * Récupérer un formateur par ID
 */
router.get('/formateurs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('formateurs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ 
        success: false, 
        error: 'Formateur non trouvé' 
      });
    }
    
    res.json({ success: true, formateur: data });
  } catch (error) {
    console.error('Erreur lors de la récupération du formateur:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération du formateur',
      details: error.message 
    });
  }
});

/**
 * POST /api/formateurs
 * Créer un nouveau formateur
 */
router.post('/formateurs', async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      telephone,
      specialites,
      tarif_horaire,
      tarif_journalier,
      cv_url,
      actif
    } = req.body;
    
    // Validation des champs obligatoires
    if (!nom || !prenom || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Les champs nom, prenom et email sont obligatoires' 
      });
    }
    
    const { data, error } = await supabase
      .from('formateurs')
      .insert([{
        nom,
        prenom,
        email,
        telephone,
        specialites: specialites || [],
        tarif_horaire,
        tarif_journalier,
        cv_url,
        actif: actif !== undefined ? actif : true
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({ success: true, formateur: data });
  } catch (error) {
    console.error('Erreur lors de la création du formateur:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la création du formateur',
      details: error.message 
    });
  }
});

/**
 * PUT /api/formateurs/:id
 * Mettre à jour un formateur
 */
router.put('/formateurs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom,
      prenom,
      email,
      telephone,
      specialites,
      tarif_horaire,
      tarif_journalier,
      cv_url,
      actif
    } = req.body;
    
    const { data, error } = await supabase
      .from('formateurs')
      .update({
        nom,
        prenom,
        email,
        telephone,
        specialites,
        tarif_horaire,
        tarif_journalier,
        cv_url,
        actif
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ 
        success: false, 
        error: 'Formateur non trouvé' 
      });
    }
    
    res.json({ success: true, formateur: data });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du formateur:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la mise à jour du formateur',
      details: error.message 
    });
  }
});

/**
 * DELETE /api/formateurs/:id
 * Supprimer un formateur
 */
router.delete('/formateurs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('formateurs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ success: true, message: 'Formateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du formateur:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la suppression du formateur',
      details: error.message 
    });
  }
});

/**
 * GET /api/formateurs/:id/sessions
 * Récupérer les sessions d'un formateur
 */
router.get('/formateurs/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        entreprises:entreprise_id(nom_entreprise),
        formations_catalogue:formation_catalogue_id(titre)
      `)
      .eq('formateur_id', id)
      .order('date_debut', { ascending: false });
    
    if (error) throw error;
    
    res.json({ success: true, sessions: data });
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions du formateur:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération des sessions',
      details: error.message 
    });
  }
});

/**
 * PATCH /api/formateurs/:id/toggle-actif
 * Basculer le statut actif/inactif d'un formateur
 */
router.patch('/formateurs/:id/toggle-actif', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer le formateur actuel
    const { data: formateur, error: fetchError } = await supabase
      .from('formateurs')
      .select('actif')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    if (!formateur) {
      return res.status(404).json({ 
        success: false, 
        error: 'Formateur non trouvé' 
      });
    }
    
    // Inverser le statut
    const { data, error } = await supabase
      .from('formateurs')
      .update({ actif: !formateur.actif })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, formateur: data });
  } catch (error) {
    console.error('Erreur lors du changement de statut du formateur:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors du changement de statut',
      details: error.message 
    });
  }
});

module.exports = router;
