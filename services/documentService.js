const fs = require('fs').promises;
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');
// const libre = require('libreoffice-convert'); // Désactivé temporairement - nécessite LibreOffice sur le serveur
const { promisify } = require('util');

// Convertir la fonction de conversion de LibreOffice en Promise
// const libreConvert = promisify(libre.convert); // Désactivé temporairement
const libreConvert = null; // Placeholder

/**
 * Service de génération de documents
 */
class DocumentService {
  constructor() {
    this.templatesDir = path.join(__dirname, '..', 'Dossier exemple');
  }

  /**
   * Génère une convocation à partir du modèle
   * @param {Object} data - Données pour la convocation
   * @returns {Promise<Buffer>} - Buffer du document PDF généré
   */
  async generateInvitation(data) {
    try {
      // Créer un nouveau document docx
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "CONVOCATION À UNE FORMATION",
                  bold: true,
                  size: 36
                })
              ]
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              text: `Date: ${new Date().toLocaleDateString('fr-FR')}`
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              text: `Madame, Monsieur ${data.lastName} ${data.firstName},`
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              text: `Nous avons le plaisir de vous convier à la formation suivante :`
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              text: `Intitulé: ${data.formationTitle}`
            }),
            new Paragraph({
              text: `Date: ${data.formationDate}`
            }),
            new Paragraph({
              text: `Lieu: ${data.formationLocation}`
            }),
            new Paragraph({
              text: `Horaires: ${data.formationHours || '9h00 - 17h00'}`
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              text: "Nous vous remercions de bien vouloir confirmer votre présence."
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              text: "Cordialement,"
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              text: "L'équipe de formation"
            })
          ]
        }]
      });

      // Générer le document docx
      const buffer = await Packer.toBuffer(doc);
      
      // Convertir le document docx en PDF
      const pdfBuffer = await this.convertToPdf(buffer);
      
      return pdfBuffer;
    } catch (error) {
      console.error('Erreur lors de la génération de la convocation:', error);
      throw error;
    }
  }

  /**
   * Génère un certificat de réalisation à partir du modèle
   * @param {Object} data - Données pour le certificat
   * @returns {Promise<Buffer>} - Buffer du document PDF généré
   */
  async generateCertificate(data) {
    try {
      // Créer un nouveau document docx
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "CERTIFICAT DE RÉALISATION",
                  bold: true,
                  size: 36
                })
              ]
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Attestation de suivi de formation",
                  italics: true,
                  size: 28
                })
              ]
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              text: `Je soussigné(e), ${data.formateur || 'Responsable de formation'}, certifie que :`
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${data.lastName} ${data.firstName}`,
                  bold: true,
                  size: 28
                })
              ]
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              text: `A suivi avec assiduité la formation :`
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: data.formationTitle,
                  bold: true,
                  size: 28
                })
              ]
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              text: `Durée: ${data.formationDuration || '7 heures'}`
            }),
            new Paragraph({
              text: `Date: ${data.formationDate}`
            }),
            new Paragraph({
              text: `Lieu: ${data.formationLocation}`
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              text: `Fait à ${data.city || 'Paris'}, le ${new Date().toLocaleDateString('fr-FR')}`
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              text: "Signature du responsable:"
            }),
            new Paragraph({
              text: ""
            }),
            new Paragraph({
              text: data.formateur || 'Responsable de formation'
            })
          ]
        }]
      });

      // Générer le document docx
      const buffer = await Packer.toBuffer(doc);
      
      // Convertir le document docx en PDF
      const pdfBuffer = await this.convertToPdf(buffer);
      
      return pdfBuffer;
    } catch (error) {
      console.error('Erreur lors de la génération du certificat:', error);
      throw error;
    }
  }

  /**
   * Convertit un document docx en PDF
   * @param {Buffer} docxBuffer - Buffer du document docx
   * @returns {Promise<Buffer>} - Buffer du document PDF
   */
  async convertToPdf(docxBuffer) {
    try {
      // Convertir le document docx en PDF
      const pdfBuffer = await libreConvert(docxBuffer, '.pdf', undefined);
      return pdfBuffer;
    } catch (error) {
      console.error('Erreur lors de la conversion en PDF:', error);
      
      // Si la conversion échoue, créer un PDF simple avec pdf-lib
      return this.createSimplePdf('La conversion en PDF a échoué. Veuillez contacter le support.');
    }
  }

  /**
   * Crée un PDF simple avec un message
   * @param {string} message - Message à inclure dans le PDF
   * @returns {Promise<Buffer>} - Buffer du document PDF
   */
  async createSimplePdf(message) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    page.drawText(message, {
      x: 50,
      y: height - 50,
      size: 12,
    });
    
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}

module.exports = new DocumentService();
