const https = require('https');
require('dotenv').config();

const RENDER_API_KEY = process.env.RENDER_API_KEY;

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function checkDashboardEnv() {
  console.log('🔍 Vérification de la configuration du dashboard...\n');

  try {
    // ID de votre nouveau service dashboard
    const serviceId = 'srv-d3mbs27diees73f9f9fg';
    
    const service = await makeRequest({
      hostname: 'api.render.com',
      path: `/v1/services/${serviceId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Configuration du service:');
    console.log('═══════════════════════════════════════');
    console.log(`Nom: ${service.name}`);
    console.log(`URL: ${service.serviceDetails?.url}`);
    console.log(`Root Directory: ${service.rootDir}`);
    console.log(`Build Command: ${service.serviceDetails?.buildCommand}`);
    console.log(`Publish Path: ${service.serviceDetails?.publishPath}`);
    console.log('');

    // Récupérer les variables d'environnement
    const envVars = await makeRequest({
      hostname: 'api.render.com',
      path: `/v1/services/${serviceId}/env-vars`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('🔐 Variables d\'environnement:');
    console.log('═══════════════════════════════════════');
    if (envVars && envVars.length > 0) {
      envVars.forEach(env => {
        console.log(`${env.envVar.key} = ${env.envVar.value || '(valeur masquée)'}`);
      });
    } else {
      console.log('⚠️ Aucune variable d\'environnement configurée !');
      console.log('\n❌ PROBLÈME : Il faut ajouter VITE_API_URL');
      console.log('   Valeur attendue: https://automate-formation.onrender.com/api');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkDashboardEnv();
