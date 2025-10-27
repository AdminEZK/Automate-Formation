#!/usr/bin/env node
// Script de validation du fichier .env
require('dotenv').config();

console.log('🔍 Validation de la configuration .env\n');
console.log('='.repeat(60));

const requiredVars = [
  { name: 'SUPABASE_URL', description: 'URL Supabase' },
  { name: 'SUPABASE_ANON_KEY', description: 'Clé anonyme Supabase' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', description: 'Clé service role Supabase' },
  { name: 'RESEND_API_KEY', description: 'Clé API Resend' }
];

const optionalVars = [
  { name: 'PORT', description: 'Port du serveur', default: '3001' },
  { name: 'NODE_ENV', description: 'Environnement', default: 'development' },
  { name: 'EMAIL_FROM', description: 'Email expéditeur', default: 'onboarding@resend.dev' },
  { name: 'EMAIL_FROM_NAME', description: 'Nom expéditeur', default: 'Aladé Conseil' },
  { name: 'FRONTEND_URL', description: 'URL frontend (CORS)', default: 'http://localhost:3000' },
  { name: 'ORGANISME_ID', description: 'ID organisme', default: 'N/A' }
];

let hasErrors = false;
let hasWarnings = false;

// Vérification des variables requises
console.log('\n📋 Variables REQUISES:\n');
requiredVars.forEach(({ name, description }) => {
  const value = process.env[name];
  if (!value || value === '' || value.includes('votre_') || value.includes('xxx')) {
    console.log(`❌ ${name.padEnd(30)} - ${description}`);
    console.log(`   ⚠️  MANQUANTE ou valeur par défaut détectée`);
    hasErrors = true;
  } else {
    const maskedValue = value.substring(0, 10) + '...' + value.substring(value.length - 4);
    console.log(`✅ ${name.padEnd(30)} - ${description}`);
    console.log(`   ${maskedValue}`);
  }
});

// Vérification des variables optionnelles
console.log('\n📋 Variables OPTIONNELLES:\n');
optionalVars.forEach(({ name, description, default: defaultValue }) => {
  const value = process.env[name];
  if (!value || value === '') {
    console.log(`⚠️  ${name.padEnd(30)} - ${description}`);
    console.log(`   Valeur par défaut: ${defaultValue}`);
    hasWarnings = true;
  } else if (value.includes('votre_') || value.includes('xxx')) {
    console.log(`⚠️  ${name.padEnd(30)} - ${description}`);
    console.log(`   ⚠️  Valeur par défaut détectée: ${value}`);
    hasWarnings = true;
  } else {
    console.log(`✅ ${name.padEnd(30)} - ${description}`);
    console.log(`   ${value}`);
  }
});

// Validation spécifique
console.log('\n🔍 Validations spécifiques:\n');

// Vérifier format RESEND_API_KEY
if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('re_')) {
  console.log('❌ RESEND_API_KEY doit commencer par "re_"');
  hasErrors = true;
} else if (process.env.RESEND_API_KEY) {
  console.log('✅ Format RESEND_API_KEY valide');
}

// Vérifier format SUPABASE_URL
if (process.env.SUPABASE_URL && !process.env.SUPABASE_URL.startsWith('http')) {
  console.log('❌ SUPABASE_URL doit commencer par "http://" ou "https://"');
  hasErrors = true;
} else if (process.env.SUPABASE_URL) {
  console.log('✅ Format SUPABASE_URL valide');
}

// Vérifier format EMAIL_FROM
if (process.env.EMAIL_FROM && !process.env.EMAIL_FROM.includes('@')) {
  console.log('❌ EMAIL_FROM doit être une adresse email valide');
  hasErrors = true;
} else if (process.env.EMAIL_FROM) {
  console.log('✅ Format EMAIL_FROM valide');
}

// Résumé
console.log('\n' + '='.repeat(60));
console.log('\n📊 RÉSUMÉ:\n');

if (hasErrors) {
  console.log('❌ Configuration INVALIDE - Des variables requises sont manquantes');
  console.log('\n💡 Actions à faire:');
  console.log('   1. Copier .env.production.example vers .env');
  console.log('   2. Remplacer les valeurs par défaut par vos vraies clés');
  console.log('   3. Relancer ce script pour valider\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Configuration PARTIELLE - Variables requises OK, mais certaines optionnelles manquent');
  console.log('   Le système fonctionnera avec des valeurs par défaut\n');
  process.exit(0);
} else {
  console.log('✅ Configuration COMPLÈTE - Tous les paramètres sont configurés!\n');
  console.log('🚀 Vous pouvez maintenant:');
  console.log('   1. Tester l\'envoi d\'email: node examples/testResend.js');
  console.log('   2. Démarrer le serveur: npm start');
  console.log('   3. Démarrer le dashboard: cd dashboard-client && npm run dev\n');
  process.exit(0);
}
