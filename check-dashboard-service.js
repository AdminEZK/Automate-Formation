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

async function checkDashboard() {
  console.log('🔍 Vérification du service dashboard...\n');

  try {
    // Récupérer les détails du service
    const serviceId = 'srv-d3mbnhd6ubrc73ellrh0';
    
    const service = await makeRequest({
      hostname: 'api.render.com',
      path: `/v1/services/${serviceId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Détails du service:');
    console.log(JSON.stringify(service, null, 2));

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkDashboard();
