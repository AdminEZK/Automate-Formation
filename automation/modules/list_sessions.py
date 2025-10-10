import wmill
from datetime import datetime, timedelta
import json

async def main(
    statut=None,  # Optionnel: filtrer par statut (demande, en_attente, confirmee, convoquee, terminee, archivee, annulee)
    periode=None,  # Optionnel: "a_venir", "passees", "toutes"
    entreprise_id=None,  # Optionnel: filtrer par ID d'entreprise
    jours_a_venir=30,  # Nombre de jours à considérer pour les sessions à venir
    inclure_participants=False  # Inclure les détails des participants
):
    """
    Liste les sessions de formation avec possibilité de filtrage
    
    Args:
        statut: Filtrer par statut (demande, en_attente, confirmee, convoquee, terminee, archivee, annulee)
        periode: "a_venir" (sessions futures), "passees" (sessions passées), "toutes" (toutes les sessions)
        entreprise_id: ID de l'entreprise pour filtrer les sessions
        jours_a_venir: Pour periode="a_venir", nombre de jours à considérer
        inclure_participants: Si True, inclut les détails des participants pour chaque session
        
    Returns:
        Liste des sessions de formation correspondant aux critères
    """
    # Initialiser la période si non spécifiée
    if periode is None:
        periode = "a_venir"
    
    # Récupérer toutes les sessions depuis Supabase via MCP
    sessions = await wmill.get_resource("supabase/sessions_formation")
    
    # Récupérer les formations et entreprises pour enrichir les données
    formations = await wmill.get_resource("supabase/formations_catalogue")
    entreprises = await wmill.get_resource("supabase/entreprises")
    
    # Créer des dictionnaires pour un accès rapide
    formations_dict = {f["id"]: f for f in formations}
    entreprises_dict = {e["id"]: e for e in entreprises}
    
    # Filtrer les sessions selon les critères
    date_aujourdhui = datetime.now().date()
    date_limite = date_aujourdhui + timedelta(days=jours_a_venir)
    
    sessions_filtrees = []
    
    for session in sessions:
        # Convertir les dates de string à date
        if session.get("date_debut"):
            date_debut = datetime.fromisoformat(session["date_debut"].replace("Z", "+00:00")).date()
        else:
            date_debut = None
            
        # Appliquer le filtre de période
        if periode == "a_venir" and date_debut:
            if date_debut < date_aujourdhui:
                continue
            if date_debut > date_limite:
                continue
        elif periode == "passees" and date_debut:
            if date_debut >= date_aujourdhui:
                continue
                
        # Appliquer le filtre de statut
        if statut and session.get("statut") != statut:
            continue
            
        # Appliquer le filtre d'entreprise
        if entreprise_id and session.get("entreprise_id") != entreprise_id:
            continue
            
        # Enrichir la session avec les données de formation et d'entreprise
        formation_id = session.get("formation_catalogue_id")
        entreprise_id = session.get("entreprise_id")
        
        session_enrichie = session.copy()
        
        if formation_id and formation_id in formations_dict:
            formation = formations_dict[formation_id]
            session_enrichie["formation"] = {
                "titre": formation.get("titre"),
                "duree": formation.get("duree"),
                "prix_ht": formation.get("prix_ht")
            }
            
        if entreprise_id and entreprise_id in entreprises_dict:
            entreprise = entreprises_dict[entreprise_id]
            session_enrichie["entreprise"] = {
                "nom": entreprise.get("nom"),
                "email_contact": entreprise.get("email_contact"),
                "telephone": entreprise.get("telephone")
            }
            
        # Ajouter les participants si demandé
        if inclure_participants:
            participants = await wmill.get_resource("supabase/participants")
            session_participants = [p for p in participants if p.get("session_formation_id") == session["id"]]
            session_enrichie["participants"] = session_participants
            
        sessions_filtrees.append(session_enrichie)
    
    # Trier les sessions par date de début
    sessions_filtrees.sort(key=lambda s: s.get("date_debut", "9999-12-31"))
    
    return {
        "total": len(sessions_filtrees),
        "sessions": sessions_filtrees
    }
