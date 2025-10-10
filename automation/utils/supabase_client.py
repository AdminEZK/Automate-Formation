import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

# Charger les variables d'environnement
load_dotenv()

class SupabaseClient:
    """
    Client pour interagir avec la base de données Supabase
    """
    
    def __init__(self):
        """
        Initialise le client Supabase avec les informations d'authentification
        """
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("Les variables d'environnement SUPABASE_URL et SUPABASE_KEY doivent être définies")
        
        self.client = create_client(supabase_url, supabase_key)
    
    # Méthodes pour les sessions de formation
    
    def get_sessions(self, filters=None):
        """
        Récupère les sessions de formation avec filtres optionnels
        
        Args:
            filters (dict): Filtres à appliquer (statut, entreprise_id, etc.)
            
        Returns:
            list: Liste des sessions de formation
        """
        query = self.client.table("sessions_formation").select("*")
        
        if filters:
            if "statut" in filters and filters["statut"]:
                query = query.eq("statut", filters["statut"])
            if "entreprise_id" in filters and filters["entreprise_id"]:
                query = query.eq("entreprise_id", filters["entreprise_id"])
            if "formation_catalogue_id" in filters and filters["formation_catalogue_id"]:
                query = query.eq("formation_catalogue_id", filters["formation_catalogue_id"])
        
        response = query.execute()
        
        if hasattr(response, 'data'):
            return response.data
        return []
    
    def get_session_by_id(self, session_id):
        """
        Récupère une session de formation par son ID
        
        Args:
            session_id (int): ID de la session
            
        Returns:
            dict: Données de la session ou None si non trouvée
        """
        response = self.client.table("sessions_formation").select("*").eq("id", session_id).execute()
        
        if hasattr(response, 'data') and len(response.data) > 0:
            return response.data[0]
        return None
    
    def get_sessions_with_details(self, filters=None):
        """
        Récupère les sessions avec les détails des entreprises et formations
        
        Args:
            filters (dict): Filtres à appliquer
            
        Returns:
            list: Liste des sessions avec détails
        """
        query = self.client.table("vue_sessions_complete").select("*")
        
        if filters:
            if "statut" in filters and filters["statut"]:
                query = query.eq("statut", filters["statut"])
            if "entreprise_id" in filters and filters["entreprise_id"]:
                query = query.eq("entreprise_id", filters["entreprise_id"])
            if "formation_catalogue_id" in filters and filters["formation_catalogue_id"]:
                query = query.eq("formation_catalogue_id", filters["formation_catalogue_id"])
        
        response = query.execute()
        
        if hasattr(response, 'data'):
            return response.data
        return []
    
    def update_session_status(self, session_id, new_status):
        """
        Met à jour le statut d'une session
        
        Args:
            session_id (int): ID de la session
            new_status (str): Nouveau statut
            
        Returns:
            dict: Données mises à jour ou None en cas d'erreur
        """
        response = self.client.table("sessions_formation").update({"statut": new_status}).eq("id", session_id).execute()
        
        if hasattr(response, 'data') and len(response.data) > 0:
            return response.data[0]
        return None
    
    # Méthodes pour les entreprises
    
    def get_entreprises(self):
        """
        Récupère toutes les entreprises
        
        Returns:
            list: Liste des entreprises
        """
        response = self.client.table("entreprises").select("*").execute()
        
        if hasattr(response, 'data'):
            return response.data
        return []
    
    def get_entreprise_by_id(self, entreprise_id):
        """
        Récupère une entreprise par son ID
        
        Args:
            entreprise_id (int): ID de l'entreprise
            
        Returns:
            dict: Données de l'entreprise ou None si non trouvée
        """
        response = self.client.table("entreprises").select("*").eq("id", entreprise_id).execute()
        
        if hasattr(response, 'data') and len(response.data) > 0:
            return response.data[0]
        return None
    
    # Méthodes pour les formations
    
    def get_formations(self):
        """
        Récupère toutes les formations du catalogue
        
        Returns:
            list: Liste des formations
        """
        response = self.client.table("formations_catalogue").select("*").execute()
        
        if hasattr(response, 'data'):
            return response.data
        return []
    
    def get_formation_by_id(self, formation_id):
        """
        Récupère une formation par son ID
        
        Args:
            formation_id (int): ID de la formation
            
        Returns:
            dict: Données de la formation ou None si non trouvée
        """
        response = self.client.table("formations_catalogue").select("*").eq("id", formation_id).execute()
        
        if hasattr(response, 'data') and len(response.data) > 0:
            return response.data[0]
        return None
    
    # Méthodes pour les documents
    
    def upload_document(self, bucket_name, file_path, file_data, content_type='application/pdf'):
        """
        Upload un document vers Supabase Storage
        
        Args:
            bucket_name (str): Nom du bucket de stockage
            file_path (str): Chemin du fichier dans le bucket
            file_data (bytes): Données du fichier
            content_type (str): Type MIME du fichier
            
        Returns:
            dict: Informations sur le fichier uploadé ou None en cas d'erreur
        """
        try:
            response = self.client.storage.from_(bucket_name).upload(
                file_path,
                file_data,
                {
                    'content-type': content_type,
                    'upsert': 'true'
                }
            )
            return response
        except Exception as e:
            print(f"Erreur lors de l'upload du document: {str(e)}")
            return None
    
    def get_document_url(self, bucket_name, file_path):
        """
        Récupère l'URL publique ou signée d'un document
        
        Args:
            bucket_name (str): Nom du bucket de stockage
            file_path (str): Chemin du fichier dans le bucket
            
        Returns:
            str: URL du document
        """
        try:
            # Pour un bucket privé, utiliser create_signed_url
            response = self.client.storage.from_(bucket_name).create_signed_url(
                file_path,
                60 * 60 * 24 * 7  # URL valide pendant 7 jours
            )
            if response and 'signedURL' in response:
                return response['signedURL']
            return None
        except Exception as e:
            print(f"Erreur lors de la récupération de l'URL du document: {str(e)}")
            return None
    
    def delete_document(self, bucket_name, file_path):
        """
        Supprime un document de Supabase Storage
        
        Args:
            bucket_name (str): Nom du bucket de stockage
            file_path (str): Chemin du fichier dans le bucket
            
        Returns:
            bool: True si la suppression a réussi, False sinon
        """
        try:
            response = self.client.storage.from_(bucket_name).remove([file_path])
            return True
        except Exception as e:
            print(f"Erreur lors de la suppression du document: {str(e)}")
            return False
    
    def save_document_metadata(self, document_data):
        """
        Sauvegarde les métadonnées d'un document dans la table documents
        
        Args:
            document_data (dict): Données du document à sauvegarder
            
        Returns:
            dict: Données du document sauvegardé ou None en cas d'erreur
        """
        try:
            response = self.client.table("documents").insert(document_data).execute()
            
            if hasattr(response, 'data') and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Erreur lors de la sauvegarde des métadonnées du document: {str(e)}")
            return None
    
    def get_documents_by_session(self, session_id):
        """
        Récupère tous les documents d'une session
        
        Args:
            session_id (str): ID de la session
            
        Returns:
            list: Liste des documents
        """
        try:
            response = self.client.table("documents").select("*").eq("session_formation_id", session_id).execute()
            
            if hasattr(response, 'data'):
                return response.data
            return []
        except Exception as e:
            print(f"Erreur lors de la récupération des documents: {str(e)}")
            return []
    
    def get_documents_by_participant(self, participant_id):
        """
        Récupère tous les documents d'un participant
        
        Args:
            participant_id (str): ID du participant
            
        Returns:
            list: Liste des documents
        """
        try:
            response = self.client.table("documents").select("*").eq("participant_id", participant_id).execute()
            
            if hasattr(response, 'data'):
                return response.data
            return []
        except Exception as e:
            print(f"Erreur lors de la récupération des documents: {str(e)}")
            return []

# Singleton pour réutiliser la même instance
_supabase_client = None

def get_supabase_client():
    """
    Récupère une instance du client Supabase (singleton)
    
    Returns:
        SupabaseClient: Instance du client Supabase
    """
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = SupabaseClient()
    return _supabase_client
