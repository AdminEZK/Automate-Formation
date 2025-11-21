"""
Service de Génération de Documents Qualiopi
============================================
Génère automatiquement les 19 documents obligatoires Qualiopi
Date: 8 octobre 2025
Version: 1.0
"""

import os
from datetime import datetime, timedelta
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import json
from typing import Dict, List, Optional

class QualiopisDocumentGenerator:
    """Générateur de documents Qualiopi"""
    
    def __init__(self, supabase_client):
        """
        Initialise le générateur de documents
        
        Args:
            supabase_client: Client Supabase pour accéder aux données
        """
        self.supabase = supabase_client
        self.output_dir = "generated_documents"
        self.ensure_output_dir()
        
    def ensure_output_dir(self):
        """Crée le dossier de sortie s'il n'existe pas"""
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    # ============================================
    # MÉTHODES UTILITAIRES
    # ============================================
    
    def get_session_data(self, session_id: str) -> Dict:
        """Récupère toutes les données d'une session"""
        response = self.supabase.table('vue_sessions_formation').select('*').eq('id', session_id).execute()
        if not response.data:
            raise ValueError(f"Session {session_id} non trouvée")
        return response.data[0]
    
    def get_organisme_data(self) -> Dict:
        """Récupère les données de l'organisme de formation"""
        response = self.supabase.table('organisme_formation').select('*').limit(1).execute()
        if not response.data:
            raise ValueError("Aucun organisme de formation configuré")
        return response.data[0]
    
    def get_participants(self, session_id: str) -> List[Dict]:
        """Récupère la liste des participants d'une session"""
        response = self.supabase.table('participants').select('*').eq('session_formation_id', session_id).execute()
        return response.data
    
    def format_date(self, date_str: str) -> str:
        """Formate une date au format français"""
        if not date_str:
            return ""
        date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        return date_obj.strftime("%d/%m/%Y")
    
    def format_prix(self, prix: float) -> str:
        """Formate un prix en euros"""
        return f"{prix:,.2f} €".replace(',', ' ')
    
    # ============================================
    # 1. PROPOSITION DE FORMATION (DEVIS)
    # ============================================
    
    def generer_proposition_formation(self, session_id: str) -> str:
        """Génère la proposition de formation (devis)"""
        session = self.get_session_data(session_id)
        organisme = self.get_organisme_data()
        
        filename = f"{self.output_dir}/proposition_formation_{session_id}.pdf"
        doc = SimpleDocTemplate(filename, pagesize=A4)
        story = []
        styles = getSampleStyleSheet()
        
        # Style personnalisé
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#003366'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        # En-tête
        story.append(Paragraph(f"<b>{organisme['nom']}</b>", title_style))
        story.append(Paragraph(f"N° de déclaration d'activité : {organisme['numero_declaration_activite']}", styles['Normal']))
        story.append(Spacer(1, 0.5*cm))
        
        # Titre
        story.append(Paragraph("<b>PROPOSITION DE FORMATION</b>", title_style))
        story.append(Spacer(1, 0.5*cm))
        
        # Informations entreprise
        story.append(Paragraph("<b>ENTREPRISE CLIENTE</b>", styles['Heading2']))
        entreprise_data = [
            ['Raison sociale', session.get('entreprise_nom', 'N/A')],
            ['SIRET', session.get('entreprise_siret', 'N/A') or 'N/A'],
            ['Adresse', f"{session.get('entreprise_adresse', '')}, {session.get('entreprise_code_postal', '')} {session.get('entreprise_ville', '')}"],
            ['Contact', session.get('entreprise_email', 'N/A')],
            ['Téléphone', session.get('entreprise_telephone', 'N/A') or 'N/A']
        ]
        table = Table(entreprise_data, colWidths=[5*cm, 12*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(table)
        story.append(Spacer(1, 0.5*cm))
        
        # Informations formation
        story.append(Paragraph("<b>FORMATION PROPOSÉE</b>", styles['Heading2']))
        formation_data = [
            ['Intitulé', session.get('formation_titre', 'N/A')],
            ['Nature de l\'action', session.get('formation_nature_action', 'Formation')],
            ['Durée', f"{session.get('formation_duree', 'N/A')} heures"],
            ['Dates', f"Du {self.format_date(session.get('date_debut', ''))} au {self.format_date(session.get('date_fin', ''))}"],
            ['Lieu', session.get('lieu', 'À définir')],
            ['Nombre de participants', str(session.get('nombre_participants', 'N/A'))]
        ]
        table = Table(formation_data, colWidths=[5*cm, 12*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(table)
        story.append(Spacer(1, 0.5*cm))
        
        # Note sur le devis
        story.append(Paragraph("<b>TARIFICATION</b>", styles['Heading2']))
        story.append(Paragraph(
            "Un devis détaillé vous sera transmis par notre équipe commerciale dans les plus brefs délais.",
            styles['Normal']
        ))
        story.append(Spacer(1, 0.5*cm))
        
        # Informations de contact
        story.append(Paragraph("<b>CONTACT</b>", styles['Heading2']))
        contact_text = f"""
        Pour toute question ou demande d'information complémentaire :<br/>
        <b>Email :</b> {organisme.get('email', 'contact@aladeconseils.com')}<br/>
        <b>Téléphone :</b> {organisme.get('telephone', '02.99.19.37.09')}<br/>
        <b>Adresse :</b> {organisme.get('adresse', '')}, {organisme.get('code_postal', '')} {organisme.get('ville', '')}
        """
        story.append(Paragraph(contact_text, styles['Normal']))
        story.append(Spacer(1, 1*cm))
        
        # Pied de page
        story.append(Paragraph(f"<i>Proposition valable 30 jours - {organisme['nom']}</i>", styles['Normal']))
        
        doc.build(story)
        return filename
    
    # ============================================
    # 2. CONVENTION DE FORMATION
    # ============================================
    
    def generer_convention_formation(self, session_id: str) -> str:
        """Génère la convention de formation"""
        session = self.get_session_data(session_id)
        organisme = self.get_organisme_data()
        
        filename = f"{self.output_dir}/convention_formation_{session_id}.pdf"
        doc = SimpleDocTemplate(filename, pagesize=A4)
        story = []
        styles = getSampleStyleSheet()
        
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            textColor=colors.HexColor('#003366'),
            spaceAfter=20,
            alignment=TA_CENTER
        )
        
        # Titre
        story.append(Paragraph("<b>CONVENTION DE FORMATION PROFESSIONNELLE</b>", title_style))
        story.append(Paragraph(f"(Articles L. 6353-1 et L. 6353-2 du Code du travail)", styles['Normal']))
        story.append(Spacer(1, 1*cm))
        
        # Entre
        story.append(Paragraph("<b>ENTRE LES SOUSSIGNÉS :</b>", styles['Heading2']))
        story.append(Spacer(1, 0.3*cm))
        
        # Organisme de formation
        story.append(Paragraph("<b>L'ORGANISME DE FORMATION</b>", styles['Heading3']))
        organisme_text = f"""
        <b>{organisme['raison_sociale']}</b><br/>
        SIRET : {organisme['siret']}<br/>
        N° de déclaration d'activité : {organisme['numero_declaration_activite']}<br/>
        Adresse : {organisme['adresse']}, {organisme['code_postal']} {organisme['ville']}<br/>
        Représenté par : {organisme['representant_legal_prenom']} {organisme['representant_legal_nom']}, {organisme['representant_legal_fonction']}<br/>
        Email : {organisme['email']}<br/>
        Téléphone : {organisme['telephone']}
        """
        story.append(Paragraph(organisme_text, styles['Normal']))
        story.append(Spacer(1, 0.5*cm))
        
        story.append(Paragraph("<b>D'UNE PART,</b>", styles['Normal']))
        story.append(Spacer(1, 0.5*cm))
        
        # Client
        story.append(Paragraph("<b>ET</b>", styles['Normal']))
        story.append(Spacer(1, 0.3*cm))
        
        story.append(Paragraph("<b>LE CLIENT</b>", styles['Heading3']))
        client_text = f"""
        <b>{session['entreprise_nom']}</b><br/>
        SIRET : {session['entreprise_siret'] or 'N/A'}<br/>
        Adresse : {session['entreprise_adresse']}, {session['entreprise_code_postal']} {session['entreprise_ville']}<br/>
        Représenté par : {session.get('entreprise_representant_prenom', '')} {session.get('entreprise_representant_nom', '')}<br/>
        Email : {session['entreprise_email']}<br/>
        Téléphone : {session['entreprise_telephone'] or 'N/A'}
        """
        story.append(Paragraph(client_text, styles['Normal']))
        story.append(Spacer(1, 0.5*cm))
        
        story.append(Paragraph("<b>D'AUTRE PART,</b>", styles['Normal']))
        story.append(Spacer(1, 1*cm))
        
        # Articles
        story.append(Paragraph("<b>IL A ÉTÉ CONVENU CE QUI SUIT :</b>", styles['Heading2']))
        story.append(Spacer(1, 0.5*cm))
        
        # Article 1
        story.append(Paragraph("<b>ARTICLE 1 - OBJET DE LA CONVENTION</b>", styles['Heading3']))
        article1 = f"""
        La présente convention a pour objet la réalisation d'une action de formation professionnelle continue 
        intitulée "<b>{session['formation_titre']}</b>" conformément aux dispositions des articles L. 6353-1 et suivants du Code du travail.
        """
        story.append(Paragraph(article1, styles['Normal']))
        story.append(Spacer(1, 0.3*cm))
        
        # Article 2
        story.append(Paragraph("<b>ARTICLE 2 - NATURE ET CARACTÉRISTIQUES DE L'ACTION DE FORMATION</b>", styles['Heading3']))
        article2 = f"""
        <b>Nature de l'action :</b> {session.get('formation_nature_action', 'Formation')}<br/>
        <b>Intitulé :</b> {session['formation_titre']}<br/>
        <b>Objectifs :</b> {session.get('formation_objectifs', 'Voir programme détaillé')}<br/>
        <b>Durée :</b> {session['formation_duree']} heures<br/>
        <b>Dates :</b> Du {self.format_date(session['date_debut'])} au {self.format_date(session['date_fin'])}<br/>
        <b>Horaires :</b> De {session.get('horaire_debut', '09:00')} à {session.get('horaire_fin', '17:00')}<br/>
        <b>Lieu :</b> {session['lieu']}<br/>
        <b>Nombre de participants :</b> {session['nombre_participants']}
        """
        story.append(Paragraph(article2, styles['Normal']))
        story.append(Spacer(1, 0.3*cm))
        
        # Article 3
        story.append(Paragraph("<b>ARTICLE 3 - MODALITÉS FINANCIÈRES</b>", styles['Heading3']))
        modalites = session.get('modalites_reglement', 'Paiement à 30 jours fin de mois')
        conditions = session.get('conditions_annulation', "Annulation possible jusqu'à 7 jours avant le début de la formation")
        article3 = f"""
        Le coût total de la formation s'élève à <b>{self.format_prix(session['prix_total_ht'])} HT</b>, 
        soit <b>{self.format_prix(session['prix_total_ht'] * 1.20)} TTC</b>.<br/><br/>
        <b>Modalités de règlement :</b> {modalites}<br/>
        <b>Conditions d'annulation :</b> {conditions}
        """
        story.append(Paragraph(article3, styles['Normal']))
        story.append(Spacer(1, 0.3*cm))
        
        # Article 4
        story.append(Paragraph("<b>ARTICLE 4 - DÉLAI DE RÉTRACTATION</b>", styles['Heading3']))
        article4 = f"""
        Conformément à l'article L. 6353-5 du Code du travail, le client dispose d'un délai de 
        <b>{organisme.get('delai_retractation', '10 jours')}</b> à compter de la signature de la présente convention 
        pour se rétracter par lettre recommandée avec accusé de réception.
        """
        story.append(Paragraph(article4, styles['Normal']))
        story.append(Spacer(1, 1*cm))
        
        # Signatures
        story.append(Paragraph("<b>Fait en deux exemplaires originaux,</b>", styles['Normal']))
        story.append(Paragraph(f"À {organisme['ville']}, le {datetime.now().strftime('%d/%m/%Y')}", styles['Normal']))
        story.append(Spacer(1, 1*cm))
        
        signatures_data = [
            ['Pour l\'organisme de formation', 'Pour le client'],
            [f"{organisme['representant_legal_prenom']} {organisme['representant_legal_nom']}", 
             f"{session.get('entreprise_representant_prenom', '')} {session.get('entreprise_representant_nom', '')}"],
            ['Signature :', 'Signature :'],
            ['', '']
        ]
        table = Table(signatures_data, colWidths=[8.5*cm, 8.5*cm], rowHeights=[0.8*cm, 0.8*cm, 0.8*cm, 2*cm])
        table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 2), (-1, -1), 1, colors.black)
        ]))
        story.append(table)
        
        doc.build(story)
        return filename
    
    # ============================================
    # 3. PROGRAMME DE FORMATION
    # ============================================
    
    def generer_programme_formation(self, session_id: str) -> str:
        """Génère le programme détaillé de formation"""
        session = self.get_session_data(session_id)
        organisme = self.get_organisme_data()
        
        filename = f"{self.output_dir}/programme_formation_{session_id}.pdf"
        doc = SimpleDocTemplate(filename, pagesize=A4)
        story = []
        styles = getSampleStyleSheet()
        
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#003366'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        # En-tête
        story.append(Paragraph(f"<b>{organisme['nom']}</b>", title_style))
        story.append(Paragraph(f"Organisme de formation certifié Qualiopi", styles['Normal']))
        story.append(Paragraph(f"N° de déclaration d'activité : {organisme['numero_declaration_activite']}", styles['Normal']))
        story.append(Spacer(1, 1*cm))
        
        # Titre
        story.append(Paragraph(f"<b>PROGRAMME DE FORMATION</b>", title_style))
        story.append(Paragraph(f"<b>{session['formation_titre']}</b>", styles['Heading2']))
        story.append(Spacer(1, 0.5*cm))
        
        # Informations générales
        story.append(Paragraph("<b>INFORMATIONS GÉNÉRALES</b>", styles['Heading2']))
        infos_data = [
            ['Durée', f"{session['formation_duree']} heures"],
            ['Public visé', session.get('formation_public_vise', 'Tout public')],
            ['Prérequis', session.get('formation_prerequis', 'Aucun')],
            ['Format', session.get('formation_format', 'Présentiel')],
            ['Délai d\'accès', session.get('formation_delai_acces', '2 semaines')]
        ]
        table = Table(infos_data, colWidths=[5*cm, 12*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(table)
        story.append(Spacer(1, 0.5*cm))
        
        # Objectifs pédagogiques
        story.append(Paragraph("<b>OBJECTIFS PÉDAGOGIQUES</b>", styles['Heading2']))
        story.append(Paragraph(session.get('formation_objectifs', 'Objectifs à définir'), styles['Normal']))
        story.append(Spacer(1, 0.5*cm))
        
        # Contenu détaillé
        story.append(Paragraph("<b>CONTENU DÉTAILLÉ</b>", styles['Heading2']))
        story.append(Paragraph(session.get('formation_programme', 'Programme à définir'), styles['Normal']))
        story.append(Spacer(1, 0.5*cm))
        
        # Méthodes pédagogiques
        story.append(Paragraph("<b>MÉTHODES PÉDAGOGIQUES</b>", styles['Heading2']))
        story.append(Paragraph(session.get('formation_methodes_pedagogiques', 
            'Formation en présentiel avec alternance d\'apports théoriques et d\'exercices pratiques'), styles['Normal']))
        story.append(Spacer(1, 0.5*cm))
        
        # Moyens pédagogiques
        story.append(Paragraph("<b>MOYENS PÉDAGOGIQUES</b>", styles['Heading2']))
        story.append(Paragraph(session.get('formation_moyens_pedagogiques', 
            'Salle de formation équipée, supports de cours, exercices pratiques'), styles['Normal']))
        story.append(Spacer(1, 0.5*cm))
        
        # Modalités d'évaluation
        story.append(Paragraph("<b>MODALITÉS D'ÉVALUATION</b>", styles['Heading2']))
        story.append(Paragraph(session.get('formation_modalites_evaluation', 
            'Évaluation des acquis en fin de formation, questionnaire de satisfaction'), styles['Normal']))
        story.append(Spacer(1, 0.5*cm))
        
        # Accessibilité handicap
        story.append(Paragraph("<b>ACCESSIBILITÉ HANDICAP</b>", styles['Heading2']))
        story.append(Paragraph(session.get('formation_accessibilite_handicap', 
            'Formation accessible aux personnes en situation de handicap. Nous contacter pour étudier les adaptations nécessaires.'), 
            styles['Normal']))
        story.append(Spacer(1, 1*cm))
        
        # Contact
        story.append(Paragraph(f"<b>Contact :</b> {organisme['email']} - {organisme['telephone']}", styles['Normal']))
        
        doc.build(story)
        return filename
    
    # ============================================
    # 4. CONVOCATION
    # ============================================
    
    def generer_convocation(self, session_id: str, participant_id: str) -> str:
        """Génère une convocation personnalisée pour un participant"""
        session = self.get_session_data(session_id)
        organisme = self.get_organisme_data()
        
        # Récupérer les données du participant
        response = self.supabase.table('participants').select('*').eq('id', participant_id).execute()
        if not response.data:
            raise ValueError(f"Participant {participant_id} non trouvé")
        participant = response.data[0]
        
        filename = f"{self.output_dir}/convocation_{participant_id}.pdf"
        doc = SimpleDocTemplate(filename, pagesize=A4)
        story = []
        styles = getSampleStyleSheet()
        
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#003366'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        # En-tête
        story.append(Paragraph(f"<b>{organisme['nom']}</b>", title_style))
        story.append(Spacer(1, 0.5*cm))
        
        # Titre
        story.append(Paragraph("<b>CONVOCATION À UNE FORMATION</b>", title_style))
        story.append(Spacer(1, 1*cm))
        
        # Destinataire
        story.append(Paragraph(f"<b>{participant['prenom']} {participant['nom']}</b>", styles['Heading2']))
        story.append(Paragraph(f"{participant.get('fonction', '')}", styles['Normal']))
        story.append(Paragraph(f"{session['entreprise_nom']}", styles['Normal']))
        story.append(Spacer(1, 1*cm))
        
        # Corps
        corps_text = f"""
        Madame, Monsieur,<br/><br/>
        
        Nous avons le plaisir de vous convoquer à la formation suivante :<br/><br/>
        
        <b>Formation :</b> {session['formation_titre']}<br/>
        <b>Dates :</b> Du {self.format_date(session['date_debut'])} au {self.format_date(session['date_fin'])}<br/>
        <b>Horaires :</b> De {session.get('horaire_debut', '09:00')} à {session.get('horaire_fin', '17:00')}<br/>
        <b>Durée :</b> {session['formation_duree']} heures<br/>
        <b>Lieu :</b> {session['lieu']}<br/>
        <b>Formateur :</b> {session.get('formateur_prenom', '')} {session.get('formateur_nom', 'À confirmer')}<br/><br/>
        
        Merci de vous présenter 15 minutes avant le début de la formation avec une pièce d'identité.<br/><br/>
        
        Pour toute question, n'hésitez pas à nous contacter :<br/>
        Email : {organisme['email']}<br/>
        Téléphone : {organisme['telephone']}<br/><br/>
        
        Nous vous souhaitons une excellente formation.<br/><br/>
        
        Cordialement,<br/>
        <b>{organisme['representant_legal_prenom']} {organisme['representant_legal_nom']}</b><br/>
        {organisme['representant_legal_fonction']}
        """
        story.append(Paragraph(corps_text, styles['Normal']))
        
        doc.build(story)
        return filename
    
    # ============================================
    # 5. FEUILLE D'ÉMARGEMENT
    # ============================================
    
    def generer_feuille_emargement(self, session_id: str, date_emargement: str = None) -> str:
        """Génère une feuille d'émargement pour une session"""
        session = self.get_session_data(session_id)
        organisme = self.get_organisme_data()
        participants = self.get_participants(session_id)
        
        if not date_emargement:
            date_emargement = session['date_debut']
        
        filename = f"{self.output_dir}/feuille_emargement_{session_id}_{date_emargement}.pdf"
        doc = SimpleDocTemplate(filename, pagesize=A4)
        story = []
        styles = getSampleStyleSheet()
        
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=14,
            textColor=colors.HexColor('#003366'),
            spaceAfter=20,
            alignment=TA_CENTER
        )
        
        # En-tête
        story.append(Paragraph(f"<b>FEUILLE D'ÉMARGEMENT</b>", title_style))
        story.append(Spacer(1, 0.3*cm))
        
        # Informations
        infos_text = f"""
        <b>Formation :</b> {session['formation_titre']}<br/>
        <b>Date :</b> {self.format_date(date_emargement)}<br/>
        <b>Lieu :</b> {session['lieu']}<br/>
        <b>Formateur :</b> {session.get('formateur_prenom', '')} {session.get('formateur_nom', '')}
        """
        story.append(Paragraph(infos_text, styles['Normal']))
        story.append(Spacer(1, 0.5*cm))
        
        # Tableau d'émargement
        emargement_data = [
            ['N°', 'Nom', 'Prénom', 'Signature Matin', 'Signature Après-midi']
        ]
        
        for i, participant in enumerate(participants, 1):
            emargement_data.append([
                str(i),
                participant['nom'],
                participant['prenom'],
                '',  # Espace pour signature matin
                ''   # Espace pour signature après-midi
            ])
        
        # Ligne formateur
        emargement_data.append([
            'Formateur',
            session.get('formateur_nom', ''),
            session.get('formateur_prenom', ''),
            '',
            ''
        ])
        
        table = Table(emargement_data, colWidths=[1.5*cm, 5*cm, 5*cm, 4*cm, 4*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#003366')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
            ('FONTNAME', (0, -1), (0, -1), 'Helvetica-Bold')
        ]))
        story.append(table)
        story.append(Spacer(1, 0.5*cm))
        
        # Horaires
        horaires_text = f"""
        <b>Horaires :</b><br/>
        Matin : {session.get('horaire_debut', '09:00')} - {session.get('horaire_pause_debut', '12:00')}<br/>
        Après-midi : {session.get('horaire_pause_fin', '13:00')} - {session.get('horaire_fin', '17:00')}
        """
        story.append(Paragraph(horaires_text, styles['Normal']))
        
        doc.build(story)
        return filename
    
    # ============================================
    # 6. CERTIFICAT DE RÉALISATION
    # ============================================
    
    def generer_certificat_realisation(self, session_id: str, participant_id: str) -> str:
        """Génère un certificat de réalisation pour un participant"""
        session = self.get_session_data(session_id)
        organisme = self.get_organisme_data()
        
        # Récupérer les données du participant
        response = self.supabase.table('participants').select('*').eq('id', participant_id).execute()
        if not response.data:
            raise ValueError(f"Participant {participant_id} non trouvé")
        participant = response.data[0]
        
        filename = f"{self.output_dir}/certificat_realisation_{participant_id}.pdf"
        doc = SimpleDocTemplate(filename, pagesize=A4)
        story = []
        styles = getSampleStyleSheet()
        
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=20,
            textColor=colors.HexColor('#003366'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        subtitle_style = ParagraphStyle(
            'Subtitle',
            parent=styles['Normal'],
            fontSize=14,
            alignment=TA_CENTER,
            spaceAfter=20
        )
        
        # Espacements
        story.append(Spacer(1, 2*cm))
        
        # Titre
        story.append(Paragraph("<b>CERTIFICAT DE RÉALISATION</b>", title_style))
        story.append(Paragraph(f"(Article L. 6353-1 du Code du travail)", subtitle_style))
        story.append(Spacer(1, 1*cm))
        
        # Corps
        corps_text = f"""
        <para alignment="center">
        <b>{organisme['raison_sociale']}</b><br/>
        Organisme de formation enregistré sous le numéro {organisme['numero_declaration_activite']}<br/>
        SIRET : {organisme['siret']}<br/><br/>
        
        <font size="12"><b>CERTIFIE QUE</b></font><br/><br/>
        
        <font size="14"><b>{participant['prenom']} {participant['nom']}</b></font><br/>
        {participant.get('fonction', '')}<br/>
        {session['entreprise_nom']}<br/><br/>
        
        <font size="12"><b>A SUIVI LA FORMATION</b></font><br/><br/>
        
        <font size="14"><b>{session['formation_titre']}</b></font><br/><br/>
        
        D'une durée de <b>{session['formation_duree']} heures</b><br/>
        Du {self.format_date(session['date_debut'])} au {self.format_date(session['date_fin'])}<br/>
        À {session['lieu']}<br/><br/>
        
        <b>Objectifs de la formation :</b><br/>
        {session.get('formation_objectifs', 'Voir programme détaillé')}<br/><br/>
        
        Fait à {organisme['ville']}, le {datetime.now().strftime('%d/%m/%Y')}<br/><br/>
        
        <b>{organisme['representant_legal_prenom']} {organisme['representant_legal_nom']}</b><br/>
        {organisme['representant_legal_fonction']}<br/>
        Signature et cachet
        </para>
        """
        story.append(Paragraph(corps_text, styles['Normal']))
        
        doc.build(story)
        return filename
    
    # ============================================
    # MÉTHODE PRINCIPALE : GÉNÉRER TOUS LES DOCUMENTS
    # ============================================
    
    def generer_tous_documents_session(self, session_id: str) -> Dict[str, List[str]]:
        """
        Génère tous les documents pour une session
        
        Returns:
            Dict avec les chemins des fichiers générés par type
        """
        documents_generes = {
            'proposition': [],
            'convention': [],
            'programme': [],
            'convocations': [],
            'emargements': [],
            'certificats': []
        }
        
        try:
            # 1. Proposition de formation
            documents_generes['proposition'].append(
                self.generer_proposition_formation(session_id)
            )
            
            # 2. Convention de formation
            documents_generes['convention'].append(
                self.generer_convention_formation(session_id)
            )
            
            # 3. Programme de formation
            documents_generes['programme'].append(
                self.generer_programme_formation(session_id)
            )
            
            # 4. Convocations (une par participant)
            participants = self.get_participants(session_id)
            for participant in participants:
                documents_generes['convocations'].append(
                    self.generer_convocation(session_id, participant['id'])
                )
            
            # 5. Feuilles d'émargement
            session = self.get_session_data(session_id)
            documents_generes['emargements'].append(
                self.generer_feuille_emargement(session_id, session['date_debut'])
            )
            
            # 6. Certificats (générés après la formation)
            # Note: À générer uniquement quand la session est terminée
            
            return documents_generes
            
        except Exception as e:
            print(f"Erreur lors de la génération des documents: {str(e)}")
            raise
    
    # ============================================
    # MÉTHODES PAR PHASE
    # ============================================
    
    def generer_phase_proposition(self, session_id: str) -> Dict[str, str]:
        """
        PHASE 2 : Génère la proposition commerciale + programme
        
        Returns:
            Dict avec les chemins des fichiers générés
        """
        try:
            proposition_path = self.generer_proposition_formation(session_id)
            programme_path = self.generer_programme_formation(session_id)
            
            return {
                'success': True,
                'proposition': proposition_path,
                'programme': programme_path
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }


# ============================================
# CLI - APPEL EN LIGNE DE COMMANDE
# ============================================

if __name__ == "__main__":
    import sys
    from supabase import create_client
    import os
    from dotenv import load_dotenv
    
    # Charger les variables d'environnement
    load_dotenv()
    
    # Configuration Supabase
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_KEY')
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print(json.dumps({
            'success': False,
            'error': 'Variables d\'environnement SUPABASE_URL et SUPABASE_KEY manquantes'
        }))
        sys.exit(1)
    
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    generator = QualiopisDocumentGenerator(supabase)
    
    # Vérifier les arguments
    if len(sys.argv) < 3:
        print(json.dumps({
            'success': False,
            'error': 'Usage: python documentGenerator.py <methode> <session_id> [participant_id]'
        }))
        sys.exit(1)
    
    methode = sys.argv[1]
    session_id = sys.argv[2]
    participant_id = sys.argv[3] if len(sys.argv) > 3 else None
    
    try:
        # Router vers la bonne méthode
        if methode == 'generer_phase_proposition':
            result = generator.generer_phase_proposition(session_id)
            print(json.dumps(result))
        
        elif methode == 'generer_proposition':
            filepath = generator.generer_proposition_formation(session_id)
            print(json.dumps({'success': True, 'filePath': filepath}))
        
        elif methode == 'generer_programme':
            filepath = generator.generer_programme_formation(session_id)
            print(json.dumps({'success': True, 'filePath': filepath}))
        
        elif methode == 'generer_convention':
            filepath = generator.generer_convention_formation(session_id)
            print(json.dumps({'success': True, 'filePath': filepath}))
        
        elif methode == 'generer_convocation':
            if not participant_id:
                print(json.dumps({'success': False, 'error': 'participant_id requis'}))
                sys.exit(1)
            filepath = generator.generer_convocation(session_id, participant_id)
            print(json.dumps({'success': True, 'filePath': filepath}))
        
        elif methode == 'generer_certificat':
            if not participant_id:
                print(json.dumps({'success': False, 'error': 'participant_id requis'}))
                sys.exit(1)
            filepath = generator.generer_certificat_realisation(session_id, participant_id)
            print(json.dumps({'success': True, 'filePath': filepath}))
        
        elif methode == 'generer_feuille_emargement':
            filepath = generator.generer_feuille_emargement(session_id)
            print(json.dumps({'success': True, 'filePath': filepath}))
        
        elif methode == 'generer_tous_documents_session':
            documents = generator.generer_tous_documents_session(session_id)
            print(json.dumps({'success': True, 'documents': documents}))
        
        else:
            print(json.dumps({
                'success': False,
                'error': f'Méthode inconnue: {methode}'
            }))
            sys.exit(1)
    
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)
