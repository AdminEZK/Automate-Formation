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

async function fixDashboard() {
  console.log('🔧 Correction de la configuration du dashboard...\n');

  try {
    const serviceId = 'srv-d3mbnhd6ubrc73ellrh0';
    
    // Mettre à jour la configuration
    const updateData = {
      buildCommand: 'npm install && npm run build',
      publishPath: 'dist'
    };

    const response = await makeRequest({
      hostname: 'api.render.com',
      path: `/v1/services/${serviceId}`,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }, updateData);

    if (response.status === 200) {
      console.log('✅ Configuration mise à jour avec succès !');
      console.log('\n📊 Nouvelle configuration:');
      console.log(`   Build Command: ${response.data.serviceDetails?.buildCommand || 'npm install && npm run build'}`);
      console.log(`   Publish Path: ${response.data.serviceDetails?.publishPath || 'dist'}`);
      console.log(`   URL: ${response.data.serviceDetails?.url}`);
      
      // Déclencher un nouveau déploiement
      console.log('\n🔄 Déclenchement d\'un nouveau déploiement...');
      const deployResponse = await makeRequest({
        hostname: 'api.render.com',
        path: `/v1/services/${serviceId}/deploys`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }, { clearCache: 'clear' });

      if (deployResponse.status === 201) {
        console.log('✅ Déploiement lancé !');
        console.log(`   Suivez le déploiement: https://dashboard.render.com/static/${serviceId}`);
      }
    } else {
      console.error('❌ Erreur lors de la mise à jour:');
      console.error(JSON.stringify(response.data, null, 2));
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

fixDashboard();
