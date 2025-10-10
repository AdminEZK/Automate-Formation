/**
 * Application principale pour l'automatisation des processus de formation
 */
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
const emailService = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes API
app.use('/api', formationRoutes);
app.use('/api', sessionRoutes);
app.use('/api', entrepriseRoutes);
app.use('/api', demandeRoutes);

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

// Route de santé pour Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
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
