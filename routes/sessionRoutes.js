const express = require('express');
const router = express.Router();
const supabaseService = require('../services/supabaseService');
const pdfGenerator = require('../services/pdfGenerator');

// Valider une demande
router.post('/sessions/:id/validate', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier que la session existe
    const session = await supabaseService.getSessionById(id);
    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    // Vérifier que la session est au statut 'demande'
    if (session.statut !== 'demande') {
      return res.status(400).json({ 
        error: 'Seules les demandes au statut "demande" peuvent être validées' 
      });
    }

    // Mettre à jour le statut
    const updatedSession = await supabaseService.updateSession(id, {
      statut: 'en_attente'
    });

    res.json({ success: true, session: updatedSession });
  } catch (error) {
    console.error('Erreur lors de la validation de la demande:', error);
    res.status(500).json({ error: 'Erreur lors de la validation' });
  }
});

// Marquer le devis comme envoyé
router.post('/sessions/:id/mark-devis-sent', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier que la session existe
    const session = await supabaseService.getSessionById(id);
    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    // Vérifier que la session est au statut 'demande'
    if (session.statut !== 'demande') {
      return res.status(400).json({ 
        error: 'Le devis ne peut être marqué comme envoyé que pour les sessions au statut "demande"' 
      });
    }

    // Mettre à jour le statut
    const updatedSession = await supabaseService.updateSession(id, {
      statut: 'devis_envoye',
      devis_envoye_le: new Date().toISOString()
    });

    res.json({ success: true, session: updatedSession });
  } catch (error) {
    console.error('Erreur lors du marquage du devis comme envoyé:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Réponse au devis (accepté/refusé)
router.post('/sessions/:id/devis-response', async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    if (!response || !['accepte', 'refuse'].includes(response)) {
      return res.status(400).json({ 
        error: 'La réponse doit être "accepte" ou "refuse"' 
      });
    }

    // Vérifier que la session existe
    const session = await supabaseService.getSessionById(id);
    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    // Vérifier que la session est au statut 'devis_envoye'
    if (session.statut !== 'devis_envoye') {
      return res.status(400).json({ 
        error: 'La réponse au devis ne peut être enregistrée que pour les sessions au statut "devis_envoye"' 
      });
    }

    let updatedSession;

    if (response === 'accepte') {
      // Devis accepté → Passer à 'en_attente' (convention en attente de signature)
      updatedSession = await supabaseService.updateSession(id, {
        statut: 'en_attente',
        devis_accepte_le: new Date().toISOString()
      });

      // TODO: Déclencher l'envoi de la convention via DocuSeal
      // Cela sera géré par un trigger Supabase ou un webhook

    } else if (response === 'refuse') {
      // Devis refusé → Annuler la session
      updatedSession = await supabaseService.updateSession(id, {
        statut: 'annulee',
        devis_refuse_le: new Date().toISOString(),
        raison_annulation: 'devis_refuse'
      });
    }

    res.json({ success: true, session: updatedSession });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la réponse au devis:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Envoyer la convention (appelé par trigger ou manuellement)
router.post('/sessions/:id/send-convention', async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await supabaseService.getSessionById(id);
    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    // TODO: Intégration DocuSeal
    // 1. Générer le document de convention
    // 2. Envoyer via DocuSeal pour signature
    // 3. Enregistrer l'URL de signature

    console.log(`Envoi de la convention pour la session ${id}`);
    
    res.json({ 
      success: true, 
      message: 'Convention envoyée pour signature',
      session 
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la convention:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de la convention' });
  }
});

// Envoyer les convocations (appelé par trigger après signature convention)
router.post('/sessions/:id/send-convocations', async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await supabaseService.getSessionById(id);
    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    // Récupérer les participants
    const participants = await supabaseService.getParticipantsBySession(id);
    
    if (participants.length === 0) {
      return res.status(400).json({ 
        error: 'Aucun participant enregistré pour cette session' 
      });
    }

    // TODO: Générer et envoyer les convocations
    // 1. Pour chaque participant, générer une convocation PDF
    // 2. Envoyer par email via Resend
    
    console.log(`Envoi de ${participants.length} convocations pour la session ${id}`);

    // Mettre à jour le statut de la session
    const updatedSession = await supabaseService.updateSession(id, {
      statut: 'convoquee',
      convocations_envoyees_le: new Date().toISOString()
    });

    res.json({ 
      success: true, 
      message: `${participants.length} convocations envoyées`,
      session: updatedSession 
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi des convocations:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi des convocations' });
  }
});

// Récupérer les participants d'une session
router.get('/participants/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const participants = await supabaseService.getParticipantsBySession(sessionId);
    res.json(participants);
  } catch (error) {
    console.error('Erreur lors de la récupération des participants:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des participants' });
  }
});

// Récupérer tous les participants
router.get('/participants', async (req, res) => {
  try {
    const participants = await supabaseService.getAllParticipants();
    res.json(participants);
  } catch (error) {
    console.error('Erreur lors de la récupération des participants:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des participants' });
  }
});

// Récupérer les sessions d'une entreprise
router.get('/entreprises/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;
    const sessions = await supabaseService.getSessionsByEntreprise(id);
    res.json(sessions);
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des sessions' });
  }
});

// Générer le programme de formation en PDF
router.get('/sessions/:id/generate-programme', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer toutes les données nécessaires
    const session = await supabaseService.getSessionById(id);
    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    // Préparer les données pour le PDF
    const sessionData = {
      session: session,
      formation: {
        titre: session.formation_titre,
        duree: session.formation_duree || 35,
        objectifs: session.formation_objectifs || 'Objectifs à définir',
        programme: session.formation_programme || 'Programme à définir',
        public_vise: session.formation_public_vise || 'Tout public',
        prerequis: session.formation_prerequis || 'Aucun prérequis',
        competences_visees: session.formation_competences_visees || '',
        methodes_pedagogiques: session.formation_methodes_pedagogiques || 'Apports théoriques et pratiques',
        moyens_pedagogiques: session.formation_moyens_pedagogiques || 'Supports de formation',
        modalites_evaluation: session.formation_modalites_evaluation || 'Évaluation continue',
        accessibilite_handicap: session.formation_accessibilite_handicap || 'Nous contacter pour toute demande spécifique',
        delai_acces: session.formation_delai_acces || '2 semaines',
        modalites_acces: session.formation_modalites_acces || 'Inscription en ligne',
        prix_ht: session.formation_prix_ht || 0,
        nature_action: 'Formation professionnelle continue'
      },
      entreprise: {
        nom: session.entreprise_nom
      },
      formateur: {
        nom: session.formateur_nom || 'À définir',
        specialites: [],
        experience: ''
      },
      organisme: {
        nom: process.env.ORGANISME_NOM || 'Aladé Conseil',
        adresse: process.env.ORGANISME_ADRESSE || '',
        code_postal: process.env.ORGANISME_CODE_POSTAL || '',
        ville: process.env.ORGANISME_VILLE || '',
        siret: process.env.ORGANISME_SIRET || '',
        numero_declaration_activite: process.env.ORGANISME_NDA || '',
        telephone: process.env.ORGANISME_TELEPHONE || '',
        email: process.env.ORGANISME_EMAIL || process.env.EMAIL_FROM || '',
        logo_url: process.env.ORGANISME_LOGO_URL || '',
        referent_handicap: process.env.ORGANISME_REFERENT_HANDICAP || ''
      }
    };

    // Générer le PDF
    const pdfBuffer = await pdfGenerator.generateProgrammeFormation(sessionData);

    // Définir les en-têtes pour le téléchargement
    const filename = `Programme_${session.formation_titre?.replace(/[^a-z0-9]/gi, '_')}_${session.entreprise_nom?.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Erreur lors de la génération du programme:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du programme', details: error.message });
  }
});

// Exporter les informations d'une entreprise en CSV
router.get('/entreprises/:id/export-csv', async (req, res) => {
  try {
    const { id } = req.params;
    
    const entreprise = await supabaseService.getEntrepriseById(id);
    if (!entreprise) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }

    const sessions = await supabaseService.getSessionsByEntreprise(id);

    // Créer le contenu CSV
    let csv = 'Informations Entreprise\n';
    csv += `Nom,${entreprise.nom}\n`;
    csv += `Email,${entreprise.email}\n`;
    csv += `Téléphone,${entreprise.telephone || ''}\n`;
    csv += `Adresse,${entreprise.adresse || ''}\n`;
    csv += `Code Postal,${entreprise.code_postal || ''}\n`;
    csv += `Ville,${entreprise.ville || ''}\n`;
    csv += '\n';
    csv += 'Historique des Formations\n';
    csv += 'ID Session,Formation,Statut,Date Début,Date Fin,Nombre Participants\n';
    
    sessions.forEach(session => {
      csv += `${session.id},${session.formation_titre || ''},${session.statut},${session.date_debut || ''},${session.date_fin || ''},${session.nombre_participants || 0}\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${entreprise.nom}_export.csv"`);
    res.send('\ufeff' + csv); // BOM pour UTF-8
  } catch (error) {
    console.error('Erreur lors de l\'export CSV:', error);
    res.status(500).json({ error: 'Erreur lors de l\'export CSV' });
  }
});

module.exports = router;
