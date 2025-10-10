// Test si le backend démarre correctement
const { spawn } = require('child_process');

console.log('🧪 Test de démarrage du backend...\n');

const backend = spawn('node', ['index.js'], {
  env: { ...process.env, PORT: 3333 }
});

let output = '';
let hasError = false;

backend.stdout.on('data', (data) => {
  output += data.toString();
  console.log(data.toString());
});

backend.stderr.on('data', (data) => {
  hasError = true;
  console.error('❌ ERREUR:', data.toString());
});

// Arrêter après 3 secondes
setTimeout(() => {
  backend.kill();
  
  console.log('\n' + '='.repeat(80));
  if (hasError) {
    console.log('❌ Le backend a rencontré des erreurs au démarrage');
    process.exit(1);
  } else if (output.includes('Serveur démarré')) {
    console.log('✅ Le backend démarre correctement !');
    process.exit(0);
  } else {
    console.log('⚠️  Le backend n\'a pas affiché le message de démarrage');
    console.log('Output:', output);
    process.exit(1);
  }
}, 3000);
