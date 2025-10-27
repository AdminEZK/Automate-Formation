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

async function checkBackendDeploy() {
  console.log('🔍 Vérification du déploiement backend...\n');

  try {
    const backendId = 'srv-d3kd06k9c44c73acekp0';
    
    const deploys = await makeRequest({
      hostname: 'api.render.com',
      path: `/v1/services/${backendId}/deploys`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (deploys && deploys.length > 0) {
      const latest = deploys[0].deploy;
      console.log('📊 Dernier déploiement:');
      console.log('═══════════════════════════════════════');
      console.log(`Status: ${latest.status}`);
      console.log(`Créé: ${new Date(latest.createdAt).toLocaleString('fr-FR')}`);
      if (latest.finishedAt) {
        console.log(`Terminé: ${new Date(latest.finishedAt).toLocaleString('fr-FR')}`);
      }
      console.log(`Commit: ${latest.commit?.message || 'N/A'}`);
      
      if (latest.status === 'live') {
        console.log('\n✅ Backend déployé et actif !');
      } else if (latest.status === 'build_in_progress') {
        console.log('\n🔄 Déploiement en cours...');
      } else {
        console.log(`\n⚠️ Status: ${latest.status}`);
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkBackendDeploy();
