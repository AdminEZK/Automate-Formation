/**
 * Application principale pour l'automatisation des processus de formation
 */

// Supprimer le warning de dépréciation punycode
process.removeAllListeners('warning');
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && warning.message.includes('punycode')) {
    return; // Ignorer ce warning spécifique
  }
  console.warn(warning);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Import des routes
const formationRoutes = require('./routes/formationRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const entrepriseRoutes = require('./routes/entrepriseRoutes');
const demandeRoutes = require('./routes/demandeRoutes');
const formateurRoutes = require('./routes/formateurRoutes');
const documentRoutes = require('./routes/documentRoutes');
const emailService = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Support multiple frontend URLs (production and development)
const allowedOrigins = [
  'https://automate-formation-1.onrender.com',              // Frontend Public (formulaire)
  'https://automate-formation-dashboard-5i7p.onrender.com', // Dashboard Admin
  'https://automate-formation.onrender.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'  // Vite dev server (dashboard)
];

// Add FRONTEND_URL from env if it exists
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes API
app.use('/api', formationRoutes);
app.use('/api', sessionRoutes);
app.use('/api', entrepriseRoutes);
app.use('/api', demandeRoutes);
app.use('/api', formateurRoutes);
app.use('/api/documents', documentRoutes);

// Route pour tester l'envoi d'email
app.get('/api/test-email', async (req, res) => {
  try {
    const result = await emailService.sendSimpleEmail(
      'test@example.com',
      'Test depuis Automate Formation',
      'Ceci est un email de test envoyé depuis l\'API Automate Formation.'
    );
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de test:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Démarrer le serveur
// Bind sur 0.0.0.0 pour être accessible depuis l'extérieur (requis par Render)
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Serveur démarré sur ${HOST}:${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API disponible à l'adresse http://localhost:${PORT}/api`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

/**
 * Instructions pour démarrer l'application:
 * 
 * 1. Assurez-vous d'avoir configuré votre clé API Resend dans le fichier .env
 * 2. Installez les dépendances avec: npm install
 * 3. Démarrez l'application avec: npm start
 * 4. Pour le développement, utilisez: npm run dev
 */
