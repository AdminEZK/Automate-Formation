require('dotenv').config();
const axios = require('axios');

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const API_BASE = 'https://api.render.com/v1';

const FRONTEND_ID = 'srv-d3kd50t6ubrc73dshqvg';
const BACKEND_ID = 'srv-d3kd06k9c44c73acekp0';

async function getDeployLogs(serviceId, deployId, serviceName) {
  try {
    console.log(`\n📋 Logs de ${serviceName} (Deploy: ${deployId}):`);
    console.log('='.repeat(80));
    
    const response = await axios.get(
      `${API_BASE}/services/${serviceId}/deploys/${deployId}/logs`,
      {
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Accept': 'application/json'
        }
      }
    );

    const logs = response.data;
    if (logs && logs.length > 0) {
      logs.forEach(log => {
        console.log(log.message);
      });
    } else {
      console.log('Aucun log disponible');
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération des logs:`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

async function getLatestDeploys(serviceId, serviceName) {
  try {
    console.log(`\n📊 Derniers déploiements de ${serviceName}:`);
    console.log('='.repeat(80));
    
    const response = await axios.get(
      `${API_BASE}/services/${serviceId}/deploys?limit=3`,
      {
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Accept': 'application/json'
        }
      }
    );

    const deploys = response.data;
    if (deploys && deploys.length > 0) {
      for (const deploy of deploys) {
        const status = deploy.deploy.status;
        const statusIcon = status === 'live' ? '✅' : 
                          status === 'build_failed' ? '❌' : 
                          status === 'update_failed' ? '❌' :
                          status === 'canceled' ? '⚠️' : '🔄';
        
        console.log(`\n${statusIcon} Deploy ID: ${deploy.deploy.id}`);
        console.log(`   Status: ${status}`);
        console.log(`   Créé: ${deploy.deploy.createdAt}`);
        if (deploy.deploy.finishedAt) {
          console.log(`   Terminé: ${deploy.deploy.finishedAt}`);
        }
        
        // Si le déploiement a échoué, récupérer les logs
        if (status === 'build_failed' || status === 'update_failed') {
          await getDeployLogs(serviceId, deploy.deploy.id, serviceName);
        }
      }
    }
    
    return deploys;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération des déploiements:`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

async function getServiceDetails(serviceId, serviceName) {
  try {
    console.log(`\n🔍 Configuration actuelle de ${serviceName}:`);
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
    
    console.log(`Type: ${service.type}`);
    console.log(`Root Directory: ${service.rootDir || '/'}`);
    console.log(`Branch: ${service.branch}`);
    
    if (service.type === 'web_service') {
      console.log(`Build Command: ${service.serviceDetails?.buildCommand || 'N/A'}`);
      console.log(`Start Command: ${service.serviceDetails?.startCommand || 'N/A'}`);
    } else if (service.type === 'static_site') {
      console.log(`Build Command: ${service.serviceDetails?.buildCommand || 'N/A'}`);
      console.log(`Publish Path: ${service.serviceDetails?.publishPath || 'N/A'}`);
    }
    
    return service;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération des détails:`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

async function main() {
  console.log('🔍 ANALYSE DES ÉCHECS DE DÉPLOIEMENT\n');

  if (!RENDER_API_KEY) {
    console.error('❌ RENDER_API_KEY non trouvée dans .env');
    process.exit(1);
  }

  // Backend
  console.log('\n' + '█'.repeat(80));
  console.log('BACKEND - Automate-Formation Backend');
  console.log('█'.repeat(80));
  await getServiceDetails(BACKEND_ID, 'Backend');
  await getLatestDeploys(BACKEND_ID, 'Backend');

  // Frontend
  console.log('\n\n' + '█'.repeat(80));
  console.log('FRONTEND - Automate-Formation-Frontend');
  console.log('█'.repeat(80));
  await getServiceDetails(FRONTEND_ID, 'Frontend');
  await getLatestDeploys(FRONTEND_ID, 'Frontend');

  console.log('\n' + '='.repeat(80));
  console.log('✅ ANALYSE TERMINÉE');
  console.log('='.repeat(80) + '\n');
}

main();
