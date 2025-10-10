const express = require('express');
const router = express.Router();
const documentService = require('../services/documentService');
const emailService = require('../services/emailService');

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

module.exports = router;
