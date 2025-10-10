// Script de test pour envoyer un email avec Resend
import { Resend } from 'resend';
import dotenv from 'dotenv';

// Chargement des variables d'environnement
dotenv.config();

// Initialisation de Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  try {
    // Envoi d'un email de test
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'studiofromthesea@gmail.com',
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });
    
    console.log('Email envoyé avec succès!');
    console.log('ID de l\'email:', data.id);
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
}

// Exécution de la fonction d'envoi d'email
sendTestEmail()
  .then(() => console.log('Test terminé'))
  .catch(err => console.error('Test échoué:', err));
