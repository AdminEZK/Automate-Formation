#!/usr/bin/env node
// Script pour envoyer les emails de confirmation pour une session existante
require('dotenv').config();
const emailService = require('./services/emailService');

const SESSION_ID = '29d517b7-01ea-400f-bc16-13a616ce3642';

async function sendEmailsForSession() {
  console.log('📧 Envoi des emails pour la session:', SESSION_ID);
  
  const sessionData = {
    entreprise: {
      nom: 'Visage conseil',
      email_contact: 'hello@eazylink.fr'
    },
    formation: {
      titre: 'Formation Stratégie d\'entreprise',
      duree: 'À définir',
      dates: '25 au 30 octobre 2025',
      modalite: 'presentiel',
      nombre_participants: 1
    },
    participants: [
      {
        prenom: 'PATRICK',
        nom: 'FIORRI',
        email: 'fanfanville@hotmail.com'
      }
    ]
  };

  try {
    // Email au client
    const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    await emailService.sendConfirmationDemande(
      sessionData.entreprise.email_contact,
      sessionData.entreprise.nom,
      sessionData.formation,
      emailFrom
    );
    console.log('✅ Email de confirmation envoyé au client:', sessionData.entreprise.email_contact);

    // Email à l'organisme
    const emailOrganisme = process.env.EMAIL_ORGANISME || process.env.EMAIL_FROM || 'onboarding@resend.dev';
    await emailService.sendEmail(
      emailOrganisme,
      `🆕 Nouvelle demande de formation - ${sessionData.entreprise.nom}`,
      `
        <h1>Nouvelle demande de formation reçue</h1>
        <h2>Entreprise</h2>
        <ul>
          <li><strong>Nom :</strong> ${sessionData.entreprise.nom}</li>
          <li><strong>Email :</strong> ${sessionData.entreprise.email_contact}</li>
        </ul>
        <h2>Formation demandée</h2>
        <ul>
          <li><strong>Formation :</strong> ${sessionData.formation.titre}</li>
          <li><strong>Dates souhaitées :</strong> ${sessionData.formation.dates}</li>
          <li><strong>Modalité :</strong> ${sessionData.formation.modalite}</li>
          <li><strong>Nombre de participants :</strong> ${sessionData.formation.nombre_participants}</li>
        </ul>
        <h2>Participants</h2>
        <ul>
          ${sessionData.participants.map(p => `<li>${p.prenom} ${p.nom} - ${p.email}</li>`).join('')}
        </ul>
        <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/sessions/${SESSION_ID}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Voir la demande dans le dashboard</a></p>
      `,
      emailFrom
    );
    console.log('✅ Email de notification envoyé à l\'organisme:', emailOrganisme);
    
    console.log('\n🎉 Emails envoyés avec succès !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

sendEmailsForSession();
