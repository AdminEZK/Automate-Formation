/**
 * Script pour appliquer les politiques RLS sur Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyRLSPolicies() {
  console.log('🔒 Application des politiques RLS...\n');

  try {
    // Lire le fichier SQL
    const sqlContent = fs.readFileSync('./fix-rls-policies.sql', 'utf8');
    
    // Diviser en commandes individuelles (séparées par des lignes vides ou des commentaires)
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`📝 ${commands.length} commandes SQL à exécuter\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i] + ';';
      
      // Ignorer les commentaires
      if (command.startsWith('--')) continue;
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: command });
        
        if (error) {
          console.log(`❌ Erreur commande ${i + 1}:`, error.message);
          errorCount++;
        } else {
          successCount++;
          process.stdout.write('.');
        }
      } catch (err) {
        console.log(`\n⚠️ Erreur commande ${i + 1}:`, err.message);
        errorCount++;
      }
    }

    console.log('\n');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Succès: ${successCount} commandes`);
    console.log(`❌ Erreurs: ${errorCount} commandes`);
    console.log('═══════════════════════════════════════\n');

    if (errorCount === 0) {
      console.log('🎉 Toutes les politiques RLS ont été appliquées avec succès !');
      console.log('\n📋 Prochaines étapes:');
      console.log('   1. Testez le formulaire de demande');
      console.log('   2. Vérifiez que les données s\'insèrent correctement');
      console.log('   3. Vérifiez dans Supabase Dashboard → Authentication → Policies\n');
    } else {
      console.log('⚠️ Certaines commandes ont échoué.');
      console.log('💡 Vous pouvez exécuter le script SQL manuellement dans Supabase SQL Editor.\n');
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'application des politiques:', error);
    console.log('\n💡 Solution alternative:');
    console.log('   1. Allez sur https://supabase.com/dashboard');
    console.log('   2. Ouvrez SQL Editor');
    console.log('   3. Copiez-collez le contenu de fix-rls-policies.sql');
    console.log('   4. Cliquez sur Run\n');
  }
}

// Vérifier que les variables d'environnement sont définies
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variables d\'environnement manquantes !');
  console.error('   Assurez-vous que SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définis dans .env\n');
  process.exit(1);
}

console.log('🔐 Connexion à Supabase...');
console.log(`   URL: ${process.env.SUPABASE_URL}`);
console.log(`   Service Role Key: ${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...\n`);

applyRLSPolicies();
