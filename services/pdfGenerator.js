const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');

/**
 * Service de génération de PDF à partir de templates HTML
 */
class PDFGenerator {
  /**
   * Remplace les placeholders dans le template HTML
   * @param {string} template - Template HTML avec placeholders {{variable}}
   * @param {object} data - Données à injecter
   * @returns {string} HTML avec données injectées
   */
  replacePlaceholders(template, data) {
    let result = template;
    
    // Remplacer tous les placeholders {{variable}}
    for (const [key, value] of Object.entries(data)) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(placeholder, value || '');
    }
    
    // Remplacer les placeholders restants par une chaîne vide
    result = result.replace(/{{[^}]+}}/g, '');
    
    return result;
  }

  /**
   * Génère un PDF à partir d'un template HTML et de données
   * @param {string} templatePath - Chemin vers le template HTML
   * @param {object} data - Données à injecter
   * @param {object} options - Options de génération PDF
   * @returns {Promise<Buffer>} Buffer du PDF généré
   */
  async generatePDF(templatePath, data, options = {}) {
    try {
      // Lire le template HTML
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      
      // Remplacer les placeholders
      const htmlContent = this.replacePlaceholders(templateContent, data);
      
      // Options par défaut pour Puppeteer
      const defaultOptions = {
        format: 'A4',
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        },
        printBackground: true,
        preferCSSPageSize: true
      };
      
      // Fusionner avec les options personnalisées
      const pdfOptions = { ...defaultOptions, ...options };
      
      // Lancer Puppeteer
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Charger le HTML
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      });
      
      // Générer le PDF
      const pdfBuffer = await page.pdf(pdfOptions);
      
      // Fermer le navigateur
      await browser.close();
      
      return pdfBuffer;
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      throw new Error(`Échec de la génération du PDF: ${error.message}`);
    }
  }

  /**
   * Génère un programme de formation
   * @param {object} sessionData - Données de la session
   * @returns {Promise<Buffer>} Buffer du PDF
   */
  async generateProgrammeFormation(sessionData) {
    const templatePath = path.join(__dirname, '../templates/programme-formation-template.html');
    
    // Préparer les données
    const data = {
      // Informations générales
      titre: sessionData.formation.titre,
      nature_action: sessionData.formation.nature_action || 'Formation professionnelle continue',
      duree: sessionData.formation.duree,
      duree_jours: Math.ceil(sessionData.formation.duree / 7),
      date_debut: this.formatDate(sessionData.session.date_debut),
      date_fin: this.formatDate(sessionData.session.date_fin),
      modalite: this.getModaliteLabel(sessionData.session.modalite),
      lieu: sessionData.session.lieu || 'À définir',
      entreprise_nom: sessionData.entreprise.nom,
      nombre_participants: sessionData.session.nombre_participants || 0,
      
      // Contenu pédagogique
      objectifs: sessionData.formation.objectifs || 'À définir',
      public_vise: sessionData.formation.public_vise || 'Tout public',
      prerequis: sessionData.formation.prerequis || 'Aucun prérequis',
      competences_visees: sessionData.formation.competences_visees || '',
      programme: sessionData.formation.programme || 'Programme à définir',
      
      // Méthodes et moyens
      methodes_pedagogiques: sessionData.formation.methodes_pedagogiques || 'Apports théoriques et pratiques',
      moyens_pedagogiques: sessionData.formation.moyens_pedagogiques || 'Supports de formation',
      modalites_evaluation: sessionData.formation.modalites_evaluation || 'Évaluation continue',
      
      // Formateur
      formateur_nom: sessionData.formateur?.nom || 'À définir',
      formateur_specialites: sessionData.formateur?.specialites?.join(', ') || '',
      formateur_experience: sessionData.formateur?.experience || '',
      
      // Accessibilité
      accessibilite_handicap: sessionData.formation.accessibilite_handicap || 'Nous contacter',
      referent_handicap_contact: sessionData.organisme?.referent_handicap || 'contact@organisme.fr',
      delai_acces: sessionData.formation.delai_acces || '2 semaines',
      modalites_acces: sessionData.formation.modalites_acces || 'Inscription en ligne',
      
      // Tarif
      prix_unitaire_ht: sessionData.formation.prix_ht || 0,
      prix_total_ht: (sessionData.formation.prix_ht || 0) * (sessionData.session.nombre_participants || 1),
      tva_taux: 20,
      tva_montant: ((sessionData.formation.prix_ht || 0) * (sessionData.session.nombre_participants || 1)) * 0.20,
      prix_total_ttc: ((sessionData.formation.prix_ht || 0) * (sessionData.session.nombre_participants || 1)) * 1.20,
      
      // Organisme
      organisme_nom: sessionData.organisme?.nom || 'Organisme de formation',
      organisme_adresse: sessionData.organisme?.adresse || '',
      organisme_code_postal: sessionData.organisme?.code_postal || '',
      organisme_ville: sessionData.organisme?.ville || '',
      organisme_siret: sessionData.organisme?.siret || '',
      organisme_nda: sessionData.organisme?.numero_declaration_activite || '',
      organisme_telephone: sessionData.organisme?.telephone || '',
      organisme_email: sessionData.organisme?.email || '',
      logo_url: sessionData.organisme?.logo_url || '',
      
      // Métadonnées
      date_generation: this.formatDate(new Date())
    };
    
    return await this.generatePDF(templatePath, data);
  }

  /**
   * Formate une date au format français
   * @param {Date|string} date - Date à formater
   * @returns {string} Date formatée (JJ/MM/AAAA)
   */
  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Retourne le label de la modalité
   * @param {string} modalite - Code de la modalité
   * @returns {string} Label de la modalité
   */
  getModaliteLabel(modalite) {
    const labels = {
      'presentiel': 'Présentiel',
      'distanciel': 'Distanciel',
      'mixte': 'Mixte (présentiel + distanciel)'
    };
    return labels[modalite] || modalite || 'Présentiel';
  }
}

module.exports = new PDFGenerator();
