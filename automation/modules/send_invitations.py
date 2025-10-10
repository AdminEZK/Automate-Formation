import wmill
import base64
from datetime import datetime, timedelta
import json

async def main(
    session_id,  # ID de la session de formation (UUID)
    participant_id=None,  # ID du participant spécifique (optionnel)
    inclure_tous_participants=True,  # Envoyer à tous les participants
    generer_documents=True,  # Générer les documents de convocation
    mettre_a_jour_statut=True,  # Mettre à jour le statut de la session
    email_test=None  # Email de test (si spécifié, les emails seront envoyés uniquement à cette adresse)
):
    """
    Envoie des emails de convocation aux participants d'une session de formation
    
    Args:
        session_id: ID de la session de formation
        participant_id: ID d'un participant spécifique (optionnel)
        inclure_tous_participants: Envoyer à tous les participants
        generer_documents: Générer les documents de convocation
        mettre_a_jour_statut: Mettre à jour le statut de la session
        email_test: Email de test (si spécifié, les emails seront envoyés uniquement à cette adresse)
        
    Returns:
        Informations sur les emails envoyés
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
    
    # Vérifier que la session est dans un état approprié pour envoyer des convocations
    if session.get("statut") not in ["confirmee", "en_attente"]:
        if not mettre_a_jour_statut:
            raise ValueError(f"La session est en statut '{session.get('statut')}'. Elle doit être 'confirmee' ou 'en_attente' pour envoyer des convocations.")
    
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
        if not participants:
            raise ValueError(f"Aucun participant trouvé pour la session {session_id}")
    
    # Générer les documents de convocation si demandé
    documents = []
    if generer_documents:
        documents_result = await wmill.run_script("modules/generate_documents", {
            "session_id": session_id,
            "type_document": "convocation",
            "inclure_tous_participants": inclure_tous_participants,
            "participant_id": participant_id,
            "envoyer_email": False,  # Nous gérons l'envoi d'email ici
            "sauvegarder_supabase": True
        })
        
        if documents_result.get("success"):
            documents = documents_result.get("documents", [])
        else:
            print(f"Avertissement: Erreur lors de la génération des documents: {documents_result}")
    
    # Envoyer les emails de convocation
    emails_envoyes = []
    
    for participant in participants:
        # Trouver le document correspondant au participant
        document = None
        if documents:
            for doc in documents:
                if doc.get("participant") and doc.get("participant").get("id") == participant.get("id"):
                    document = doc
                    break
        
        # Envoyer l'email
        email_result = await send_invitation_email(
            session=session,
            participant=participant,
            document=document,
            email_test=email_test
        )
        
        emails_envoyes.append({
            "participant": {
                "id": participant.get("id"),
                "nom": participant.get("nom"),
                "prenom": participant.get("prenom"),
                "email": participant.get("email")
            },
            "email_sent": email_result.get("success", False),
            "document_attached": document is not None,
            "error": email_result.get("error")
        })
    
    # Mettre à jour le statut de la session si demandé
    if mettre_a_jour_statut and all(email.get("email_sent") for email in emails_envoyes):
        await update_session_status(session_id, "convoquee")
        print(f"Statut de la session mis à jour: 'convoquee'")
    
    # Retourner les informations sur les emails envoyés
    return {
        "success": True,
        "session": {
            "id": session_id,
            "titre": session.get("formation_titre"),
            "entreprise": session.get("entreprise_nom"),
            "date_debut": session.get("date_debut"),
            "date_fin": session.get("date_fin"),
            "statut": session.get("statut")
        },
        "nombre_emails": len(emails_envoyes),
        "emails": emails_envoyes,
        "statut_mis_a_jour": mettre_a_jour_statut and all(email.get("email_sent") for email in emails_envoyes)
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

async def send_invitation_email(session, participant, document=None, email_test=None):
    """
    Envoie un email de convocation à un participant
    """
    try:
        # Déterminer l'adresse email du destinataire
        to_email = email_test if email_test else participant.get("email")
        
        if not to_email:
            return {
                "success": False,
                "error": f"Aucune adresse email disponible pour le participant {participant.get('nom')} {participant.get('prenom')}"
            }
        
        # Préparer les données pour l'email
        formation_titre = session.get("formation_titre", "")
        formation_date = format_date_range(session.get("date_debut"), session.get("date_fin"))
        formation_lieu = session.get("lieu", "")
        
        # Préparer le contenu de l'email
        subject = f"Convocation à la formation : {formation_titre}"
        html_content = f"""
        <h1>Convocation à la formation</h1>
        <p>Bonjour {participant.get('prenom', '')} {participant.get('nom', '')},</p>
        <p>Nous avons le plaisir de vous convier à la formation suivante :</p>
        <ul>
            <li><strong>Formation :</strong> {formation_titre}</li>
            <li><strong>Date :</strong> {formation_date}</li>
            <li><strong>Lieu :</strong> {formation_lieu}</li>
            <li><strong>Horaires :</strong> 9h00 - 17h00</li>
        </ul>
        <p>Merci de confirmer votre présence en répondant à cet email.</p>
        <p>Cordialement,</p>
        <p>L'équipe de formation</p>
        """
        
        # Préparer les données pour l'envoi d'email
        email_data = {
            "to": to_email,
            "subject": subject,
            "html": html_content
        }
        
        # Ajouter la pièce jointe si un document est disponible
        if document and document.get("url"):
            # Récupérer le document depuis Supabase
            document_id = document.get("url").split("/")[1]  # Extraire l'ID du document de l'URL
            
            documents = await wmill.get_resource("supabase/documents")
            doc_entry = next((d for d in documents if d["id"] == document_id), None)
            
            if doc_entry and doc_entry.get("contenu"):
                email_data["attachments"] = [
                    {
                        "filename": doc_entry.get("nom_fichier", "convocation.pdf"),
                        "content": doc_entry.get("contenu"),
                        "encoding": "base64"
                    }
                ]
        
        # Envoyer l'email via le service d'email configuré dans Windmill
        if "attachments" in email_data:
            result = await wmill.run_script("email/send_email_with_attachment", email_data)
        else:
            result = await wmill.run_script("email/send_email", email_data)
        
        if email_test:
            print(f"Email de test envoyé à {email_test} pour le participant {participant.get('prenom')} {participant.get('nom')}")
        else:
            print(f"Email envoyé à {to_email} ({participant.get('prenom')} {participant.get('nom')})")
        
        return {
            "success": True,
            "email": to_email,
            "with_attachment": "attachments" in email_data
        }
    except Exception as e:
        error_msg = f"Erreur lors de l'envoi de l'email: {str(e)}"
        print(error_msg)
        return {
            "success": False,
            "error": error_msg
        }

async def update_session_status(session_id, new_status):
    """
    Met à jour le statut d'une session de formation
    """
    try:
        # Récupérer la session actuelle
        sessions = await wmill.get_resource("supabase/sessions_formation")
        session = next((s for s in sessions if s["id"] == session_id), None)
        
        if not session:
            raise ValueError(f"Session avec ID {session_id} non trouvée")
        
        # Mettre à jour le statut
        session["statut"] = new_status
        session["updated_at"] = datetime.now().isoformat()
        
        # Mettre à jour les métadonnées
        metadata = json.loads(session.get("metadata", "{}"))
        metadata["date_convocation"] = datetime.now().isoformat()
        session["metadata"] = json.dumps(metadata)
        
        # Enregistrer dans Supabase
        await wmill.set_resource("supabase/sessions_formation", session)
        
        return True
    except Exception as e:
        print(f"Erreur lors de la mise à jour du statut de la session: {str(e)}")
        return False

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
