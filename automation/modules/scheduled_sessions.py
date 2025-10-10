#!/usr/bin/env python3
"""
Module de gestion des sessions planifiées
Ce module gère le traitement des sessions de formation planifiées, incluant :
- La génération des convocations
- L'envoi des emails aux participants
- La gestion des rappels avant la formation
- La mise à jour du statut des sessions
"""

import os
import sys
import logging
from pathlib import Path
from datetime import datetime, timedelta

# Ajouter le répertoire parent au path pour pouvoir importer les modules
sys.path.append(str(Path(__file__).parent.parent.parent))

# Importer les modules utilitaires
from automation.utils.supabase_client import get_supabase_client
from automation.utils.email_client import get_email_client
from automation.utils.pdf_generator import get_pdf_generator

# Configurer le logging
logger = logging.getLogger(__name__)

class ScheduledSessionsProcessor:
    """
    Processeur pour les sessions planifiées
    """
    
    def __init__(self):
        """
        Initialise le processeur avec les clients nécessaires
        """
        self.supabase = get_supabase_client()
        self.email = get_email_client()
        self.pdf = get_pdf_generator()
    
    def send_invitations(self, session_id):
        """
        Envoie les convocations pour une session spécifique
        
        Args:
            session_id (str): ID de la session à traiter
            
        Returns:
            bool: True si l'envoi a réussi, False sinon
        """
        try:
            # Récupérer les détails de la session
            session = self.supabase.get_session_by_id(session_id)
            
            if not session:
                logger.error(f"Session {session_id} non trouvée")
                return False
                
            if session.get("statut") != "confirmee":
                logger.warning(f"Session {session_id} n'est pas au statut 'confirmee' (statut actuel: {session.get('statut')})")
                return False
            
            # Récupérer les détails de l'entreprise et de la formation
            entreprise = self.supabase.get_entreprise_by_id(session["entreprise_id"])
            formation = self.supabase.get_formation_by_id(session["formation_catalogue_id"])
            
            if not entreprise or not formation:
                logger.error(f"Données manquantes pour la session {session_id}")
                return False
            
            # Vérifier si la date de début est dans moins de 7 jours
            date_debut = datetime.strptime(session["date_debut"], "%Y-%m-%d")
            today = datetime.now()
            
            if (date_debut - today).days > 7:
                logger.info(f"Session {session_id} pas encore à 7 jours de son début, convocation non envoyée")
                return False
            
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
                self.supabase.update_session_status(session_id, "convoquee")
                
                # Mettre à jour les métadonnées de la session
                metadata = session.get("metadata", {}) or {}
                metadata["date_envoi_convocation"] = datetime.now().isoformat()
                
                self.supabase.update_session_metadata(session_id, metadata)
                
                logger.info(f"Session {session_id} convoquée avec succès")
                return True
            else:
                logger.warning(f"Pas d'email de contact pour l'entreprise {entreprise['id']}")
                return False
                
        except Exception as e:
            logger.error(f"Erreur lors de l'envoi des convocations pour la session {session_id}: {str(e)}")
            return False
    
    def send_reminders(self, session_id, days_before=2):
        """
        Envoie des rappels pour une session spécifique
        
        Args:
            session_id (str): ID de la session à traiter
            days_before (int): Nombre de jours avant la formation pour envoyer le rappel
            
        Returns:
            bool: True si l'envoi a réussi, False sinon
        """
        try:
            # Récupérer les détails de la session
            session = self.supabase.get_session_by_id(session_id)
            
            if not session:
                logger.error(f"Session {session_id} non trouvée")
                return False
                
            if session.get("statut") != "convoquee":
                logger.warning(f"Session {session_id} n'est pas au statut 'convoquee' (statut actuel: {session.get('statut')})")
                return False
            
            # Récupérer les détails de l'entreprise et de la formation
            entreprise = self.supabase.get_entreprise_by_id(session["entreprise_id"])
            formation = self.supabase.get_formation_by_id(session["formation_catalogue_id"])
            
            if not entreprise or not formation:
                logger.error(f"Données manquantes pour la session {session_id}")
                return False
            
            # Vérifier si la date de début est dans le nombre de jours spécifié
            date_debut = datetime.strptime(session["date_debut"], "%Y-%m-%d")
            today = datetime.now()
            
            if (date_debut - today).days != days_before:
                logger.info(f"Session {session_id} pas à {days_before} jours de son début, rappel non envoyé")
                return False
            
            # Vérifier si un rappel a déjà été envoyé
            metadata = session.get("metadata", {}) or {}
            if metadata.get(f"rappel_{days_before}_jours_envoye"):
                logger.info(f"Rappel à {days_before} jours déjà envoyé pour la session {session_id}")
                return False
            
            # Envoyer l'email de rappel
            if entreprise.get("contact_email"):
                self.email.send_email(
                    to=entreprise["contact_email"],
                    subject=f"Rappel : Formation {formation['titre']} dans {days_before} jours",
                    html_content=f"""
                    <html>
                    <body>
                        <h2>Rappel de formation</h2>
                        <p>Bonjour,</p>
                        <p>Nous vous rappelons que votre formation aura lieu dans {days_before} jours :</p>
                        <ul>
                            <li><strong>Formation :</strong> {formation['titre']}</li>
                            <li><strong>Date :</strong> {session['date_debut']}</li>
                            <li><strong>Lieu :</strong> {session.get('lieu') or 'À définir'}</li>
                            <li><strong>Horaires :</strong> {session.get('horaires') or '9h00 - 17h00'}</li>
                        </ul>
                        <p>N'hésitez pas à nous contacter si vous avez des questions.</p>
                        <p>Cordialement,</p>
                        <p>L'équipe Automate Formation</p>
                    </body>
                    </html>
                    """
                )
                
                # Mettre à jour les métadonnées de la session
                metadata[f"rappel_{days_before}_jours_envoye"] = datetime.now().isoformat()
                self.supabase.update_session_metadata(session_id, metadata)
                
                logger.info(f"Rappel à {days_before} jours envoyé pour la session {session_id}")
                return True
            else:
                logger.warning(f"Pas d'email de contact pour l'entreprise {entreprise['id']}")
                return False
                
        except Exception as e:
            logger.error(f"Erreur lors de l'envoi du rappel pour la session {session_id}: {str(e)}")
            return False
    
    def check_session_readiness(self, session_id):
        """
        Vérifie si une session est prête à démarrer et envoie une notification au formateur
        
        Args:
            session_id (str): ID de la session à vérifier
            
        Returns:
            bool: True si la vérification a réussi, False sinon
        """
        try:
            # Récupérer les détails de la session
            session = self.supabase.get_session_by_id(session_id)
            
            if not session:
                logger.error(f"Session {session_id} non trouvée")
                return False
                
            if session.get("statut") != "convoquee":
                logger.warning(f"Session {session_id} n'est pas au statut 'convoquee' (statut actuel: {session.get('statut')})")
                return False
            
            # Récupérer les détails de l'entreprise et de la formation
            entreprise = self.supabase.get_entreprise_by_id(session["entreprise_id"])
            formation = self.supabase.get_formation_by_id(session["formation_catalogue_id"])
            
            if not entreprise or not formation:
                logger.error(f"Données manquantes pour la session {session_id}")
                return False
            
            # Vérifier si la date de début est demain
            date_debut = datetime.strptime(session["date_debut"], "%Y-%m-%d")
            tomorrow = datetime.now() + timedelta(days=1)
            
            if date_debut.date() != tomorrow.date():
                logger.info(f"Session {session_id} ne commence pas demain, vérification non effectuée")
                return False
            
            # Vérifier si un formateur est assigné
            if not session.get("formateur_id") and not session.get("formateur_email"):
                logger.warning(f"Pas de formateur assigné pour la session {session_id}")
                
                # Envoyer une alerte à l'administrateur
                admin_email = os.environ.get("ADMIN_EMAIL")
                if admin_email:
                    self.email.send_email(
                        to=admin_email,
                        subject=f"ALERTE : Session {session_id} sans formateur assigné",
                        html_content=f"""
                        <html>
                        <body>
                            <h2>Alerte : Session sans formateur</h2>
                            <p>La session suivante commence demain mais n'a pas de formateur assigné :</p>
                            <ul>
                                <li><strong>ID Session :</strong> {session_id}</li>
                                <li><strong>Formation :</strong> {formation['titre']}</li>
                                <li><strong>Entreprise :</strong> {entreprise['nom']}</li>
                                <li><strong>Date :</strong> {session['date_debut']}</li>
                            </ul>
                            <p>Veuillez assigner un formateur dès que possible.</p>
                        </body>
                        </html>
                        """
                    )
                    
                    logger.info(f"Alerte envoyée pour la session {session_id} sans formateur")
                
                return False
            
            # Envoyer une notification au formateur
            formateur_email = session.get("formateur_email")
            if formateur_email:
                self.email.send_email(
                    to=formateur_email,
                    subject=f"Préparation : Formation {formation['titre']} demain",
                    html_content=f"""
                    <html>
                    <body>
                        <h2>Préparation de formation</h2>
                        <p>Bonjour,</p>
                        <p>Nous vous rappelons que vous animez une formation demain :</p>
                        <ul>
                            <li><strong>Formation :</strong> {formation['titre']}</li>
                            <li><strong>Entreprise :</strong> {entreprise['nom']}</li>
                            <li><strong>Date :</strong> {session['date_debut']}</li>
                            <li><strong>Lieu :</strong> {session.get('lieu') or 'À définir'}</li>
                            <li><strong>Nombre de participants :</strong> {session['nombre_participants']}</li>
                        </ul>
                        <p>Veuillez vous assurer que vous avez tout le matériel nécessaire.</p>
                        <p>Cordialement,</p>
                        <p>L'équipe Automate Formation</p>
                    </body>
                    </html>
                    """
                )
                
                # Mettre à jour les métadonnées de la session
                metadata = session.get("metadata", {}) or {}
                metadata["notification_formateur_envoyee"] = datetime.now().isoformat()
                self.supabase.update_session_metadata(session_id, metadata)
                
                logger.info(f"Notification envoyée au formateur pour la session {session_id}")
                return True
            else:
                logger.warning(f"Pas d'email de formateur pour la session {session_id}")
                return False
                
        except Exception as e:
            logger.error(f"Erreur lors de la vérification de la session {session_id}: {str(e)}")
            return False
    
    def process_all_confirmed_sessions(self):
        """
        Traite toutes les sessions confirmées pour envoyer les convocations
        
        Returns:
            dict: Statistiques sur le traitement
        """
        logger.info("Traitement des sessions confirmées...")
        
        # Récupérer les sessions avec statut "confirmee"
        sessions = self.supabase.get_sessions({"statut": "confirmee"})
        
        if not sessions:
            logger.info("Aucune session confirmée à traiter")
            return {"total": 0, "success": 0, "failed": 0}
        
        logger.info(f"Traitement de {len(sessions)} sessions confirmées")
        
        stats = {"total": len(sessions), "success": 0, "failed": 0}
        
        for session in sessions:
            success = self.send_invitations(session["id"])
            if success:
                stats["success"] += 1
            else:
                stats["failed"] += 1
        
        logger.info(f"Traitement terminé: {stats['success']} réussites, {stats['failed']} échecs")
        return stats
    
    def process_all_upcoming_sessions(self):
        """
        Traite toutes les sessions à venir pour envoyer les rappels
        
        Returns:
            dict: Statistiques sur le traitement
        """
        logger.info("Traitement des sessions à venir...")
        
        # Récupérer les sessions avec statut "convoquee"
        sessions = self.supabase.get_sessions({"statut": "convoquee"})
        
        if not sessions:
            logger.info("Aucune session à venir à traiter")
            return {"total": 0, "reminders_sent": 0, "readiness_checked": 0}
        
        logger.info(f"Traitement de {len(sessions)} sessions à venir")
        
        stats = {"total": len(sessions), "reminders_sent": 0, "readiness_checked": 0}
        
        for session in sessions:
            # Envoyer des rappels à 2 jours
            if self.send_reminders(session["id"], days_before=2):
                stats["reminders_sent"] += 1
            
            # Vérifier la préparation des sessions de demain
            if self.check_session_readiness(session["id"]):
                stats["readiness_checked"] += 1
        
        logger.info(f"Traitement terminé: {stats['reminders_sent']} rappels envoyés, {stats['readiness_checked']} sessions vérifiées")
        return stats

def send_session_invitations(session_id):
    """
    Fonction utilitaire pour envoyer les convocations d'une session
    
    Args:
        session_id (str): ID de la session à traiter
        
    Returns:
        bool: True si l'envoi a réussi, False sinon
    """
    processor = ScheduledSessionsProcessor()
    return processor.send_invitations(session_id)

def send_session_reminders(session_id, days_before=2):
    """
    Fonction utilitaire pour envoyer les rappels d'une session
    
    Args:
        session_id (str): ID de la session à traiter
        days_before (int): Nombre de jours avant la formation pour envoyer le rappel
        
    Returns:
        bool: True si l'envoi a réussi, False sinon
    """
    processor = ScheduledSessionsProcessor()
    return processor.send_reminders(session_id, days_before)

def check_all_confirmed_sessions():
    """
    Fonction utilitaire pour traiter toutes les sessions confirmées
    
    Returns:
        dict: Statistiques sur le traitement
    """
    processor = ScheduledSessionsProcessor()
    return processor.process_all_confirmed_sessions()

def check_all_upcoming_sessions():
    """
    Fonction utilitaire pour traiter toutes les sessions à venir
    
    Returns:
        dict: Statistiques sur le traitement
    """
    processor = ScheduledSessionsProcessor()
    return processor.process_all_upcoming_sessions()

if __name__ == "__main__":
    # Configuration du logging pour l'exécution en standalone
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler("scheduled_sessions.log"),
            logging.StreamHandler()
        ]
    )
    
    # Exécuter le traitement de toutes les sessions
    stats_confirmed = check_all_confirmed_sessions()
    stats_upcoming = check_all_upcoming_sessions()
    
    print(f"Sessions confirmées: {stats_confirmed['success']}/{stats_confirmed['total']} convocations envoyées")
    print(f"Sessions à venir: {stats_upcoming['reminders_sent']} rappels envoyés, {stats_upcoming['readiness_checked']} sessions vérifiées")
