require('dotenv').config();
const axios = require('axios');

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const API_BASE = 'https://api.render.com/v1';
const FRONTEND_ID = 'srv-d3kd50t6ubrc73dshqvg';
const BACKEND_ID = 'srv-d3kd06k9c44c73acekp0';

async function getServiceConfig(serviceId, serviceName) {
  try {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📋 ${serviceName.toUpperCase()}`);
    console.log('='.repeat(80));
    
    const response = await axios.get(
      `${API_BASE}/services/${serviceId}`,
      {
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Accept': 'application/json'
        }
      }
    );

    const service = response.data;
    
    console.log(`\n🔧 Configuration:`);
    console.log(`   Type: ${service.type}`);
    console.log(`   Root Directory: ${service.rootDir || '/'}`);
    console.log(`   Branch: ${service.branch}`);
    console.log(`   Repo: ${service.repo}`);
    
    if (service.serviceDetails) {
      console.log(`\n📦 Service Details:`);
      if (service.type === 'static_site') {
        console.log(`   Build Command: ${service.serviceDetails.buildCommand || 'N/A'}`);
        console.log(`   Publish Path: ${service.serviceDetails.publishPath || 'N/A'}`);
      } else if (service.type === 'web_service') {
        console.log(`   Build Command: ${service.serviceDetails.envSpecificDetails?.buildCommand || 'N/A'}`);
        console.log(`   Start Command: ${service.serviceDetails.envSpecificDetails?.startCommand || 'N/A'}`);
        console.log(`   Health Check: ${service.serviceDetails.healthCheckPath || 'N/A'}`);
      }
    }

    // Variables d'environnement
    const envResponse = await axios.get(
      `${API_BASE}/services/${serviceId}/env-vars`,
      {
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Accept': 'application/json'
        }
      }
    );

    console.log(`\n🔐 Variables d'environnement (${envResponse.data.length}):`);
    envResponse.data.forEach(envVar => {
      console.log(`   ${envVar.envVar.key}: ${envVar.envVar.value ? '✓ définie' : '✗ vide'}`);
    });

    // Derniers déploiements
    const deploysResponse = await axios.get(
      `${API_BASE}/services/${serviceId}/deploys?limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Accept': 'application/json'
        }
      }
    );

    console.log(`\n📊 Derniers déploiements:`);
    deploysResponse.data.forEach((deploy, index) => {
      const status = deploy.deploy.status;
      const icon = status === 'live' ? '✅' : 
                   status.includes('failed') ? '❌' : 
                   status.includes('progress') ? '🔄' : '⚠️';
      const date = new Date(deploy.deploy.createdAt).toLocaleString('fr-FR');
      console.log(`   ${index + 1}. ${icon} ${status} - ${date}`);
      if (deploy.deploy.commit?.message) {
        console.log(`      Commit: ${deploy.deploy.commit.message.substring(0, 60)}`);
      }
    });

  } catch (error) {
    console.error(`❌ Erreur pour ${serviceName}:`, error.response?.data || error.message);
  }
}

async function main() {
  console.log('🔍 DIAGNOSTIC COMPLET DES SERVICES RENDER\n');

  if (!RENDER_API_KEY) {
    console.error('❌ RENDER_API_KEY non trouvée dans .env');
    process.exit(1);
  }

  await getServiceConfig(BACKEND_ID, 'Backend');
  await getServiceConfig(FRONTEND_ID, 'Frontend');

  console.log('\n' + '='.repeat(80));
  console.log('💡 RECOMMANDATIONS');
  console.log('='.repeat(80));
  console.log('\nSi les déploiements échouent:');
  console.log('1. Vérifiez les logs sur le dashboard Render');
  console.log('2. Backend: https://dashboard.render.com/web/srv-d3kd06k9c44c73acekp0');
  console.log('3. Frontend: https://dashboard.render.com/static/srv-d3kd50t6ubrc73dshqvg');
  console.log('4. Consultez l\'onglet "Events" pour voir les erreurs détaillées');
  console.log('\nLe build fonctionne localement, donc le problème peut être:');
  console.log('- Variables d\'environnement manquantes sur Render');
  console.log('- Problème de cache (essayez "Clear build cache & deploy")');
  console.log('- Problème de dépendances (versions Node.js différentes)');
  console.log('');
}

main();
