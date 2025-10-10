/**
 * Script pour afficher les variables d'environnement à copier dans Render
 * Usage: node show-env-for-render.js
 */

require('dotenv').config();

console.log('\n🔐 VARIABLES D\'ENVIRONNEMENT POUR RENDER\n');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('📦 BACKEND (Web Service Node.js)\n');
console.log('Copiez ces variables dans Render → Backend Service → Environment:\n');

const backendVars = {
  'NODE_ENV': 'production',
  'PORT': '3001',
  'SUPABASE_URL': process.env.SUPABASE_URL || '❌ NON DÉFINI',
  'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY || '❌ NON DÉFINI',
  'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY || '❌ NON DÉFINI',
  'RESEND_API_KEY': process.env.RESEND_API_KEY || '❌ NON DÉFINI',
  'FRONTEND_URL': 'https://automate-formation-frontend.onrender.com'
};

Object.entries(backendVars).forEach(([key, value]) => {
  // Masquer partiellement les clés sensibles
  let displayValue = value;
  if (key.includes('KEY') && value.length > 20) {
    displayValue = value.substring(0, 20) + '...' + value.substring(value.length - 10);
  }
  console.log(`${key}=${displayValue}`);
});

console.log('\n───────────────────────────────────────────────────────────\n');
console.log('🎨 FRONTEND (Static Site React)\n');
console.log('Copiez ces variables dans Render → Frontend Static Site → Environment:\n');

const frontendVars = {
  'REACT_APP_API_URL': 'https://automate-formation-backend.onrender.com',
  'REACT_APP_SUPABASE_URL': process.env.SUPABASE_URL || '❌ NON DÉFINI',
  'REACT_APP_SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY || '❌ NON DÉFINI'
};

Object.entries(frontendVars).forEach(([key, value]) => {
  let displayValue = value;
  if (key.includes('KEY') && value.length > 20) {
    displayValue = value.substring(0, 20) + '...' + value.substring(value.length - 10);
  }
  console.log(`${key}=${displayValue}`);
});

console.log('\n═══════════════════════════════════════════════════════════\n');

// Vérification
const missingVars = [];
if (!process.env.SUPABASE_URL) missingVars.push('SUPABASE_URL');
if (!process.env.SUPABASE_ANON_KEY) missingVars.push('SUPABASE_ANON_KEY');
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
if (!process.env.RESEND_API_KEY) missingVars.push('RESEND_API_KEY');

if (missingVars.length > 0) {
  console.log('⚠️  ATTENTION: Variables manquantes dans votre .env local:\n');
  missingVars.forEach(v => console.log(`   - ${v}`));
  console.log('\nVeuillez les ajouter dans votre fichier .env avant de déployer.\n');
} else {
  console.log('✅ Toutes les variables nécessaires sont définies!\n');
  console.log('💡 PROCHAINES ÉTAPES:\n');
  console.log('1. Copiez les variables ci-dessus dans Render');
  console.log('2. Remplacez les URLs par les vraies URLs une fois déployées');
  console.log('3. Déployez le backend en premier');
  console.log('4. Puis déployez le frontend\n');
}

console.log('📖 Guide complet: DEPLOYMENT-RENDER.md\n');
