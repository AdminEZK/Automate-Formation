require('dotenv').config();
const axios = require('axios');

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const API_BASE = 'https://api.render.com/v1';
const BACKEND_ID = 'srv-d3kd06k9c44c73acekp0';

async function fixFrontendUrl() {
  try {
    console.log('🔧 Correction de FRONTEND_URL...\n');
    
    const correctUrl = 'https://automate-formation-1.onrender.com';
    
    console.log(`📝 Mise à jour de FRONTEND_URL vers: ${correctUrl}`);
    
    await axios.put(
      `${API_BASE}/services/${BACKEND_ID}/env-vars/FRONTEND_URL`,
      {
        value: correctUrl
      },
      {
        headers: {
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('✅ FRONTEND_URL mise à jour');
    
    console.log('\n🚀 Déclenchement d\'un nouveau déploiement...');
    const deployResponse = await axios.post(
      `${API_BASE}/services/${BACKEND_ID}/deploys`,
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
    
    console.log('✅ Déploiement lancé');
    console.log(`   Deploy ID: ${deployResponse.data.id}`);
    console.log('\n⏳ Attendez 2-3 minutes pour que le déploiement se termine');

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

if (!process.env.RENDER_API_KEY) {
  console.error('❌ RENDER_API_KEY non trouvée dans .env');
  process.exit(1);
}

fixFrontendUrl();
