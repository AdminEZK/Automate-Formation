#!/usr/bin/env python3
"""
Module de traitement des nouvelles demandes de formation
Ce module gère le traitement des nouvelles demandes de formation, incluant :
- La génération des documents d'inscription
- L'envoi des emails de confirmation
- La mise à jour du statut des sessions
"""

import os
import sys
import logging
from pathlib import Path
from datetime import datetime

# Ajouter le répertoire parent au path pour pouvoir importer les modules
sys.path.append(str(Path(__file__).parent.parent.parent))

# Importer les modules utilitaires
from automation.utils.supabase_client import get_supabase_client
from automation.utils.email_client import get_email_client
from automation.utils.pdf_generator import get_pdf_generator

# Configurer le logging
logger = logging.getLogger(__name__)

class NewRequestsProcessor:
    """
    Processeur pour les nouvelles demandes de formation
    """
    
    def __init__(self):
        """
        Initialise le processeur avec les clients nécessaires
        """
        self.supabase = get_supabase_client()
        self.email = get_email_client()
        self.pdf = get_pdf_generator()
    
    def process_request(self, session_id):
        """
        Traite une demande spécifique par son ID
        
        Args:
            session_id (str): ID de la session à traiter
            
        Returns:
            bool: True si le traitement a réussi, False sinon
        """
        try:
            # Récupérer les détails de la session
            session = self.supabase.get_session_by_id(session_id)
            
            if not session:
                logger.error(f"Session {session_id} non trouvée")
                return False
                
            if session.get("statut") != "demande":
                logger.warning(f"Session {session_id} n'est pas au statut 'demande' (statut actuel: {session.get('statut')})")
                return False
            
            # Récupérer les détails de l'entreprise et de la formation
            entreprise = self.supabase.get_entreprise_by_id(session["entreprise_id"])
            formation = self.supabase.get_formation_by_id(session["formation_catalogue_id"])
            
            if not entreprise or not formation:
                logger.error(f"Données manquantes pour la session {session_id}")
                return False
            
            # Générer le bulletin d'inscription
            inscription_pdf = self.pdf.generate_registration_form(session, entreprise, formation)
            
            # Générer le devis si nécessaire
            devis_pdf = None
            if session.get("besoin_devis"):
                devis_pdf = self.pdf.generate_quote(session, entreprise, formation)
            
            # Préparer les pièces jointes
            attachments = [inscription_pdf]
            if devis_pdf:
                attachments.append(devis_pdf)
            
            # Envoyer l'email avec les documents
            if entreprise.get("contact_email"):
                # Construire le contenu de l'email
                devis_mention = "et le devis" if devis_pdf else ""
                
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
                            <li><strong>Lieu :</strong> {session.get('lieu') or 'À définir'}</li>
                        </ul>
                        <p>Veuillez trouver en pièce jointe le bulletin d'inscription {devis_mention} à nous retourner complété.</p>
                        <p>Pour toute question, n'hésitez pas à nous contacter.</p>
                        <p>Cordialement,</p>
                        <p>L'équipe Automate Formation</p>
                    </body>
                    </html>
                    """,
                    attachments=attachments
                )
                
                # Mettre à jour le statut de la session
                self.supabase.update_session_status(session_id, "en_attente")
                
                # Mettre à jour les métadonnées de la session
                metadata = session.get("metadata", {}) or {}
                metadata["date_envoi_inscription"] = datetime.now().isoformat()
                metadata["documents_envoyes"] = ["bulletin_inscription"]
                if devis_pdf:
                    metadata["documents_envoyes"].append("devis")
                
                self.supabase.update_session_metadata(session_id, metadata)
                
                logger.info(f"Session {session_id} traitée avec succès")
                return True
            else:
                logger.warning(f"Pas d'email de contact pour l'entreprise {entreprise['id']}")
                return False
                
        except Exception as e:
            logger.error(f"Erreur lors du traitement de la session {session_id}: {str(e)}")
            return False
    
    def process_all_pending_requests(self):
        """
        Traite toutes les demandes en attente
        
        Returns:
            dict: Statistiques sur le traitement (nombre total, réussites, échecs)
        """
        logger.info("Traitement des nouvelles demandes de formation...")
        
        # Récupérer les sessions avec statut "demande"
        sessions = self.supabase.get_sessions({"statut": "demande"})
        
        if not sessions:
            logger.info("Aucune nouvelle demande à traiter")
            return {"total": 0, "success": 0, "failed": 0}
        
        logger.info(f"Traitement de {len(sessions)} nouvelles demandes")
        
        stats = {"total": len(sessions), "success": 0, "failed": 0}
        
        for session in sessions:
            success = self.process_request(session["id"])
            if success:
                stats["success"] += 1
            else:
                stats["failed"] += 1
        
        logger.info(f"Traitement terminé: {stats['success']} réussites, {stats['failed']} échecs")
        return stats

def process_new_request(session_id):
    """
    Fonction utilitaire pour traiter une nouvelle demande
    
    Args:
        session_id (str): ID de la session à traiter
        
    Returns:
        bool: True si le traitement a réussi, False sinon
    """
    processor = NewRequestsProcessor()
    return processor.process_request(session_id)

def process_all_new_requests():
    """
    Fonction utilitaire pour traiter toutes les nouvelles demandes
    
    Returns:
        dict: Statistiques sur le traitement
    """
    processor = NewRequestsProcessor()
    return processor.process_all_pending_requests()

import wmill
import uuid
from datetime import datetime, timedelta
import json

async def main(
    entreprise_id=None,  # ID de l'entreprise (UUID)
    entreprise_nom=None,  # Nom de l'entreprise (si nouvelle entreprise)
    entreprise_email=None,  # Email de contact de l'entreprise
    entreprise_telephone=None,  # Téléphone de l'entreprise
    formation_catalogue_id=None,  # ID de la formation du catalogue
    formation_titre=None,  # Titre de la formation (si nouvelle formation)
    formation_duree=None,  # Durée en heures (si nouvelle formation)
    formation_prix_ht=None,  # Prix HT (si nouvelle formation)
    date_debut=None,  # Date de début souhaitée (format YYYY-MM-DD)
    date_fin=None,  # Date de fin souhaitée (format YYYY-MM-DD)
    lieu=None,  # Lieu de la formation
    nombre_participants=1,  # Nombre de participants prévus
    participants=None,  # Liste des participants au format [{nom, prenom, email, telephone, fonction}]
    notes=None,  # Notes supplémentaires
    envoyer_email_confirmation=True  # Envoyer un email de confirmation
):
    """
    Traite une nouvelle demande de formation
    
    Args:
        entreprise_id: ID de l'entreprise existante
        entreprise_nom: Nom de l'entreprise (si nouvelle)
        entreprise_email: Email de contact de l'entreprise
        entreprise_telephone: Téléphone de l'entreprise
        formation_catalogue_id: ID de la formation du catalogue
        formation_titre: Titre de la formation (si nouvelle)
        formation_duree: Durée en heures (si nouvelle formation)
        formation_prix_ht: Prix HT (si nouvelle formation)
        date_debut: Date de début souhaitée
        date_fin: Date de fin souhaitée
        lieu: Lieu de la formation
        nombre_participants: Nombre de participants prévus
        participants: Liste des participants
        notes: Notes supplémentaires
        envoyer_email_confirmation: Envoyer un email de confirmation
        
    Returns:
        Informations sur la demande créée
    """
    # Vérifier et récupérer l'entreprise
    if not entreprise_id and not entreprise_nom:
        raise ValueError("Vous devez spécifier soit un ID d'entreprise existante, soit un nom pour créer une nouvelle entreprise")
    
    if not entreprise_id:
        # Créer une nouvelle entreprise
        if not entreprise_email:
            raise ValueError("L'email de contact est requis pour créer une nouvelle entreprise")
        
        nouvelle_entreprise = {
            "nom": entreprise_nom,
            "email_contact": entreprise_email,
            "telephone": entreprise_telephone
        }
        
        # Insérer la nouvelle entreprise dans Supabase
        entreprise_id = str(uuid.uuid4())
        nouvelle_entreprise["id"] = entreprise_id
        
        # Ajouter les timestamps
        now = datetime.now().isoformat()
        nouvelle_entreprise["created_at"] = now
        nouvelle_entreprise["updated_at"] = now
        
        # Insérer dans Supabase via MCP
        await wmill.set_resource("supabase/entreprises", nouvelle_entreprise)
        
        print(f"Nouvelle entreprise créée: {entreprise_nom} (ID: {entreprise_id})")
    else:
        # Vérifier que l'entreprise existe
        entreprises = await wmill.get_resource("supabase/entreprises")
        entreprise_existante = next((e for e in entreprises if e["id"] == entreprise_id), None)
        
        if not entreprise_existante:
            raise ValueError(f"Entreprise avec ID {entreprise_id} non trouvée")
        
        entreprise_nom = entreprise_existante.get("nom")
        print(f"Entreprise existante: {entreprise_nom} (ID: {entreprise_id})")
    
    # Vérifier et récupérer la formation
    if not formation_catalogue_id and not formation_titre:
        raise ValueError("Vous devez spécifier soit un ID de formation existante, soit un titre pour créer une nouvelle formation")
    
    if not formation_catalogue_id:
        # Créer une nouvelle formation
        if not formation_duree or not formation_prix_ht:
            raise ValueError("La durée et le prix HT sont requis pour créer une nouvelle formation")
        
        nouvelle_formation = {
            "titre": formation_titre,
            "duree": formation_duree,
            "prix_ht": formation_prix_ht
        }
        
        # Insérer la nouvelle formation dans Supabase
        formation_catalogue_id = str(uuid.uuid4())
        nouvelle_formation["id"] = formation_catalogue_id
        
        # Ajouter les timestamps
        now = datetime.now().isoformat()
        nouvelle_formation["created_at"] = now
        nouvelle_formation["updated_at"] = now
        
        # Insérer dans Supabase via MCP
        await wmill.set_resource("supabase/formations_catalogue", nouvelle_formation)
        
        print(f"Nouvelle formation créée: {formation_titre} (ID: {formation_catalogue_id})")
    else:
        # Vérifier que la formation existe
        formations = await wmill.get_resource("supabase/formations_catalogue")
        formation_existante = next((f for f in formations if f["id"] == formation_catalogue_id), None)
        
        if not formation_existante:
            raise ValueError(f"Formation avec ID {formation_catalogue_id} non trouvée")
        
        formation_titre = formation_existante.get("titre")
        formation_prix_ht = formation_existante.get("prix_ht")
        formation_duree = formation_existante.get("duree")
        print(f"Formation existante: {formation_titre} (ID: {formation_catalogue_id})")
    
    # Calculer la date de fin si non spécifiée
    if date_debut and not date_fin and formation_duree:
        # Convertir la date de début en objet date
        debut_date = datetime.fromisoformat(date_debut)
        
        # Calculer la date de fin en fonction de la durée (en supposant des journées de 7h)
        jours_formation = (formation_duree + 6) // 7  # Arrondir au jour supérieur
        fin_date = debut_date + timedelta(days=jours_formation - 1)
        
        # Convertir en chaîne de caractères
        date_fin = fin_date.date().isoformat()
    
    # Calculer le prix total
    prix_total_ht = None
    if formation_prix_ht and nombre_participants:
        prix_total_ht = float(formation_prix_ht) * int(nombre_participants)
    
    # Créer la session de formation
    nouvelle_session = {
        "id": str(uuid.uuid4()),
        "formation_catalogue_id": formation_catalogue_id,
        "entreprise_id": entreprise_id,
        "date_debut": date_debut,
        "date_fin": date_fin,
        "lieu": lieu,
        "nombre_participants": nombre_participants,
        "statut": "demande",  # Statut initial
        "prix_total_ht": prix_total_ht,
        "notes": notes,
        "metadata": json.dumps({
            "date_demande": datetime.now().isoformat()
        })
    }
    
    # Ajouter les timestamps
    now = datetime.now().isoformat()
    nouvelle_session["created_at"] = now
    nouvelle_session["updated_at"] = now
    
    # Insérer dans Supabase via MCP
    await wmill.set_resource("supabase/sessions_formation", nouvelle_session)
    
    print(f"Nouvelle session de formation créée: {formation_titre} pour {entreprise_nom} (ID: {nouvelle_session['id']})")
    
    # Ajouter les participants si spécifiés
    if participants:
        for participant in participants:
            nouveau_participant = {
                "id": str(uuid.uuid4()),
                "session_formation_id": nouvelle_session["id"],
                "nom": participant.get("nom"),
                "prenom": participant.get("prenom"),
                "email": participant.get("email"),
                "telephone": participant.get("telephone"),
                "fonction": participant.get("fonction"),
                "present": None  # Présence non encore déterminée
            }
            
            # Ajouter les timestamps
            nouveau_participant["created_at"] = now
            nouveau_participant["updated_at"] = now
            
            # Insérer dans Supabase via MCP
            await wmill.set_resource("supabase/participants", nouveau_participant)
            
            print(f"Participant ajouté: {participant.get('prenom')} {participant.get('nom')}")
    
    # Envoyer un email de confirmation si demandé
    if envoyer_email_confirmation and entreprise_email:
        # Récupérer les détails pour l'email
        email_data = {
            "to": entreprise_email,
            "subject": f"Confirmation de demande de formation: {formation_titre}",
            "html": f"""
            <h1>Confirmation de demande de formation</h1>
            <p>Bonjour,</p>
            <p>Nous avons bien reçu votre demande de formation <strong>{formation_titre}</strong>.</p>
            <p><strong>Détails de la formation:</strong></p>
            <ul>
                <li>Date de début: {date_debut or 'À déterminer'}</li>
                <li>Date de fin: {date_fin or 'À déterminer'}</li>
                <li>Lieu: {lieu or 'À déterminer'}</li>
                <li>Nombre de participants: {nombre_participants}</li>
            </ul>
            <p>Nous vous contacterons prochainement pour confirmer les détails de cette formation.</p>
            <p>Cordialement,<br>L'équipe de formation</p>
            """
        }
        
        # Envoyer l'email via le service d'email configuré dans Windmill
        try:
            await wmill.run_script("email/send_email", email_data)
            print(f"Email de confirmation envoyé à {entreprise_email}")
        except Exception as e:
            print(f"Erreur lors de l'envoi de l'email: {str(e)}")
    
    # Retourner les informations sur la demande créée
    return {
        "success": True,
        "session_id": nouvelle_session["id"],
        "entreprise": {
            "id": entreprise_id,
            "nom": entreprise_nom
        },
        "formation": {
            "id": formation_catalogue_id,
            "titre": formation_titre
        },
        "date_debut": date_debut,
        "date_fin": date_fin,
        "statut": "demande",
        "email_envoye": envoyer_email_confirmation and entreprise_email is not None
    }

if __name__ == "__main__":
    # Configuration du logging pour l'exécution en standalone
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler("new_requests.log"),
            logging.StreamHandler()
        ]
    )
    
    # Exécuter le traitement de toutes les demandes
    stats = process_all_new_requests()
    print(f"Traitement terminé: {stats['success']}/{stats['total']} demandes traitées avec succès")
