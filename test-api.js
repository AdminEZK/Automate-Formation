#!/usr/bin/env node
// Script de test de l'API
require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🔍 Test de l\'API Backend\n');
  console.log('='.repeat(60));
  
  try {
    // Test 1: Sessions
    console.log('\n📋 Test 1: GET /api/sessions');
    const sessionsResponse = await axios.get(`${API_URL}/sessions`);
    console.log(`✅ Statut: ${sessionsResponse.status}`);
    console.log(`✅ Nombre de sessions: ${sessionsResponse.data.length}`);
    
    if (sessionsResponse.data.length > 0) {
      const session = sessionsResponse.data[0];
      console.log(`\n📌 Première session:`);
      console.log(`   ID: ${session.id}`);
      console.log(`   Statut: ${session.statut}`);
      console.log(`   Date: ${session.date_debut}`);
      console.log(`   Participants: ${session.nombre_participants}`);
    } else {
      console.log('⚠️  Aucune session trouvée dans la base de données');
    }
    
    // Test 2: Entreprises
    console.log('\n📋 Test 2: GET /api/entreprises');
    const entreprisesResponse = await axios.get(`${API_URL}/entreprises`);
    console.log(`✅ Statut: ${entreprisesResponse.status}`);
    console.log(`✅ Nombre d'entreprises: ${entreprisesResponse.data.length}`);
    
    // Test 3: Formations
    console.log('\n📋 Test 3: GET /api/formations');
    const formationsResponse = await axios.get(`${API_URL}/formations`);
    console.log(`✅ Statut: ${formationsResponse.status}`);
    console.log(`✅ Nombre de formations: ${formationsResponse.data.length}`);
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Tous les tests sont passés !');
    console.log('\n💡 Si le dashboard est vide:');
    console.log('   1. Ouvre http://localhost:3001 dans ton navigateur');
    console.log('   2. Ouvre la console (F12)');
    console.log('   3. Vérifie les erreurs dans l\'onglet Console');
    console.log('   4. Vérifie les requêtes dans l\'onglet Network\n');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('   Statut:', error.response.status);
      console.error('   Données:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Le serveur backend n\'est pas démarré !');
      console.error('   Lance: node index.js\n');
    }
  }
}

testAPI();
