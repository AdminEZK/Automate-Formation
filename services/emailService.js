const { Resend } = require('resend');
require('dotenv').config();

// Initialisation de Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Service d'envoi d'emails avec Resend
 */
class EmailService {
  /**
   * Envoie un email
   * @param {string} to - Adresse email du destinataire
   * @param {string} subject - Sujet de l'email
   * @param {string} html - Contenu HTML de l'email
   * @param {string} from - Adresse email de l'expéditeur (optionnel)
   * @returns {Promise} - Promesse contenant la réponse de l'API Resend
   */
  async sendEmail(to, subject, html, from = 'onboarding@resend.dev') {
    try {
      const data = await resend.emails.send({
        from,
        to,
        subject,
        html,
      });
      
      console.log('Email envoyé avec succès:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return { success: false, error };
    }
  }

  /**
   * Envoie un email avec une pièce jointe
   * @param {string} to - Adresse email du destinataire
   * @param {string} subject - Sujet de l'email
   * @param {string} html - Contenu HTML de l'email
   * @param {Array} attachments - Tableau d'objets contenant les pièces jointes
   * @param {string} from - Adresse email de l'expéditeur (optionnel)
   * @returns {Promise} - Promesse contenant la réponse de l'API Resend
   */
  async sendEmailWithAttachments(to, subject, html, attachments, from = 'onboarding@resend.dev') {
    try {
      const data = await resend.emails.send({
        from,
        to,
        subject,
        html,
        attachments,
      });
      
      console.log('Email avec pièces jointes envoyé avec succès:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email avec pièces jointes:', error);
      return { success: false, error };
    }
  }

  /**
   * Envoie un email de convocation à une formation
   * @param {string} to - Adresse email du destinataire
   * @param {string} name - Nom du destinataire
   * @param {string} formationTitle - Titre de la formation
   * @param {string} formationDate - Date de la formation
   * @param {string} formationLocation - Lieu de la formation
   * @param {string} from - Adresse email de l'expéditeur (optionnel)
   * @returns {Promise} - Promesse contenant la réponse de l'API Resend
   */
  async sendFormationInvitation(to, name, formationTitle, formationDate, formationLocation, from = 'formation@votreentreprise.com') {
    const subject = `Convocation à la formation : ${formationTitle}`;
    const html = `
      <h1>Convocation à la formation</h1>
      <p>Bonjour ${name},</p>
      <p>Nous avons le plaisir de vous convier à la formation suivante :</p>
      <ul>
        <li><strong>Formation :</strong> ${formationTitle}</li>
        <li><strong>Date :</strong> ${formationDate}</li>
        <li><strong>Lieu :</strong> ${formationLocation}</li>
      </ul>
      <p>Merci de confirmer votre présence en répondant à cet email.</p>
      <p>Cordialement,</p>
      <p>L'équipe de formation</p>
    `;

    return this.sendEmail(to, subject, html, from);
  }

  /**
   * Envoie un email avec un certificat de réalisation
   * @param {string} to - Adresse email du destinataire
   * @param {string} name - Nom du destinataire
   * @param {string} formationTitle - Titre de la formation
   * @param {string} formationDate - Date de la formation
   * @param {Buffer} certificateBuffer - Buffer du certificat de réalisation
   * @param {string} from - Adresse email de l'expéditeur (optionnel)
   * @returns {Promise} - Promesse contenant la réponse de l'API Resend
   */
  async sendCertificate(to, name, formationTitle, formationDate, certificateBuffer, from = 'formation@votreentreprise.com') {
    const subject = `Certificat de réalisation : ${formationTitle}`;
    const html = `
      <h1>Certificat de réalisation</h1>
      <p>Bonjour ${name},</p>
      <p>Nous avons le plaisir de vous faire parvenir votre certificat de réalisation pour la formation suivante :</p>
      <ul>
        <li><strong>Formation :</strong> ${formationTitle}</li>
        <li><strong>Date :</strong> ${formationDate}</li>
      </ul>
      <p>Vous trouverez votre certificat en pièce jointe.</p>
      <p>Cordialement,</p>
      <p>L'équipe de formation</p>
    `;

    const attachments = [
      {
        filename: `certificat_${name.replace(/\s+/g, '_')}_${formationTitle.replace(/\s+/g, '_')}.pdf`,
        content: certificateBuffer,
      },
    ];

    return this.sendEmailWithAttachments(to, subject, html, attachments, from);
  }

  // ============================================
  // EMAILS QUALIOPI (12 types)
  // ============================================

  /**
   * 1. Email de confirmation de demande
   */
  async sendConfirmationDemande(to, entreprise, formation, from = 'onboarding@resend.dev') {
    const subject = `Confirmation de votre demande de formation`;
    const html = `
      <h1>Demande de formation enregistrée</h1>
      <p>Bonjour,</p>
      <p>Nous avons bien reçu votre demande de formation pour <strong>${entreprise}</strong>.</p>
      <h3>Formation demandée :</h3>
      <ul>
        <li><strong>Formation :</strong> ${formation.titre}</li>
        <li><strong>Durée :</strong> ${formation.duree} heures</li>
        <li><strong>Dates souhaitées :</strong> ${formation.dates}</li>
      </ul>
      <p>Nous reviendrons vers vous sous 48h avec une proposition commerciale détaillée.</p>
      <p>Cordialement,</p>
      <p><strong>Aladé Conseil</strong><br>
      02.99.19.37.09<br>
      contact@aladeconseils.com</p>
    `;
    return this.sendEmail(to, subject, html, from);
  }

  /**
   * 2. Email proposition commerciale avec documents
   */
  async sendPropositionCommerciale(to, entreprise, documents, from = 'contact@aladeconseils.com') {
    const subject = `Proposition de formation - ${entreprise}`;
    const html = `
      <h1>Proposition de formation</h1>
      <p>Bonjour,</p>
      <p>Nous avons le plaisir de vous adresser notre proposition de formation.</p>
      <p>Vous trouverez en pièces jointes :</p>
      <ul>
        <li>La proposition commerciale (devis)</li>
        <li>Le programme détaillé de la formation</li>
      </ul>
      <p>N'hésitez pas à nous contacter pour toute question.</p>
      <p>Cordialement,</p>
      <p><strong>Aladé Conseil</strong></p>
    `;
    return this.sendEmailWithAttachments(to, subject, html, documents, from);
  }

  /**
   * 3. Email demande de signature convention
   */
  async sendDemandeSignature(to, entreprise, urlSignature, from = 'contact@aladeconseils.com') {
    const subject = `Signature de la convention de formation`;
    const html = `
      <h1>Convention de formation à signer</h1>
      <p>Bonjour,</p>
      <p>Votre proposition de formation a été acceptée. Merci de signer la convention de formation.</p>
      <p><a href="${urlSignature}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Signer la convention</a></p>
      <p>Cette signature est sécurisée via Yousign.</p>
      <p>Cordialement,</p>
      <p><strong>Aladé Conseil</strong></p>
    `;
    return this.sendEmail(to, subject, html, from);
  }

  /**
   * 4. Email questionnaire préalable (J-7)
   */
  async sendQuestionnairePrealable(to, participant, formation, questionnairePath, from = 'contact@aladeconseils.com') {
    const subject = `Questionnaire préalable - ${formation.titre}`;
    const html = `
      <h1>Questionnaire préalable à la formation</h1>
      <p>Bonjour ${participant.prenom} ${participant.nom},</p>
      <p>Dans le cadre de votre participation à la formation <strong>${formation.titre}</strong>, nous vous remercions de bien vouloir compléter le questionnaire préalable ci-joint.</p>
      <p>Ce questionnaire nous permettra d'adapter au mieux la formation à vos besoins.</p>
      <p><strong>Dates de la formation :</strong> ${formation.dates}</p>
      <p>Merci de nous retourner ce questionnaire complété avant le début de la formation.</p>
      <p>Cordialement,</p>
      <p><strong>Aladé Conseil</strong></p>
    `;
    const attachments = [{ filename: 'questionnaire_prealable.pdf', path: questionnairePath }];
    return this.sendEmailWithAttachments(to, subject, html, attachments, from);
  }

  /**
   * 5. Email convocation (J-4)
   */
  async sendConvocation(to, participant, formation, convocationPath, from = 'contact@aladeconseils.com') {
    const subject = `Convocation - ${formation.titre}`;
    const html = `
      <h1>Convocation à la formation</h1>
      <p>Bonjour ${participant.prenom} ${participant.nom},</p>
      <p>Nous avons le plaisir de vous convoquer à la formation suivante :</p>
      <h3>Informations pratiques :</h3>
      <ul>
        <li><strong>Formation :</strong> ${formation.titre}</li>
        <li><strong>Dates :</strong> ${formation.dates}</li>
        <li><strong>Horaires :</strong> ${formation.horaires}</li>
        <li><strong>Lieu :</strong> ${formation.lieu}</li>
        <li><strong>Formateur :</strong> ${formation.formateur}</li>
      </ul>
      <p>Merci de vous présenter 15 minutes avant le début avec une pièce d'identité.</p>
      <p>Vous trouverez votre convocation en pièce jointe.</p>
      <p>À très bientôt,</p>
      <p><strong>Aladé Conseil</strong></p>
    `;
    const attachments = [{ filename: 'convocation.pdf', path: convocationPath }];
    return this.sendEmailWithAttachments(to, subject, html, attachments, from);
  }

  /**
   * 6. Email évaluation à chaud (fin formation)
   */
  async sendEvaluationAChaud(to, participant, formation, evaluationPath, from = 'contact@aladeconseils.com') {
    const subject = `Évaluation de la formation - ${formation.titre}`;
    const html = `
      <h1>Évaluation de la formation</h1>
      <p>Bonjour ${participant.prenom} ${participant.nom},</p>
      <p>Merci d'avoir participé à la formation <strong>${formation.titre}</strong>.</p>
      <p>Votre avis nous intéresse ! Merci de prendre quelques minutes pour évaluer cette formation.</p>
      <p>Vous trouverez le questionnaire d'évaluation en pièce jointe.</p>
      <p>Cordialement,</p>
      <p><strong>Aladé Conseil</strong></p>
    `;
    const attachments = [{ filename: 'evaluation_a_chaud.pdf', path: evaluationPath }];
    return this.sendEmailWithAttachments(to, subject, html, attachments, from);
  }

  /**
   * 7. Email certificat (J+2)
   */
  async sendCertificatRealisation(to, participant, formation, certificatPath, from = 'contact@aladeconseils.com') {
    const subject = `Certificat de réalisation - ${formation.titre}`;
    const html = `
      <h1>Certificat de réalisation</h1>
      <p>Bonjour ${participant.prenom} ${participant.nom},</p>
      <p>Félicitations pour avoir suivi la formation <strong>${formation.titre}</strong> !</p>
      <p>Vous trouverez ci-joint votre certificat de réalisation.</p>
      <p>Nous espérons que cette formation vous a été profitable.</p>
      <p>Cordialement,</p>
      <p><strong>Aladé Conseil</strong></p>
    `;
    const attachments = [{ filename: 'certificat_realisation.pdf', path: certificatPath }];
    return this.sendEmailWithAttachments(to, subject, html, attachments, from);
  }

  /**
   * 8. Email évaluation à froid (J+60)
   */
  async sendEvaluationAFroid(to, participant, formation, evaluationPath, from = 'contact@aladeconseils.com') {
    const subject = `Évaluation à froid - ${formation.titre}`;
    const html = `
      <h1>Évaluation à froid</h1>
      <p>Bonjour ${participant.prenom} ${participant.nom},</p>
      <p>2 mois après la formation <strong>${formation.titre}</strong>, nous souhaitons connaître l'impact de celle-ci sur votre pratique professionnelle.</p>
      <p>Merci de prendre quelques minutes pour répondre à ce questionnaire.</p>
      <p>Cordialement,</p>
      <p><strong>Aladé Conseil</strong></p>
    `;
    const attachments = [{ filename: 'evaluation_a_froid.pdf', path: evaluationPath }];
    return this.sendEmailWithAttachments(to, subject, html, attachments, from);
  }

  /**
   * 9. Email bilan formateur (J+1)
   */
  async sendBilanFormateur(to, formateur, formation, bilanPath, from = 'contact@aladeconseils.com') {
    const subject = `Bilan formateur - ${formation.titre}`;
    const html = `
      <h1>Bilan formateur</h1>
      <p>Bonjour ${formateur.prenom} ${formateur.nom},</p>
      <p>Merci d'avoir animé la formation <strong>${formation.titre}</strong>.</p>
      <p>Merci de compléter le bilan formateur ci-joint.</p>
      <p>Cordialement,</p>
      <p><strong>Aladé Conseil</strong></p>
    `;
    const attachments = [{ filename: 'bilan_formateur.pdf', path: bilanPath }];
    return this.sendEmailWithAttachments(to, subject, html, attachments, from);
  }

  /**
   * 10. Email évaluation satisfaction client (J+2)
   */
  async sendEvaluationClient(to, entreprise, formation, evaluationPath, from = 'contact@aladeconseils.com') {
    const subject = `Évaluation satisfaction - ${formation.titre}`;
    const html = `
      <h1>Évaluation satisfaction client</h1>
      <p>Bonjour,</p>
      <p>La formation <strong>${formation.titre}</strong> pour ${entreprise} est terminée.</p>
      <p>Votre avis nous intéresse ! Merci de prendre quelques minutes pour évaluer notre prestation.</p>
      <p>Cordialement,</p>
      <p><strong>Aladé Conseil</strong></p>
    `;
    const attachments = [{ filename: 'evaluation_client.pdf', path: evaluationPath }];
    return this.sendEmailWithAttachments(to, subject, html, attachments, from);
  }
}

module.exports = new EmailService();
