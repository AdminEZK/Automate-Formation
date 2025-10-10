require('dotenv').config();
const axios = require('axios');

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const API_BASE = 'https://api.render.com/v1';
const BACKEND_ID = 'srv-d3kd06k9c44c73acekp0';

async function updateBackendEnvVars() {
  try {
    console.log('🔧 Vérification des variables d\'environnement du backend...\n');
    
    // Récupérer les variables actuelles
    const response = await axios.get(
      `${API_BASE}/services/${BACKEND_ID}/env-vars`,
      {
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Accept': 'application/json'
        }
      }
    );

    const envVars = response.data;
    console.log('Variables d\'environnement actuelles:');
    envVars.forEach(envVar => {
      console.log(`   ${envVar.envVar.key}: ${envVar.envVar.value ? '***' : '(vide)'}`);
    });

    // Vérifier si PORT est défini
    const portVar = envVars.find(v => v.envVar.key === 'PORT' || v.envVar.key === 'port');
    
    if (!portVar) {
      console.log('\n⚠️  Variable PORT manquante, ajout en cours...');
      
      await axios.put(
        `${API_BASE}/services/${BACKEND_ID}/env-vars/PORT`,
        {
          value: '10000'
        },
        {
          headers: {
            'Authorization': `Bearer ${RENDER_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('✅ Variable PORT ajoutée');
    } else {
      console.log(`\n✅ Variable PORT déjà définie: ${portVar.envVar.key}`);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

async function getServiceInfo() {
  try {
    const response = await axios.get(
      `${API_BASE}/services/${BACKEND_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Accept': 'application/json'
        }
      }
    );

    const service = response.data;
    
    console.log('\n📋 Informations du service Backend:');
    console.log('='.repeat(80));
    console.log(`Nom: ${service.name}`);
    console.log(`Type: ${service.type}`);
    console.log(`Repo: ${service.repo}`);
    console.log(`Branch: ${service.branch}`);
    console.log(`Root Dir: ${service.rootDir || '/'}`);
    console.log(`\nService Details:`);
    console.log(JSON.stringify(service.serviceDetails, null, 2));
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

async function main() {
  console.log('🔍 DIAGNOSTIC ET CORRECTION DU BACKEND\n');
  console.log('='.repeat(80));

  if (!RENDER_API_KEY) {
    console.error('❌ RENDER_API_KEY non trouvée dans .env');
    process.exit(1);
  }

  await getServiceInfo();
  await updateBackendEnvVars();

  console.log('\n' + '='.repeat(80));
  console.log('📝 INSTRUCTIONS MANUELLES NÉCESSAIRES');
  console.log('='.repeat(80));
  console.log('\nL\'API Render ne permet pas de modifier certains paramètres.');
  console.log('Vous devez les configurer manuellement sur le dashboard:\n');
  console.log('1. Allez sur: https://dashboard.render.com/web/srv-d3kd06k9c44c73acekp0');
  console.log('2. Cliquez sur "Settings"');
  console.log('3. Dans la section "Build & Deploy":');
  console.log('   - Build Command: npm install');
  console.log('   - Start Command: node index.js');
  console.log('4. Cliquez sur "Save Changes"');
  console.log('5. Allez dans "Manual Deploy" → "Clear build cache & deploy"\n');
  
  console.log('Pour le Frontend:');
  console.log('1. Allez sur: https://dashboard.render.com/static/srv-d3kd50t6ubrc73dshqvg');
  console.log('2. Vérifiez que la configuration est:');
  console.log('   - Root Directory: client');
  console.log('   - Build Command: npm install && npm run build');
  console.log('   - Publish Directory: build');
  console.log('3. Si ce n\'est pas le cas, corrigez et sauvegardez');
  console.log('4. Déployez avec "Clear build cache & deploy"\n');
}

main();
