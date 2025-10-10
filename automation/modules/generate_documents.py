import wmill
import uuid
import base64
from datetime import datetime
import json
import os
import sys
from pathlib import Path

# Ajouter le répertoire parent au path pour pouvoir importer les modules
sys.path.append(str(Path(__file__).parent.parent))

from utils.supabase_client import get_supabase_client

async def main(
    session_id,  # ID de la session de formation (UUID)
    type_document="convocation",  # Type de document à générer: convocation, certificat, evaluation
    participant_id=None,  # ID du participant (pour les documents individuels)
    inclure_tous_participants=False,  # Générer pour tous les participants
    envoyer_email=False,  # Envoyer par email
    sauvegarder_supabase=True  # Sauvegarder dans Supabase
):
    """
    Génère des documents pour une session de formation
    
    Args:
        session_id: ID de la session de formation
        type_document: Type de document à générer (convocation, certificat, evaluation)
        participant_id: ID du participant (pour les documents individuels)
        inclure_tous_participants: Générer pour tous les participants
        envoyer_email: Envoyer par email
        sauvegarder_supabase: Sauvegarder dans Supabase
        
    Returns:
        Informations sur les documents générés
    """
    # Vérifier les paramètres
    if not session_id:
        raise ValueError("L'ID de la session de formation est requis")
    
    if participant_id and inclure_tous_participants:
        raise ValueError("Vous ne pouvez pas spécifier à la fois un participant spécifique et tous les participants")
    
    # Récupérer les informations de la session
    session = await get_session_details(session_id)
    
    if not session:
        raise ValueError(f"Session de formation avec ID {session_id} non trouvée")
    
    # Récupérer les participants
    participants = []
    if participant_id:
        # Récupérer un participant spécifique
        participant = await get_participant(participant_id)
        if not participant:
            raise ValueError(f"Participant avec ID {participant_id} non trouvé")
        participants = [participant]
    elif inclure_tous_participants:
        # Récupérer tous les participants
        participants = await get_session_participants(session_id)
    else:
        # Générer un document global pour la session
        participants = [None]  # Un seul document sans participant spécifique
    
    # Générer les documents pour chaque participant ou un document global
    documents_generes = []
    
    for participant in participants:
        document_info = await generate_document(
            session=session,
            participant=participant,
            type_document=type_document,
            envoyer_email=envoyer_email,
            sauvegarder_supabase=sauvegarder_supabase
        )
        documents_generes.append(document_info)
    
    # Retourner les informations sur les documents générés
    return {
        "success": True,
        "session": {
            "id": session_id,
            "titre": session.get("formation_titre"),
            "entreprise": session.get("entreprise_nom")
        },
        "type_document": type_document,
        "nombre_documents": len(documents_generes),
        "documents": documents_generes
    }

async def get_session_details(session_id):
    """
    Récupère les détails d'une session de formation avec les informations liées
    """
    try:
        # Utiliser la vue qui joint les tables sessions, formations et entreprises
        vue_sessions = await wmill.get_resource("supabase/vue_sessions_formation")
        session = next((s for s in vue_sessions if s["id"] == session_id), None)
        
        if not session:
            return None
        
        return session
    except Exception as e:
        print(f"Erreur lors de la récupération des détails de la session: {str(e)}")
        return None

async def get_participant(participant_id):
    """
    Récupère les informations d'un participant
    """
    try:
        participants = await wmill.get_resource("supabase/participants")
        participant = next((p for p in participants if p["id"] == participant_id), None)
        return participant
    except Exception as e:
        print(f"Erreur lors de la récupération du participant: {str(e)}")
        return None

async def get_session_participants(session_id):
    """
    Récupère tous les participants d'une session
    """
    try:
        participants = await wmill.get_resource("supabase/participants")
        session_participants = [p for p in participants if p["session_formation_id"] == session_id]
        return session_participants
    except Exception as e:
        print(f"Erreur lors de la récupération des participants: {str(e)}")
        return []

async def generate_document(session, participant, type_document, envoyer_email, sauvegarder_supabase):
    """
    Génère un document pour une session et un participant
    """
    try:
        # Préparer les données pour le document
        document_data = prepare_document_data(session, participant, type_document)
        
        # Appeler le service de génération de document via Node.js
        document_buffer = None
        document_filename = None
        
        if type_document == "convocation":
            # Générer une convocation
            document_filename = f"Convocation_{session['formation_titre']}_{datetime.now().strftime('%Y%m%d')}.pdf"
            if participant:
                document_filename = f"Convocation_{participant['nom']}_{participant['prenom']}_{datetime.now().strftime('%Y%m%d')}.pdf"
            
            # Appeler le service Node.js pour générer la convocation
            document_buffer = await wmill.run_script("documents/generate_invitation", document_data)
            
        elif type_document == "certificat":
            # Générer un certificat de réalisation
            if not participant:
                raise ValueError("Un participant est requis pour générer un certificat de réalisation")
            
            document_filename = f"Certificat_{participant['nom']}_{participant['prenom']}_{datetime.now().strftime('%Y%m%d')}.pdf"
            
            # Appeler le service Node.js pour générer le certificat
            document_buffer = await wmill.run_script("documents/generate_certificate", document_data)
            
        elif type_document == "evaluation":
            # Générer un formulaire d'évaluation
            document_filename = f"Evaluation_{session['formation_titre']}_{datetime.now().strftime('%Y%m%d')}.pdf"
            if participant:
                document_filename = f"Evaluation_{participant['nom']}_{participant['prenom']}_{datetime.now().strftime('%Y%m%d')}.pdf"
            
            # Appeler le service Node.js pour générer l'évaluation
            document_buffer = await wmill.run_script("documents/generate_evaluation", document_data)
            
        else:
            raise ValueError(f"Type de document non pris en charge: {type_document}")
        
        # Sauvegarder le document dans Supabase si demandé
        document_url = None
        if sauvegarder_supabase and document_buffer:
            document_url = await save_document_to_supabase(
                session_id=session["id"],
                participant_id=participant["id"] if participant else None,
                document_type=type_document,
                document_filename=document_filename,
                document_buffer=document_buffer
            )
        
        # Envoyer par email si demandé
        email_sent = False
        if envoyer_email and participant and participant.get("email") and document_buffer:
            email_sent = await send_document_by_email(
                email=participant["email"],
                nom=participant["nom"],
                prenom=participant["prenom"],
                type_document=type_document,
                document_filename=document_filename,
                document_buffer=document_buffer,
                formation_titre=session["formation_titre"]
            )
        
        # Retourner les informations sur le document généré
        return {
            "type": type_document,
            "filename": document_filename,
            "participant": {
                "id": participant["id"] if participant else None,
                "nom": participant["nom"] if participant else None,
                "prenom": participant["prenom"] if participant else None,
                "email": participant["email"] if participant else None
            } if participant else None,
            "url": document_url,
            "email_sent": email_sent
        }
    except Exception as e:
        print(f"Erreur lors de la génération du document: {str(e)}")
        return {
            "type": type_document,
            "error": str(e),
            "participant": {
                "id": participant["id"] if participant else None,
                "nom": participant["nom"] if participant else None,
                "prenom": participant["prenom"] if participant else None
            } if participant else None
        }

def prepare_document_data(session, participant, type_document):
    """
    Prépare les données pour la génération du document
    """
    # Données de base communes à tous les documents
    data = {
        "formationTitle": session.get("formation_titre", ""),
        "formationDate": format_date_range(session.get("date_debut"), session.get("date_fin")),
        "formationLocation": session.get("lieu", ""),
        "formationDuration": f"{session.get('formation_duree', 7)} heures",
        "formateur": session.get("formateur", "Responsable de formation"),
        "entreprise": session.get("entreprise_nom", ""),
        "city": "Paris"  # Valeur par défaut
    }
    
    # Ajouter les données du participant si disponible
    if participant:
        data.update({
            "firstName": participant.get("prenom", ""),
            "lastName": participant.get("nom", ""),
            "email": participant.get("email", ""),
            "fonction": participant.get("fonction", "")
        })
    
    # Données spécifiques selon le type de document
    if type_document == "convocation":
        data["formationHours"] = "9h00 - 17h00"  # Horaires par défaut
    
    return data

def format_date_range(date_debut, date_fin):
    """
    Formate une plage de dates pour affichage
    """
    if not date_debut:
        return "À déterminer"
    
    try:
        debut = datetime.fromisoformat(date_debut).strftime("%d/%m/%Y")
        
        if date_fin and date_fin != date_debut:
            fin = datetime.fromisoformat(date_fin).strftime("%d/%m/%Y")
            return f"Du {debut} au {fin}"
        else:
            return f"Le {debut}"
    except:
        return date_debut  # Retourner la date brute en cas d'erreur

async def save_document_to_supabase(session_id, participant_id, document_type, document_filename, document_buffer):
    """
    Sauvegarde un document dans Supabase Storage et ses métadonnées dans la table documents
    """
    try:
        # Créer un ID unique pour le document
        document_id = str(uuid.uuid4())
        
        # Obtenir le client Supabase
        supabase_client = get_supabase_client()
        
        # Définir le chemin du fichier dans le bucket
        # Format: sessions/{session_id}/{document_type}/{document_id}_{filename}
        storage_path = f"sessions/{session_id}/{document_type}/{document_id}_{document_filename}"
        
        # Upload le document vers Supabase Storage
        bucket_name = "documents"
        upload_result = supabase_client.upload_document(
            bucket_name=bucket_name,
            file_path=storage_path,
            file_data=document_buffer,
            content_type='application/pdf'
        )
        
        if not upload_result:
            print(f"Échec de l'upload du document vers Supabase Storage")
            return None
        
        # Obtenir l'URL signée du document
        document_url = supabase_client.get_document_url(bucket_name, storage_path)
        
        # Créer l'entrée de métadonnées dans la table documents
        document_metadata = {
            "id": document_id,
            "session_formation_id": session_id,
            "participant_id": participant_id,
            "type": document_type,
            "nom_fichier": document_filename,
            "storage_path": storage_path,
            "taille_fichier": len(document_buffer),
            "mime_type": "application/pdf",
            "metadata": {
                "uploaded_at": datetime.now().isoformat(),
                "bucket": bucket_name
            }
        }
        
        # Sauvegarder les métadonnées dans la table documents
        saved_metadata = supabase_client.save_document_metadata(document_metadata)
        
        if not saved_metadata:
            print(f"Échec de la sauvegarde des métadonnées du document")
            # Le fichier est uploadé mais les métadonnées n'ont pas été sauvegardées
            # On retourne quand même l'URL
        
        # Retourner l'URL du document
        return document_url if document_url else storage_path
    except Exception as e:
        print(f"Erreur lors de la sauvegarde du document dans Supabase: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

async def send_document_by_email(email, nom, prenom, type_document, document_filename, document_buffer, formation_titre):
    """
    Envoie un document par email
    """
    try:
        # Encoder le document en base64 pour l'envoi par email
        document_base64 = base64.b64encode(document_buffer).decode('utf-8')
        
        # Préparer le sujet et le contenu de l'email selon le type de document
        subject = ""
        html_content = ""
        
        if type_document == "convocation":
            subject = f"Convocation à la formation: {formation_titre}"
            html_content = f"""
            <h1>Convocation à une formation</h1>
            <p>Bonjour {prenom} {nom},</p>
            <p>Vous trouverez ci-joint votre convocation pour la formation <strong>{formation_titre}</strong>.</p>
            <p>Merci de confirmer votre présence.</p>
            <p>Cordialement,<br>L'équipe de formation</p>
            """
        elif type_document == "certificat":
            subject = f"Certificat de réalisation: {formation_titre}"
            html_content = f"""
            <h1>Certificat de réalisation</h1>
            <p>Bonjour {prenom} {nom},</p>
            <p>Vous trouverez ci-joint votre certificat de réalisation pour la formation <strong>{formation_titre}</strong>.</p>
            <p>Nous vous remercions pour votre participation.</p>
            <p>Cordialement,<br>L'équipe de formation</p>
            """
        elif type_document == "evaluation":
            subject = f"Évaluation de la formation: {formation_titre}"
            html_content = f"""
            <h1>Évaluation de formation</h1>
            <p>Bonjour {prenom} {nom},</p>
            <p>Vous trouverez ci-joint le formulaire d'évaluation pour la formation <strong>{formation_titre}</strong>.</p>
            <p>Merci de bien vouloir le compléter et nous le retourner.</p>
            <p>Cordialement,<br>L'équipe de formation</p>
            """
        
        # Préparer les données pour l'envoi d'email
        email_data = {
            "to": email,
            "subject": subject,
            "html": html_content,
            "attachments": [
                {
                    "filename": document_filename,
                    "content": document_base64,
                    "encoding": "base64"
                }
            ]
        }
        
        # Envoyer l'email via le service d'email configuré dans Windmill
        await wmill.run_script("email/send_email_with_attachment", email_data)
        
        return True
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email: {str(e)}")
        return False
