// Script de test pour envoyer un email avec Resend
const { Resend } = require('resend');
require('dotenv').config();

// Initialisation de Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  try {
    console.log('🔍 Vérification de la configuration...');
    console.log('✅ RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Configurée' : '❌ MANQUANTE');
    console.log('✅ EMAIL_FROM:', process.env.EMAIL_FROM || 'onboarding@resend.dev (par défaut)');
    console.log('');
    
    // Envoi d'un email de test
    const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const data = await resend.emails.send({
      from: emailFrom,
      to: 'studiofromthesea@gmail.com',
      subject: 'Test Automate Formation - Resend',
      html: '<h1>Test réussi !</h1><p>Votre configuration Resend fonctionne correctement pour <strong>Automate Formation</strong>.</p>'
    });
    
    console.log('✅ Email envoyé avec succès!');
    console.log('📧 ID de l\'email:', data.id);
    console.log('📬 De:', emailFrom);
    console.log('📬 À: studiofromthesea@gmail.com');
    return data;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error.message);
    if (error.message.includes('API key')) {
      console.error('💡 Vérifiez que RESEND_API_KEY est bien configurée dans .env');
    }
    throw error;
  }
}

// Exécution de la fonction d'envoi d'email
sendTestEmail()
  .then(() => console.log('\n🎉 Test terminé avec succès'))
  .catch(err => console.error('\n❌ Test échoué:', err.message));
