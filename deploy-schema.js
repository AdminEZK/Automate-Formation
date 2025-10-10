#!/usr/bin/env node

/**
 * Script pour déployer le schéma SQL Qualiopi sur Supabase
 * Utilise les credentials du fichier .env
 */

require('dotenv').config();
const fs = require('fs');
const https = require('https');

// Configuration depuis .env
const PROJECT_REF = process.env.PROJECT_REF || 'pxtziykmbisikvyqeycm';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;

console.log('🚀 Déploiement du schéma Qualiopi sur Supabase');
console.log('================================================\n');
console.log(`📍 Projet: ${PROJECT_REF}`);
console.log(`🔗 URL: ${SUPABASE_URL}\n`);

// Lire le fichier SQL
const sqlFile = './supabase-qualiopi-complete.sql';
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

// Fonction pour exécuter du SQL via l'API REST de Supabase
async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql });
    
    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      path: '/rest/v1/rpc/query',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Fonction principale
async function main() {
  console.log('📄 Lecture du fichier SQL...');
  
  // Diviser le SQL en instructions individuelles
  const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`✅ ${statements.length} instructions SQL trouvées\n`);
  
  console.log('⚠️  MÉTHODE RECOMMANDÉE:');
  console.log('   Pour éviter les problèmes d\'API, utilisez l\'interface Supabase:\n');
  console.log(`   1. Ouvrez: https://app.supabase.com/project/${PROJECT_REF}/sql/new`);
  console.log('   2. Copiez le contenu de supabase-qualiopi-complete.sql');
  console.log('   3. Collez dans l\'éditeur SQL');
  console.log('   4. Cliquez sur "Run"\n');
  
  console.log('═'.repeat(80));
  console.log('\n💡 Voulez-vous que je copie le SQL dans votre presse-papier? (y/n)');
  
  // Copier automatiquement dans le presse-papier
  const { execSync } = require('child_process');
  try {
    execSync(`cat "${sqlFile}" | pbcopy`);
    console.log('\n✅ SQL copié dans le presse-papier!');
    console.log(`👉 Ouvrez: https://app.supabase.com/project/${PROJECT_REF}/sql/new`);
    console.log('👉 Collez (Cmd+V) et cliquez sur "Run"\n');
  } catch (err) {
    console.error('❌ Erreur lors de la copie:', err.message);
  }
}

main().catch(err => {
  console.error('❌ Erreur:', err.message);
  process.exit(1);
});
