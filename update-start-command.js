require('dotenv').config();
const axios = require('axios');

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const API_BASE = 'https://api.render.com/v1';
const BACKEND_ID = 'srv-d3kd06k9c44c73acekp0';

async function updateStartCommand() {
  try {
    console.log('🔧 Mise à jour de la commande de démarrage...\n');
    
    // Note: L'API Render ne permet pas de modifier directement startCommand
    // Il faut le faire manuellement sur le dashboard
    
    console.log('⚠️  L\'API Render ne permet pas de modifier la commande de démarrage');
    console.log('📝 Vous devez le faire manuellement:');
    console.log('');
    console.log('1. Allez sur: https://dashboard.render.com/web/srv-d3kd06k9c44c73acekp0');
    console.log('2. Cliquez sur "Settings"');
    console.log('3. Dans "Build & Deploy", modifiez:');
    console.log('   Start Command: node start.js');
    console.log('4. Cliquez sur "Save Changes"');
    console.log('5. Le service redémarrera automatiquement');
    console.log('');
    console.log('OU utilisez directement:');
    console.log('   Start Command: node index.js');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

if (!process.env.RENDER_API_KEY) {
  console.error('❌ RENDER_API_KEY non trouvée dans .env');
  process.exit(1);
}

updateStartCommand();
