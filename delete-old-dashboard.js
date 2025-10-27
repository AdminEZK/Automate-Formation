const https = require('https');
require('dotenv').config();

const RENDER_API_KEY = process.env.RENDER_API_KEY;

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: body });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function deleteOldDashboard() {
  console.log('🗑️ Suppression de l\'ancien service dashboard...\n');

  try {
    const oldServiceId = 'srv-d3mbnhd6ubrc73ellrh0';
    
    const response = await makeRequest({
      hostname: 'api.render.com',
      path: `/v1/services/${oldServiceId}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 204 || response.status === 200) {
      console.log('✅ Ancien service supprimé avec succès !');
    } else {
      console.log('⚠️ Réponse:', response.status);
      console.log(response.data);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

deleteOldDashboard();
