require('dotenv').config();
const axios = require('axios');

async function checkService(serviceId, serviceName) {
  const apiKey = process.env.RENDER_API_KEY;
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📋 ANALYSE DE: ${serviceName}`);
  console.log(`${'='.repeat(80)}\n`);

  try {
    // Récupérer les détails du service
    const serviceResponse = await axios.get(`https://api.render.com/v1/services/${serviceId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    const service = serviceResponse.data;
    
    console.log('🔧 CONFIGURATION GÉNÉRALE:');
    console.log(`   Nom: ${service.name}`);
    console.log(`   Type: ${service.type}`);
    console.log(`   État: ${service.suspended === 'not_suspended' ? '✅ Actif' : '❌ Suspendu'}`);
    console.log(`   Région: ${service.serviceDetails?.region || 'N/A'}`);
    console.log(`   URL: ${service.serviceDetails?.url || 'N/A'}`);
    
    if (service.type === 'web_service') {
      console.log(`\n🌐 CONFIGURATION WEB SERVICE:`);
      console.log(`   Build Command: ${service.serviceDetails?.buildCommand || 'N/A'}`);
      console.log(`   Start Command: ${service.serviceDetails?.startCommand || 'N/A'}`);
      console.log(`   Port: ${service.serviceDetails?.port || 'N/A'}`);
      console.log(`   Health Check Path: ${service.serviceDetails?.healthCheckPath || 'N/A'}`);
    } else if (service.type === 'static_site') {
      console.log(`\n📦 CONFIGURATION STATIC SITE:`);
      console.log(`   Build Command: ${service.serviceDetails?.buildCommand || 'N/A'}`);
      console.log(`   Publish Path: ${service.serviceDetails?.publishPath || 'N/A'}`);
    }

    console.log(`\n📂 REPOSITORY:`);
    console.log(`   Repo: ${service.repo || 'N/A'}`);
    console.log(`   Branch: ${service.branch || 'N/A'}`);
    console.log(`   Root Directory: ${service.rootDir || '/' }`);

    // Récupérer les variables d'environnement
    console.log(`\n🔐 VARIABLES D'ENVIRONNEMENT:`);
    try {
      const envResponse = await axios.get(`https://api.render.com/v1/services/${serviceId}/env-vars`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      });

      const envVars = envResponse.data;
      if (envVars && envVars.length > 0) {
        envVars.forEach(envVar => {
          const value = envVar.envVar.value ? '***' : '(vide)';
          console.log(`   ${envVar.envVar.key}: ${value}`);
        });
      } else {
        console.log('   ⚠️  Aucune variable d\'environnement configurée');
      }
    } catch (error) {
      console.log('   ❌ Erreur lors de la récupération des variables d\'environnement');
    }

    // Récupérer les derniers déploiements
    console.log(`\n📊 DERNIERS DÉPLOIEMENTS:`);
    try {
      const deploysResponse = await axios.get(`https://api.render.com/v1/services/${serviceId}/deploys?limit=3`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      });

      const deploys = deploysResponse.data;
      if (deploys && deploys.length > 0) {
        deploys.forEach((deploy, index) => {
          const status = deploy.deploy.status;
          const statusIcon = status === 'live' ? '✅' : status === 'build_failed' ? '❌' : status === 'canceled' ? '⚠️' : '🔄';
          console.log(`   ${index + 1}. ${statusIcon} ${status} - ${deploy.deploy.createdAt}`);
          if (deploy.deploy.finishedAt) {
            console.log(`      Terminé: ${deploy.deploy.finishedAt}`);
          }
        });
      } else {
        console.log('   ℹ️  Aucun déploiement trouvé');
      }
    } catch (error) {
      console.log('   ❌ Erreur lors de la récupération des déploiements');
    }

    // Récupérer les logs récents
    console.log(`\n📝 LOGS RÉCENTS:`);
    try {
      const logsResponse = await axios.get(`https://api.render.com/v1/services/${serviceId}/logs?limit=20`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      });

      const logs = logsResponse.data;
      if (logs && logs.length > 0) {
        logs.slice(0, 10).forEach(log => {
          console.log(`   ${log.timestamp}: ${log.message}`);
        });
      } else {
        console.log('   ℹ️  Aucun log disponible');
      }
    } catch (error) {
      console.log('   ⚠️  Logs non disponibles via API');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des détails du service:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

async function main() {
  console.log('🔍 DIAGNOSTIC DES SERVICES RENDER\n');
  
  await checkService('srv-d3kd50t6ubrc73dshqvg', 'Automate-Formation-Frontend');
  await checkService('srv-d3kd06k9c44c73acekp0', 'Automate-Formation Backend');
  
  console.log(`\n${'='.repeat(80)}`);
  console.log('✅ DIAGNOSTIC TERMINÉ');
  console.log(`${'='.repeat(80)}\n`);
}

main();
