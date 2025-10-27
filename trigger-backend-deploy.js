const https = require('https');
require('dotenv').config();

const RENDER_API_KEY = process.env.RENDER_API_KEY;

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function triggerDeploy() {
  console.log('🚀 Déclenchement du déploiement backend...\n');

  try {
    const backendId = 'srv-d3kd06k9c44c73acekp0';
    
    const response = await makeRequest({
      hostname: 'api.render.com',
      path: `/v1/services/${backendId}/deploys`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }, { clearCache: 'clear' });

    if (response.status === 201) {
      console.log('✅ Déploiement déclenché avec succès !');
      console.log(`   Status: ${response.data.deploy?.status}`);
      console.log(`   ID: ${response.data.deploy?.id}`);
      console.log('\n🔄 Le backend va redémarrer dans ~2 minutes');
      console.log('   Suivez le déploiement: https://dashboard.render.com/web/srv-d3kd06k9c44c73acekp0');
    } else {
      console.error('❌ Erreur:', response.status);
      console.error(response.data);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

triggerDeploy();
