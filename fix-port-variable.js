require('dotenv').config();
const axios = require('axios');

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const API_BASE = 'https://api.render.com/v1';
const BACKEND_ID = 'srv-d3kd06k9c44c73acekp0';

async function fixPortVariable() {
  try {
    console.log('🔧 Correction de la variable PORT...\n');
    
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
    const portVar = envVars.find(v => v.envVar.key === 'port');
    const PORTVar = envVars.find(v => v.envVar.key === 'PORT');

    console.log('Variables actuelles:');
    console.log(`   port (minuscule): ${portVar ? '✓ existe' : '✗ n\'existe pas'}`);
    console.log(`   PORT (majuscule): ${PORTVar ? '✓ existe' : '✗ n\'existe pas'}`);

    // Si port existe mais pas PORT, on crée PORT
    if (portVar && !PORTVar) {
      console.log('\n⚠️  Problème détecté: "port" existe mais pas "PORT"');
      console.log('   Render utilise PORT (majuscule) par défaut');
      console.log('\n📝 Création de la variable PORT...');
      
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
      
      console.log('✅ Variable PORT créée avec la valeur 10000');
      
      // Optionnel: supprimer l'ancienne variable "port"
      console.log('\n🗑️  Suppression de l\'ancienne variable "port"...');
      await axios.delete(
        `${API_BASE}/services/${BACKEND_ID}/env-vars/port`,
        {
          headers: {
            'Authorization': `Bearer ${RENDER_API_KEY}`,
            'Accept': 'application/json'
          }
        }
      );
      console.log('✅ Variable "port" supprimée');
      
      console.log('\n🚀 Déclenchement d\'un nouveau déploiement...');
      await axios.post(
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
      console.log('✅ Déploiement lancé avec le cache vidé');
      
    } else if (PORTVar) {
      console.log('\n✅ La variable PORT est correctement configurée');
      console.log(`   Valeur: ${PORTVar.envVar.value || '(vide)'}`);
    } else {
      console.log('\n⚠️  Aucune variable PORT trouvée, création...');
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
      console.log('✅ Variable PORT créée');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

if (!process.env.RENDER_API_KEY) {
  console.error('❌ RENDER_API_KEY non trouvée dans .env');
  process.exit(1);
}

fixPortVariable();
