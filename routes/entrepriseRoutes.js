const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY);

// GET /api/entreprises - Liste toutes les entreprises
router.get('/entreprises', async (req, res) => {
  try {
    console.log('📊 Récupération des entreprises...');
    const { data, error } = await supabase
      .from('entreprises')
      .select('*')
      .order('nom', { ascending: true });

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      throw error;
    }

    console.log('✅ Entreprises récupérées:', data?.length || 0);
    res.json(data);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des entreprises:', error.message);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des entreprises',
      details: error.message 
    });
  }
});

// GET /api/entreprises/:id - Détails d'une entreprise
router.get('/entreprises/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('entreprises')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }

    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'entreprise:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'entreprise' });
  }
});

// GET /api/entreprises/:id/sessions - Sessions d'une entreprise
router.get('/entreprises/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('vue_sessions_formation')
      .select('*')
      .eq('entreprise_id', id)
      .order('date_debut', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des sessions' });
  }
});

// POST /api/entreprises - Créer une entreprise
router.post('/entreprises', async (req, res) => {
  try {
    const { nom, adresse, code_postal, ville, siret, email_contact, telephone } = req.body;

    const { data, error } = await supabase
      .from('entreprises')
      .insert([{
        nom,
        adresse,
        code_postal,
        ville,
        siret,
        email_contact,
        telephone
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Erreur lors de la création de l\'entreprise:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'entreprise' });
  }
});

// PUT /api/entreprises/:id - Modifier une entreprise
router.put('/entreprises/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, adresse, code_postal, ville, siret, email_contact, telephone } = req.body;

    const { data, error } = await supabase
      .from('entreprises')
      .update({
        nom,
        adresse,
        code_postal,
        ville,
        siret,
        email_contact,
        telephone
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la modification de l\'entreprise:', error);
    res.status(500).json({ error: 'Erreur lors de la modification de l\'entreprise' });
  }
});

// DELETE /api/entreprises/:id - Supprimer une entreprise
router.delete('/entreprises/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('entreprises')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Entreprise supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'entreprise:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'entreprise' });
  }
});

module.exports = router;
