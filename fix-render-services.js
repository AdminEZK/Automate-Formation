require('dotenv').config();
const axios = require('axios');

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const API_BASE = 'https://api.render.com/v1';

const FRONTEND_ID = 'srv-d3kd50t6ubrc73dshqvg';
const BACKEND_ID = 'srv-d3kd06k9c44c73acekp0';

async function updateService(serviceId, updates, serviceName) {
  try {
    console.log(`\n🔧 Mise à jour de ${serviceName}...`);
    
    const response = await axios.patch(
      `${API_BASE}/services/${serviceId}`,
      updates,
      {
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log(`✅ ${serviceName} mis à jour avec succès!`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour de ${serviceName}:`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }
    throw error;
  }
}

async function deployService(serviceId, serviceName) {
  try {
    console.log(`\n🚀 Déploiement de ${serviceName}...`);
    
    const response = await axios.post(
      `${API_BASE}/services/${serviceId}/deploys`,
      {
        clearCache: 'clear'
      },
      {
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log(`✅ Déploiement de ${serviceName} lancé!`);
    console.log(`   Deploy ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur lors du déploiement de ${serviceName}:`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }
    throw error;
  }
}

async function main() {
  console.log('🔧 CORRECTION DES SERVICES RENDER\n');
  console.log('=' .repeat(80));

  if (!RENDER_API_KEY) {
    console.error('❌ RENDER_API_KEY non trouvée dans .env');
    process.exit(1);
  }

  try {
    // 1. Corriger le Backend
    console.log('\n📦 ÉTAPE 1: Correction du Backend');
    console.log('-'.repeat(80));
    
    const backendUpdates = {
      serviceDetails: {
        buildCommand: 'npm install',
        startCommand: 'node index.js',
        healthCheckPath: '/api/formations'
      }
    };

    await updateService(BACKEND_ID, backendUpdates, 'Backend');
    
    // 2. Corriger le Frontend
    console.log('\n📦 ÉTAPE 2: Correction du Frontend');
    console.log('-'.repeat(80));
    
    const frontendUpdates = {
      rootDir: 'client',
      serviceDetails: {
        buildCommand: 'npm install && npm run build',
        publishPath: 'build'
      }
    };

    await updateService(FRONTEND_ID, frontendUpdates, 'Frontend');

    // 3. Déployer le Backend
    console.log('\n📦 ÉTAPE 3: Déploiement du Backend');
    console.log('-'.repeat(80));
    await deployService(BACKEND_ID, 'Backend');

    // 4. Déployer le Frontend
    console.log('\n📦 ÉTAPE 4: Déploiement du Frontend');
    console.log('-'.repeat(80));
    await deployService(FRONTEND_ID, 'Frontend');

    console.log('\n' + '='.repeat(80));
    console.log('✅ CORRECTIONS APPLIQUÉES AVEC SUCCÈS!');
    console.log('='.repeat(80));
    console.log('\n📊 Prochaines étapes:');
    console.log('   1. Attendez 3-5 minutes que les déploiements se terminent');
    console.log('   2. Vérifiez le backend: https://automate-formation.onrender.com/api/formations');
    console.log('   3. Vérifiez le frontend: https://automate-formation-1.onrender.com');
    console.log('   4. Consultez les logs sur le dashboard Render si nécessaire\n');

  } catch (error) {
    console.error('\n❌ Échec de la correction des services');
    process.exit(1);
  }
}

main();
