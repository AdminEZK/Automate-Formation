require('dotenv').config();
const axios = require('axios');

async function listRenderServices() {
  const apiKey = process.env.RENDER_API_KEY;
  
  if (!apiKey) {
    console.error('❌ RENDER_API_KEY non trouvée dans .env');
    process.exit(1);
  }

  try {
    console.log('🔍 Récupération de vos services Render...\n');
    
    const response = await axios.get('https://api.render.com/v1/services', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    const services = response.data;
    
    if (!services || services.length === 0) {
      console.log('ℹ️  Aucun service trouvé');
      return;
    }

    console.log(`✅ ${services.length} service(s) trouvé(s):\n`);
    
    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.service.name}`);
      console.log(`   Type: ${service.service.type}`);
      console.log(`   ID: ${service.service.id}`);
      console.log(`   État: ${service.service.suspended}`);
      if (service.service.serviceDetails?.url) {
        console.log(`   URL: ${service.service.serviceDetails.url}`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des services:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.message || error.response.statusText}`);
    } else {
      console.error(`   ${error.message}`);
    }
    process.exit(1);
  }
}

listRenderServices();
