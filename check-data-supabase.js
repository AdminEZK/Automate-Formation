/**
 * Script pour vérifier que les données sont bien enregistrées dans Supabase
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkData() {
  console.log('🔍 Vérification des données dans Supabase...\n');

  try {
    // 1. Vérifier les entreprises
    const { data: entreprises, error: errEntreprises } = await supabase
      .from('entreprises')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (errEntreprises) throw errEntreprises;

    console.log('📊 ENTREPRISES (5 dernières):');
    console.log('═══════════════════════════════════════');
    if (entreprises && entreprises.length > 0) {
      entreprises.forEach(e => {
        console.log(`✅ ${e.nom}`);
        console.log(`   Email: ${e.email_contact}`);
        console.log(`   Créée: ${new Date(e.created_at).toLocaleString('fr-FR')}`);
        console.log('');
      });
    } else {
      console.log('❌ Aucune entreprise trouvée\n');
    }

    // 2. Vérifier les sessions
    const { data: sessions, error: errSessions } = await supabase
      .from('sessions_formation')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (errSessions) throw errSessions;

    console.log('📅 SESSIONS DE FORMATION (5 dernières):');
    console.log('═══════════════════════════════════════');
    if (sessions && sessions.length > 0) {
      sessions.forEach(s => {
        console.log(`✅ Session ID: ${s.id}`);
        console.log(`   Statut: ${s.statut}`);
        console.log(`   Formation: ${s.formation_titre || 'ID: ' + s.formation_catalogue_id}`);
        console.log(`   Date début: ${s.date_debut}`);
        console.log(`   Participants: ${s.nombre_participants}`);
        console.log(`   Créée: ${new Date(s.created_at).toLocaleString('fr-FR')}`);
        console.log('');
      });
    } else {
      console.log('❌ Aucune session trouvée\n');
    }

    // 3. Vérifier les participants
    const { data: participants, error: errParticipants } = await supabase
      .from('participants')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (errParticipants) throw errParticipants;

    console.log('👥 PARTICIPANTS (10 derniers):');
    console.log('═══════════════════════════════════════');
    if (participants && participants.length > 0) {
      participants.forEach(p => {
        console.log(`✅ ${p.prenom} ${p.nom}`);
        console.log(`   Email: ${p.email}`);
        console.log(`   Session: ${p.session_formation_id}`);
        console.log(`   Créé: ${new Date(p.created_at).toLocaleString('fr-FR')}`);
        console.log('');
      });
    } else {
      console.log('❌ Aucun participant trouvé\n');
    }

    // 4. Vérifier les logs d'actions
    const { data: logs, error: errLogs } = await supabase
      .from('actions_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (errLogs) {
      console.log('⚠️ Table actions_log non accessible (peut-être absente)\n');
    } else {
      console.log('📝 ACTIONS LOG (5 dernières):');
      console.log('═══════════════════════════════════════');
      if (logs && logs.length > 0) {
        logs.forEach(l => {
          console.log(`✅ ${l.type_action}`);
          console.log(`   Description: ${l.description}`);
          console.log(`   User: ${l.user_email || 'N/A'}`);
          console.log(`   Date: ${new Date(l.created_at).toLocaleString('fr-FR')}`);
          console.log('');
        });
      } else {
        console.log('❌ Aucun log trouvé\n');
      }
    }

    console.log('═══════════════════════════════════════');
    console.log('✅ Vérification terminée\n');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  }
}

// Vérifier les variables d'environnement
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variables d\'environnement manquantes !');
  console.error('   Assurez-vous que SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définis dans .env\n');
  process.exit(1);
}

checkData();
