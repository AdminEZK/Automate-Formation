/**
 * Script pour créer le service Dashboard Admin sur Render
 */

const https = require('https');
require('dotenv').config();

const RENDER_API_KEY = process.env.RENDER_API_KEY;

if (!RENDER_API_KEY) {
  console.error('❌ RENDER_API_KEY manquant dans .env');
  process.exit(1);
}

// Fonction pour faire une requête HTTPS
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function createDashboardService() {
  console.log('🚀 Création du service Dashboard Admin sur Render...\n');

  try {
    // 1. Récupérer l'owner ID
    console.log('1️⃣ Récupération de l\'owner ID...');
    const ownersResponse = await makeRequest({
      hostname: 'api.render.com',
      path: '/v1/owners',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (ownersResponse.status !== 200) {
      throw new Error(`Erreur lors de la récupération des owners: ${JSON.stringify(ownersResponse.data)}`);
    }

    const ownerId = ownersResponse.data[0]?.owner?.id;
    if (!ownerId) {
      throw new Error('Owner ID non trouvé');
    }
    console.log(`✅ Owner ID: ${ownerId}\n`);

    // 2. Créer le service Static Site
    console.log('2️⃣ Création du service Static Site...');
    const serviceData = {
      type: 'static_site',
      name: 'automate-formation-dashboard',
      ownerId: ownerId,
      repo: 'https://github.com/AdminEZK/Automate-Formation',
      branch: 'main',
      rootDir: 'dashboard-client',
      buildCommand: 'npm install && npm run build',
      publishPath: 'dist',
      envVars: [
        {
          key: 'VITE_API_URL',
          value: 'https://automate-formation.onrender.com/api'
        }
      ],
      autoDeploy: 'yes'
    };

    const createResponse = await makeRequest({
      hostname: 'api.render.com',
      path: '/v1/services',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }, serviceData);

    if (createResponse.status === 201) {
      console.log('✅ Service créé avec succès !\n');
      console.log('📊 Détails du service:');
      console.log(`   Nom: ${createResponse.data.name}`);
      console.log(`   ID: ${createResponse.data.id}`);
      console.log(`   URL: https://${createResponse.data.name}.onrender.com`);
      console.log(`   Statut: ${createResponse.data.suspended}`);
      console.log('\n🔄 Le déploiement va commencer automatiquement...');
      console.log('   Suivez le déploiement sur: https://dashboard.render.com\n');
    } else {
      console.error('❌ Erreur lors de la création du service:');
      console.error(JSON.stringify(createResponse.data, null, 2));
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

createDashboardService();
