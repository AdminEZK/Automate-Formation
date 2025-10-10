require('dotenv').config();
const axios = require('axios');

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const API_BASE = 'https://api.render.com/v1';

const FRONTEND_ID = 'srv-d3kd50t6ubrc73dshqvg';
const BACKEND_ID = 'srv-d3kd06k9c44c73acekp0';

async function checkDeployStatus(serviceId, serviceName) {
  try {
    const response = await axios.get(
      `${API_BASE}/services/${serviceId}/deploys?limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Accept': 'application/json'
        }
      }
    );

    const deploy = response.data[0]?.deploy;
    if (!deploy) {
      console.log(`${serviceName}: Aucun déploiement trouvé`);
      return null;
    }

    const status = deploy.status;
    const statusIcon = 
      status === 'live' ? '✅' : 
      status === 'build_in_progress' ? '🔄' :
      status === 'build_failed' ? '❌' : 
      status === 'update_failed' ? '❌' :
      status === 'canceled' ? '⚠️' : '🔄';

    console.log(`${serviceName}: ${statusIcon} ${status}`);
    console.log(`   Deploy ID: ${deploy.id}`);
    console.log(`   Créé: ${new Date(deploy.createdAt).toLocaleString('fr-FR')}`);
    if (deploy.finishedAt) {
      console.log(`   Terminé: ${new Date(deploy.finishedAt).toLocaleString('fr-FR')}`);
    }

    return deploy;
  } catch (error) {
    console.error(`❌ Erreur pour ${serviceName}:`, error.message);
    return null;
  }
}

async function monitor() {
  console.log('🔍 SURVEILLANCE DES DÉPLOIEMENTS');
  console.log('='.repeat(80));
  console.log(`Heure: ${new Date().toLocaleString('fr-FR')}\n`);

  const backendDeploy = await checkDeployStatus(BACKEND_ID, 'Backend');
  console.log('');
  const frontendDeploy = await checkDeployStatus(FRONTEND_ID, 'Frontend');

  console.log('\n' + '='.repeat(80));

  // Vérifier si les déploiements sont terminés
  const backendDone = backendDeploy && (backendDeploy.status === 'live' || backendDeploy.status === 'build_failed' || backendDeploy.status === 'update_failed');
  const frontendDone = frontendDeploy && (frontendDeploy.status === 'live' || frontendDeploy.status === 'build_failed');

  if (backendDone && frontendDone) {
    console.log('\n✅ Tous les déploiements sont terminés!\n');
    
    if (backendDeploy.status === 'live' && frontendDeploy.status === 'live') {
      console.log('🎉 SUCCÈS! Les deux services sont en ligne:');
      console.log('   Backend: https://automate-formation.onrender.com/api/formations');
      console.log('   Frontend: https://automate-formation-1.onrender.com');
    } else {
      console.log('⚠️  Certains déploiements ont échoué. Consultez les logs sur le dashboard Render.');
    }
  } else {
    console.log('\n⏳ Déploiements en cours... Attendez 2-5 minutes.');
    console.log('   Relancez ce script pour vérifier l\'état: node monitor-deploys.js');
  }
  
  console.log('');
}

if (!process.env.RENDER_API_KEY) {
  console.error('❌ RENDER_API_KEY non trouvée dans .env');
  process.exit(1);
}

monitor();
