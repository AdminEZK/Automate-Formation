require('dotenv').config();
const axios = require('axios');

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const API_BASE = 'https://api.render.com/v1';
const BACKEND_ID = 'srv-d3kd06k9c44c73acekp0';

async function fixHealthCheck() {
  try {
    console.log('🔧 Mise à jour du Health Check Path...\n');
    
    console.log('⚠️  L\'API Render ne permet pas de modifier le Health Check Path directement');
    console.log('📝 Vous devez le faire manuellement sur le dashboard:');
    console.log('');
    console.log('1. Allez sur: https://dashboard.render.com/web/srv-d3kd06k9c44c73acekp0');
    console.log('2. Cliquez sur "Settings"');
    console.log('3. Trouvez "Health Check Path"');
    console.log('4. Changez de "/api/formations" vers "/health"');
    console.log('5. Cliquez sur "Save Changes"');
    console.log('');
    console.log('OU laissez "/api/formations" et supprimez la route /health de index.js');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

if (!process.env.RENDER_API_KEY) {
  console.error('❌ RENDER_API_KEY non trouvée dans .env');
  process.exit(1);
}

fixHealthCheck();
