const express = require('express');
const router = express.Router();
const documentService = require('../services/documentService');
const emailService = require('../services/emailService');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

/**
 * Route pour générer et envoyer une convocation par email
 */
router.post('/send-invitation', async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      formationTitle,
      formationDate,
      formationLocation,
      formationHours
    } = req.body;

    // Vérification des champs obligatoires
    if (!email || !firstName || !lastName || !formationTitle || !formationDate || !formationLocation) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être renseignés'
      });
    }

    // Génération du document de convocation
    const pdfBuffer = await documentService.generateInvitation({
      firstName,
      lastName,
      formationTitle,
      formationDate,
      formationLocation,
      formationHours
    });

    // Préparation du contenu de l'email
    const subject = `Convocation à la formation : ${formationTitle}`;
    const html = `
      <h1>Convocation à la formation</h1>
      <p>Bonjour ${firstName} ${lastName},</p>
      <p>Nous avons le plaisir de vous convier à la formation suivante :</p>
      <ul>
        <li><strong>Formation :</strong> ${formationTitle}</li>
        <li><strong>Date :</strong> ${formationDate}</li>
        <li><strong>Lieu :</strong> ${formationLocation}</li>
        <li><strong>Horaires :</strong> ${formationHours || '9h00 - 17h00'}</li>
      </ul>
      <p>Vous trouverez votre convocation officielle en pièce jointe.</p>
      <p>Merci de confirmer votre présence en répondant à cet email.</p>
      <p>Cordialement,</p>
      <p>L'équipe de formation</p>
    `;

    // Préparation des pièces jointes
    const attachments = [
      {
        filename: `convocation_${lastName.replace(/\s+/g, '_')}_${firstName.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer.toString('base64'),
      },
    ];

    // Envoi de l'email avec la pièce jointe
    const result = await emailService.sendEmailWithAttachments(
      email,
      subject,
      html,
      attachments,
      'formation@automate-formation.fr'
    );

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Convocation envoyée avec succès',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de la convocation',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur lors de la génération et de l\'envoi de la convocation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la génération et de l\'envoi de la convocation',
      error: error.message
    });
  }
});

/**
 * Route pour générer et envoyer un certificat de réalisation par email
 */
router.post('/send-certificate', async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      formationTitle,
      formationDate,
      formationLocation,
      formationDuration,
      formateur,
      city
    } = req.body;

    // Vérification des champs obligatoires
    if (!email || !firstName || !lastName || !formationTitle || !formationDate) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être renseignés'
      });
    }

    // Génération du certificat de réalisation
    const pdfBuffer = await documentService.generateCertificate({
      firstName,
      lastName,
      formationTitle,
      formationDate,
      formationLocation: formationLocation || 'Paris',
      formationDuration,
      formateur,
      city
    });

    // Préparation du contenu de l'email
    const subject = `Certificat de réalisation : ${formationTitle}`;
    const html = `
      <h1>Certificat de réalisation</h1>
      <p>Bonjour ${firstName} ${lastName},</p>
      <p>Nous avons le plaisir de vous faire parvenir votre certificat de réalisation pour la formation suivante :</p>
      <ul>
        <li><strong>Formation :</strong> ${formationTitle}</li>
        <li><strong>Date :</strong> ${formationDate}</li>
        <li><strong>Durée :</strong> ${formationDuration || '7 heures'}</li>
      </ul>
      <p>Vous trouverez votre certificat en pièce jointe.</p>
      <p>Nous vous remercions pour votre participation et restons à votre disposition pour toute question.</p>
      <p>Cordialement,</p>
      <p>L'équipe de formation</p>
    `;

    // Préparation des pièces jointes
    const attachments = [
      {
        filename: `certificat_${lastName.replace(/\s+/g, '_')}_${firstName.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer.toString('base64'),
      },
    ];

    // Envoi de l'email avec la pièce jointe
    const result = await emailService.sendEmailWithAttachments(
      email,
      subject,
      html,
      attachments,
      'formation@automate-formation.fr'
    );

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Certificat envoyé avec succès',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi du certificat',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur lors de la génération et de l\'envoi du certificat:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la génération et de l\'envoi du certificat',
      error: error.message
    });
  }
});

/**
 * Helper function pour appeler le script Python de génération
 */
async function callPythonGenerator(scriptName, args) {
  return new Promise((resolve, reject) => {
    const pythonPath = process.env.PYTHON_PATH || 'python3';
    const scriptPath = path.join(__dirname, '..', 'services', scriptName);
    
    const pythonProcess = spawn(pythonPath, [scriptPath, ...args]);
    
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${stderr}`));
      } else {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (e) {
          resolve({ success: true, output: stdout });
        }
      }
    });
  });
}

/**
 * Générer un document spécifique depuis un template Word
 */
router.post('/generate/:documentType', async (req, res) => {
  try {
    const { documentType } = req.params;
    const { sessionId, participantId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'sessionId est requis'
      });
    }
    
    // Mapper les types de documents aux méthodes Python
    const documentTypeMap = {
      'convention': 'generer_convention',
      'programme': 'generer_programme',
      'proposition': 'generer_proposition',
      'convocation': 'generer_convocation',
      'certificat': 'generer_certificat',
      'emargement_entreprise': 'generer_feuille_emargement_entreprise',
      'emargement_individuel': 'generer_feuille_emargement_individuelle',
      'questionnaire_prealable': 'generer_questionnaire_prealable',
      'evaluation_chaud': 'generer_evaluation_chaud',
      'evaluation_froid': 'generer_evaluation_froid',
      'evaluation_client': 'generer_evaluation_client',
      'reglement_interieur': 'generer_reglement_interieur',
      'bulletin_inscription': 'generer_bulletin_inscription',
      'grille_competences': 'generer_grille_competences',
      'contrat_formateur': 'generer_contrat_formateur',
      'deroule_pedagogique': 'generer_deroule_pedagogique',
      'questionnaire_formateur': 'generer_questionnaire_formateur',
      'evaluation_opco': 'generer_evaluation_opco',
      'traitement_reclamations': 'generer_traitement_reclamations'
    };
    
    const methodName = documentTypeMap[documentType];
    if (!methodName) {
      return res.status(400).json({
        success: false,
        message: `Type de document non reconnu: ${documentType}`
      });
    }
    
    // Vérifier si participantId est requis pour ce type de document
    const requiresParticipant = [
      'convocation', 'certificat', 'emargement_individuel', 
      'questionnaire_prealable', 'evaluation_chaud', 'evaluation_froid',
      'bulletin_inscription', 'grille_competences'
    ];
    
    if (requiresParticipant.includes(documentType) && !participantId) {
      return res.status(400).json({
        success: false,
        message: `participantId est requis pour le type de document: ${documentType}`
      });
    }
    
    // Appeler le script Python
    const args = [methodName, sessionId];
    if (participantId) {
      args.push(participantId);
    }
    
    const result = await callPythonGenerator('templateDocumentGenerator.py', args);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Document généré avec succès',
        filePath: result.filePath
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération du document',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur lors de la génération du document:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la génération du document',
      error: error.message
    });
  }
});

/**
 * Générer tous les documents pour une session
 */
router.post('/generate-all/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'sessionId est requis'
      });
    }
    
    // Appeler le script Python pour générer tous les documents
    const result = await callPythonGenerator('templateDocumentGenerator.py', [
      'generer_tous_documents_session',
      sessionId
    ]);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Tous les documents ont été générés avec succès',
        documents: result.documents
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération des documents',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur lors de la génération de tous les documents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la génération des documents',
      error: error.message
    });
  }
});

/**
 * Télécharger un document généré
 */
router.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'generated_documents', filename);
    
    // Vérifier que le fichier existe
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'Fichier non trouvé'
      });
    }
    
    // Envoyer le fichier
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Erreur lors du téléchargement:', err);
        res.status(500).json({
          success: false,
          message: 'Erreur lors du téléchargement du fichier'
        });
      }
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du téléchargement',
      error: error.message
    });
  }
});

/**
 * ============================================
 * NOUVELLES ROUTES : GÉNÉRATION PAR PHASE
 * ============================================
 */

/**
 * PHASE 2 : Générer proposition + programme
 * POST /api/documents/phase/proposition/:sessionId
 */
router.post('/phase/proposition/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const result = await callPythonGenerator('templateDocumentGenerator.py', [
      'generer_phase_proposition',
      sessionId
    ]);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Proposition et programme générés',
        documents: result.documents
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur phase proposition:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * PHASE 3 : Générer convention
 * POST /api/documents/phase/convention/:sessionId
 */
router.post('/phase/convention/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const result = await callPythonGenerator('templateDocumentGenerator.py', [
      'generer_convention',
      sessionId
    ]);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Convention générée',
        filePath: result.filePath
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur phase convention:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * PHASE 4 : Générer questionnaires préalables (J-7)
 * POST /api/documents/phase/preparation/:sessionId
 */
router.post('/phase/preparation/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const result = await callPythonGenerator('templateDocumentGenerator.py', [
      'generer_phase_preparation',
      sessionId
    ]);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Questionnaires préalables générés',
        documents: result.documents
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur phase préparation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * PHASE 5 : Générer convocations + feuilles émargement (J-4)
 * POST /api/documents/phase/convocation/:sessionId
 */
router.post('/phase/convocation/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const result = await callPythonGenerator('templateDocumentGenerator.py', [
      'generer_phase_convocation',
      sessionId
    ]);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Convocations et feuilles d\'émargement générées',
        documents: result.documents
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur phase convocation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * PHASE 7 : Générer évaluations à chaud (Fin formation)
 * POST /api/documents/phase/evaluation-chaud/:sessionId
 */
router.post('/phase/evaluation-chaud/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const result = await callPythonGenerator('templateDocumentGenerator.py', [
      'generer_phase_evaluation_chaud',
      sessionId
    ]);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Évaluations à chaud générées',
        documents: result.documents
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur phase évaluation chaud:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * PHASE 9 : Générer certificats + évaluation client (J+2)
 * POST /api/documents/phase/cloture/:sessionId
 */
router.post('/phase/cloture/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const result = await callPythonGenerator('templateDocumentGenerator.py', [
      'generer_phase_cloture',
      sessionId
    ]);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Certificats et évaluation client générés',
        documents: result.documents
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur phase clôture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * PHASE 10 : Générer évaluations à froid (J+60)
 * POST /api/documents/phase/evaluation-froid/:sessionId
 */
router.post('/phase/evaluation-froid/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const result = await callPythonGenerator('templateDocumentGenerator.py', [
      'generer_phase_evaluation_froid',
      sessionId
    ]);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Évaluations à froid générées',
        documents: result.documents
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur phase évaluation froid:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * Liste des documents générés pour une session
 * GET /api/documents/session/:sessionId
 */
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const documentsDir = path.join(__dirname, '..', 'generated_documents', `session_${sessionId}`);
    
    try {
      const files = await fs.readdir(documentsDir, { withFileTypes: true });
      const documents = files
        .filter(file => file.isFile())
        .map(file => ({
          name: file.name,
          path: `/api/documents/download/${sessionId}/${file.name}`,
          size: 0, // À calculer si nécessaire
          createdAt: new Date() // À récupérer depuis les stats du fichier
        }));
      
      res.status(200).json({
        success: true,
        documents
      });
    } catch (error) {
      // Dossier n'existe pas encore
      res.status(200).json({
        success: true,
        documents: []
      });
    }
  } catch (error) {
    console.error('Erreur liste documents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

/**
 * Télécharger un document généré
 * GET /api/documents/download/:sessionId/:filename
 */
router.get('/download/:sessionId/:filename', async (req, res) => {
  try {
    const { sessionId, filename } = req.params;
    const filePath = path.join(__dirname, '..', 'generated_documents', `session_${sessionId}`, filename);
    
    try {
      await fs.access(filePath);
      res.download(filePath, filename);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'Fichier non trouvé'
      });
    }
  } catch (error) {
    console.error('Erreur téléchargement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

module.exports = router;
