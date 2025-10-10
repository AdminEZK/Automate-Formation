/**
 * Script de démarrage robuste pour Render
 */

// Vérifier les variables d'environnement critiques
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'PORT'
];

console.log('🔍 Vérification des variables d\'environnement...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables d\'environnement manquantes:', missingVars.join(', '));
  process.exit(1);
}

console.log('✅ Toutes les variables critiques sont présentes');
console.log(`   PORT: ${process.env.PORT}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL ? '✓' : '✗'}`);

// Démarrer l'application
console.log('\n🚀 Démarrage de l\'application...\n');

try {
  require('./index.js');
} catch (error) {
  console.error('❌ Erreur fatale au démarrage:', error);
  console.error(error.stack);
  process.exit(1);
}
