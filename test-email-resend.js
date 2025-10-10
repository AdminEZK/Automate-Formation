/**
 * Test du service d'emails Resend
 */

require('dotenv').config();
const emailService = require('./services/emailService');

async function testEmail() {
  console.log('🚀 Test du service d\'emails Resend');
  console.log('=' .repeat(60));
  
  // Test 1: Email simple de confirmation
  console.log('\n📧 Test 1: Email de confirmation de demande...');
  const result1 = await emailService.sendConfirmationDemande(
    'studiofromthesea@gmail.com', // Votre email Resend
    'TechCorp Solutions',
    {
      titre: 'Gestion de Projet Agile - Scrum Master',
      duree: 21,
      dates: 'Du 02/12/2025 au 06/12/2025'
    }
  );
  
  if (result1.success) {
    console.log('✅ Email envoyé avec succès!');
    console.log('   ID:', result1.data.id);
  } else {
    console.log('❌ Erreur:', result1.error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Test terminé!');
}

testEmail().catch(console.error);
