import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Automate Formation</h3>
            <p>Solution complète d'automatisation pour la gestion des formations professionnelles.</p>
          </div>
          
          <div className="footer-section">
            <h3>Liens rapides</h3>
            <ul>
              <li><a href="/">Accueil</a></li>
              <li><a href="/dashboard">Tableau de bord</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: contact@automate-formation.fr</p>
            <p>Téléphone: +33 1 23 45 67 89</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Automate Formation. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
