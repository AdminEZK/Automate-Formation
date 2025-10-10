/**
 * Script pour exécuter le schéma SQL Qualiopi via l'API Supabase
 */

const fs = require('fs');
const https = require('https');

// Configuration
const PROJECT_REF = 'gasutiqukuekcnybwkrb';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdhc3V0aXF1a3Vla2NueWJ3a3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTcyOTQsImV4cCI6MjA3MjAzMzI5NH0.S_plDasjc7GhXIAM9jBMFXVJWYCL4WWDHFnHK7co148';

// Lire le fichier SQL
const sqlFilePath = './supabase-qualiopi-complete.sql';
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Diviser le SQL en blocs (pour éviter les timeouts)
const sqlStatements = sqlContent
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`📄 Fichier SQL chargé: ${sqlStatements.length} instructions`);
console.log(`🚀 Exécution du schéma Qualiopi sur Supabase...`);
console.log(`📍 Projet: ${PROJECT_REF}\n`);

// Fonction pour exécuter une requête SQL via l'API REST de Supabase
async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    
    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Exécuter le script SQL complet
async function main() {
  console.log('⚠️  IMPORTANT: Cette méthode nécessite que vous ayez les permissions appropriées.\n');
  console.log('📋 Recommandation: Utilisez plutôt l\'interface SQL Editor de Supabase:\n');
  console.log(`   👉 https://app.supabase.com/project/${PROJECT_REF}/sql/new\n`);
  console.log('   1. Ouvrez le lien ci-dessus');
  console.log('   2. Copiez le contenu de supabase-qualiopi-complete.sql');
  console.log('   3. Collez dans l\'éditeur SQL');
  console.log('   4. Cliquez sur "Run"\n');
  console.log('═'.repeat(80));
  console.log('\n✅ C\'est la méthode la plus simple et la plus fiable!\n');
}

main().catch(console.error);
