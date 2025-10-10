#!/usr/bin/env python3
"""
Script principal d'automatisation pour Automate Formation
Ce script est conçu pour être exécuté par Windmill et orchestrer les différentes tâches
d'automatisation liées au processus de formation.
"""

import os
import sys
import logging
import argparse
from datetime import datetime, timedelta
from pathlib import Path

# Ajouter le répertoire parent au path pour pouvoir importer les modules
sys.path.append(str(Path(__file__).parent.parent))

# Importer les modules utilitaires
from automation.utils.supabase_client import get_supabase_client
from automation.utils.email_client import get_email_client
from automation.utils.pdf_generator import get_pdf_generator

# Configurer le logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("automation.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class AutomationOrchestrator:
    """
    Orchestrateur d'automatisation pour le processus de formation
    """
    
    def __init__(self):
        """
        Initialise l'orchestrateur avec les clients nécessaires
        """
        self.supabase = get_supabase_client()
        self.email = get_email_client()
        self.pdf = get_pdf_generator()
        
    def process_new_requests(self):
        """
        Traite les nouvelles demandes de formation
        - Génère les documents d'inscription
        - Envoie les emails de confirmation
        """
        logger.info("Traitement des nouvelles demandes de formation...")
        
        # Récupérer les sessions avec statut "demande"
        sessions = self.supabase.get_sessions({"statut": "demande"})
        
        if not sessions:
            logger.info("Aucune nouvelle demande à traiter")
            return
        
        logger.info(f"Traitement de {len(sessions)} nouvelles demandes")
        
        for session in sessions:
            try:
                # Récupérer les détails de l'entreprise et de la formation
                entreprise = self.supabase.get_entreprise_by_id(session["entreprise_id"])
                formation = self.supabase.get_formation_by_id(session["formation_catalogue_id"])
                
                if not entreprise or not formation:
                    logger.error(f"Données manquantes pour la session {session['id']}")
                    continue
                
                # Générer le bulletin d'inscription
                inscription_pdf = self.pdf.generate_registration_form(session, entreprise, formation)
                
                # Envoyer l'email avec le bulletin d'inscription
                if entreprise.get("contact_email"):
                    self.email.send_email(
                        to=entreprise["contact_email"],
                        subject=f"Demande de formation : {formation['titre']}",
                        html_content=f"""
                        <html>
                        <body>
                            <h2>Confirmation de votre demande de formation</h2>
                            <p>Bonjour,</p>
                            <p>Nous avons bien reçu votre demande de formation :</p>
                            <ul>
                                <li><strong>Formation :</strong> {formation['titre']}</li>
                                <li><strong>Date souhaitée :</strong> {session['date_debut']}</li>
                                <li><strong>Nombre de participants :</strong> {session['nombre_participants']}</li>
                            </ul>
                            <p>Veuillez trouver en pièce jointe le bulletin d'inscription à nous retourner complété.</p>
                            <p>Cordialement,</p>
                            <p>L'équipe Automate Formation</p>
                        </body>
                        </html>
                        """,
                        attachments=[inscription_pdf]
                    )
                    
                    # Mettre à jour le statut de la session
                    self.supabase.update_session_status(session["id"], "en_attente")
                    logger.info(f"Session {session['id']} traitée avec succès")
                else:
                    logger.warning(f"Pas d'email de contact pour l'entreprise {entreprise['id']}")
                
            except Exception as e:
                logger.error(f"Erreur lors du traitement de la session {session['id']}: {str(e)}")
    
    def process_scheduled_sessions(self):
        """
        Traite les sessions planifiées
        - Génère les convocations
        - Envoie les emails aux participants
        """
        logger.info("Traitement des sessions planifiées...")
        
        # Récupérer les sessions avec statut "confirmee"
        sessions = self.supabase.get_sessions({"statut": "confirmee"})
        
        if not sessions:
            logger.info("Aucune session planifiée à traiter")
            return
        
        logger.info(f"Traitement de {len(sessions)} sessions planifiées")
        
        for session in sessions:
            try:
                # Vérifier si la date de début est dans moins de 7 jours
                date_debut = datetime.strptime(session["date_debut"], "%Y-%m-%d")
                today = datetime.now()
                
                if (date_debut - today).days > 7:
                    logger.info(f"Session {session['id']} pas encore à 7 jours de son début")
                    continue
                
                # Récupérer les détails de l'entreprise et de la formation
                entreprise = self.supabase.get_entreprise_by_id(session["entreprise_id"])
                formation = self.supabase.get_formation_by_id(session["formation_catalogue_id"])
                
                if not entreprise or not formation:
                    logger.error(f"Données manquantes pour la session {session['id']}")
                    continue
                
                # Générer la convocation
                convocation_pdf = self.pdf.generate_invitation(session, entreprise, formation)
                
                # Envoyer l'email avec la convocation
                if entreprise.get("contact_email"):
                    self.email.send_formation_invitation(
                        session=session,
                        entreprise=entreprise,
                        formation=formation,
                        contact_email=entreprise["contact_email"],
                        attachments=[convocation_pdf]
                    )
                    
                    # Mettre à jour le statut de la session
                    self.supabase.update_session_status(session["id"], "convoquee")
                    logger.info(f"Session {session['id']} convoquée avec succès")
                else:
                    logger.warning(f"Pas d'email de contact pour l'entreprise {entreprise['id']}")
                
            except Exception as e:
                logger.error(f"Erreur lors du traitement de la session {session['id']}: {str(e)}")
    
    def process_completed_sessions(self):
        """
        Traite les sessions terminées
        - Génère les certificats de réalisation
        - Envoie les formulaires d'évaluation
        """
        logger.info("Traitement des sessions terminées...")
        
        # Récupérer les sessions avec statut "terminee"
        sessions = self.supabase.get_sessions({"statut": "terminee"})
        
        if not sessions:
            logger.info("Aucune session terminée à traiter")
            return
        
        logger.info(f"Traitement de {len(sessions)} sessions terminées")
        
        for session in sessions:
            try:
                # Récupérer les détails de l'entreprise et de la formation
                entreprise = self.supabase.get_entreprise_by_id(session["entreprise_id"])
                formation = self.supabase.get_formation_by_id(session["formation_catalogue_id"])
                
                if not entreprise or not formation:
                    logger.error(f"Données manquantes pour la session {session['id']}")
                    continue
                
                # Générer le certificat de réalisation
                certificat_pdf = self.pdf.generate_certificate(session, entreprise, formation)
                
                # Générer le formulaire d'évaluation
                evaluation_pdf = self.pdf.generate_evaluation_form(session, entreprise, formation)
                
                # Envoyer l'email avec le certificat
                if entreprise.get("contact_email"):
                    self.email.send_formation_certificate(
                        session=session,
                        entreprise=entreprise,
                        formation=formation,
                        contact_email=entreprise["contact_email"],
                        certificate_path=certificat_pdf
                    )
                    
                    # Envoyer l'email avec le formulaire d'évaluation
                    self.email.send_evaluation_form(
                        session=session,
                        entreprise=entreprise,
                        formation=formation,
                        contact_email=entreprise["contact_email"]
                    )
                    
                    # Mettre à jour le statut de la session
                    self.supabase.update_session_status(session["id"], "archivee")
                    logger.info(f"Session {session['id']} archivée avec succès")
                else:
                    logger.warning(f"Pas d'email de contact pour l'entreprise {entreprise['id']}")
                
            except Exception as e:
                logger.error(f"Erreur lors du traitement de la session {session['id']}: {str(e)}")
    
    def check_upcoming_sessions(self):
        """
        Vérifie les sessions à venir et envoie des rappels
        """
        logger.info("Vérification des sessions à venir...")
        
        # Récupérer les sessions avec statut "convoquee"
        sessions = self.supabase.get_sessions({"statut": "convoquee"})
        
        if not sessions:
            logger.info("Aucune session à venir à vérifier")
            return
        
        logger.info(f"Vérification de {len(sessions)} sessions à venir")
        
        for session in sessions:
            try:
                # Vérifier si la date de début est dans moins de 2 jours
                date_debut = datetime.strptime(session["date_debut"], "%Y-%m-%d")
                today = datetime.now()
                
                if (date_debut - today).days > 2:
                    logger.info(f"Session {session['id']} pas encore à 2 jours de son début")
                    continue
                
                # Récupérer les détails de l'entreprise et de la formation
                entreprise = self.supabase.get_entreprise_by_id(session["entreprise_id"])
                formation = self.supabase.get_formation_by_id(session["formation_catalogue_id"])
                
                if not entreprise or not formation:
                    logger.error(f"Données manquantes pour la session {session['id']}")
                    continue
                
                # Envoyer l'email de rappel
                if entreprise.get("contact_email"):
                    self.email.send_email(
                        to=entreprise["contact_email"],
                        subject=f"Rappel : Formation {formation['titre']} dans 2 jours",
                        html_content=f"""
                        <html>
                        <body>
                            <h2>Rappel de formation</h2>
                            <p>Bonjour,</p>
                            <p>Nous vous rappelons que votre formation aura lieu dans 2 jours :</p>
                            <ul>
                                <li><strong>Formation :</strong> {formation['titre']}</li>
                                <li><strong>Date :</strong> {session['date_debut']}</li>
                                <li><strong>Lieu :</strong> {session['lieu'] or 'À définir'}</li>
                            </ul>
                            <p>Cordialement,</p>
                            <p>L'équipe Automate Formation</p>
                        </body>
                        </html>
                        """
                    )
                    
                    logger.info(f"Rappel envoyé pour la session {session['id']}")
                else:
                    logger.warning(f"Pas d'email de contact pour l'entreprise {entreprise['id']}")
                
            except Exception as e:
                logger.error(f"Erreur lors de la vérification de la session {session['id']}: {str(e)}")
    
    def run_all_tasks(self):
        """
        Exécute toutes les tâches d'automatisation
        """
        logger.info("Démarrage de l'automatisation complète...")
        
        self.process_new_requests()
        self.process_scheduled_sessions()
        self.process_completed_sessions()
        self.check_upcoming_sessions()
        
        logger.info("Automatisation terminée avec succès")

def main():
    """
    Fonction principale
    """
    parser = argparse.ArgumentParser(description="Automatisation des processus de formation")
    parser.add_argument("--task", choices=["all", "new_requests", "scheduled", "completed", "upcoming"], 
                        default="all", help="Tâche spécifique à exécuter")
    
    args = parser.parse_args()
    
    orchestrator = AutomationOrchestrator()
    
    if args.task == "all":
        orchestrator.run_all_tasks()
    elif args.task == "new_requests":
        orchestrator.process_new_requests()
    elif args.task == "scheduled":
        orchestrator.process_scheduled_sessions()
    elif args.task == "completed":
        orchestrator.process_completed_sessions()
    elif args.task == "upcoming":
        orchestrator.check_upcoming_sessions()

if __name__ == "__main__":
    main()
