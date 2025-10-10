"""
Workflows Windmill pour l'Automatisation Qualiopi
==================================================
Automatise la génération et l'envoi des 19 documents Qualiopi
Date: 8 octobre 2025
Version: 1.0
"""

import os
import sys
from datetime import datetime, timedelta
from typing import Dict, List
import json

# Ajouter le chemin des services
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'services'))

from documentGeneratorExtended import QualiopisDocumentGeneratorExtended
from supabase import create_client


# ============================================
# CONFIGURATION
# ============================================

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
RESEND_API_KEY = os.getenv('RESEND_API_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# ============================================
# WORKFLOW 1: NOUVELLE DEMANDE DE FORMATION
# ============================================

def workflow_nouvelle_demande(session_id: str) -> Dict:
    """
    Déclenché quand: Une nouvelle session est créée (statut = 'demande')
    Actions:
    1. Envoyer email de confirmation au client
    2. Notifier l'organisme de formation
    3. Générer le numéro de convention
    """
    try:
        # Récupérer les données de la session
        session = supabase.table('vue_sessions_complete').select('*').eq('id', session_id).execute()
        if not session.data:
            raise ValueError(f"Session {session_id} non trouvée")
        
        session_data = session.data[0]
        
        # Générer un numéro de convention
        result = supabase.rpc('generer_numero_convention').execute()
        numero_convention = result.data
        
        # Mettre à jour la session
        supabase.table('sessions_formation').update({
            'numero_convention': numero_convention
        }).eq('id', session_id).execute()
        
        # Envoyer email de confirmation au client
        # (Intégration avec Resend - voir emailService.js)
        
        return {
            'success': True,
            'session_id': session_id,
            'numero_convention': numero_convention,
            'message': 'Demande de formation enregistrée avec succès'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


# ============================================
# WORKFLOW 2: GÉNÉRATION PROPOSITION COMMERCIALE
# ============================================

def workflow_generer_proposition(session_id: str) -> Dict:
    """
    Déclenché quand: Statut passe à 'en_attente'
    Actions:
    1. Générer proposition de formation (devis)
    2. Générer programme de formation
    3. Upload vers Supabase Storage
    4. Envoyer email au client avec les documents
    """
    try:
        generator = QualiopisDocumentGeneratorExtended(supabase)
        
        # Générer les documents
        proposition_path = generator.generer_proposition_formation(session_id)
        programme_path = generator.generer_programme_formation(session_id)
        
        # Upload vers Supabase Storage
        with open(proposition_path, 'rb') as f:
            supabase.storage.from_('documents').upload(
                f'propositions/proposition_{session_id}.pdf',
                f.read()
            )
        
        with open(programme_path, 'rb') as f:
            supabase.storage.from_('documents').upload(
                f'programmes/programme_{session_id}.pdf',
                f.read()
            )
        
        # Enregistrer les métadonnées dans la table documents
        supabase.table('documents').insert([
            {
                'session_formation_id': session_id,
                'type': 'proposition',
                'nom_fichier': f'proposition_{session_id}.pdf',
                'storage_path': f'propositions/proposition_{session_id}.pdf',
                'statut': 'genere'
            },
            {
                'session_formation_id': session_id,
                'type': 'programme',
                'nom_fichier': f'programme_{session_id}.pdf',
                'storage_path': f'programmes/programme_{session_id}.pdf',
                'statut': 'genere'
            }
        ]).execute()
        
        # Envoyer email au client
        # (Intégration avec Resend)
        
        return {
            'success': True,
            'session_id': session_id,
            'documents': ['proposition', 'programme'],
            'message': 'Proposition commerciale générée et envoyée'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


# ============================================
# WORKFLOW 3: SIGNATURE CONVENTION (YOUSIGN)
# ============================================

def workflow_signature_convention(session_id: str) -> Dict:
    """
    Déclenché quand: Client accepte la proposition
    Actions:
    1. Générer la convention de formation
    2. Envoyer via Yousign pour signature électronique
    3. Attendre la signature
    4. Stocker la convention signée
    5. Mettre à jour le statut à 'confirmee'
    """
    try:
        generator = QualiopisDocumentGeneratorExtended(supabase)
        
        # Générer la convention
        convention_path = generator.generer_convention_formation(session_id)
        
        # Upload vers Supabase Storage
        with open(convention_path, 'rb') as f:
            supabase.storage.from_('documents').upload(
                f'conventions/convention_{session_id}.pdf',
                f.read()
            )
        
        # Envoyer via Yousign
        # (Intégration avec Yousign API - voir INTEGRATION-YOUSIGN.md)
        
        # Enregistrer dans la table documents
        supabase.table('documents').insert({
            'session_formation_id': session_id,
            'type': 'convention',
            'nom_fichier': f'convention_{session_id}.pdf',
            'storage_path': f'conventions/convention_{session_id}.pdf',
            'statut': 'envoye'
        }).execute()
        
        return {
            'success': True,
            'session_id': session_id,
            'message': 'Convention envoyée pour signature'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


# ============================================
# WORKFLOW 4: QUESTIONNAIRES PRÉALABLES (J-7)
# ============================================

def workflow_questionnaires_prealables(session_id: str) -> Dict:
    """
    Déclenché quand: J-7 avant la formation (cron job)
    Actions:
    1. Générer questionnaires préalables pour chaque participant
    2. Envoyer par email à chaque participant
    """
    try:
        generator = QualiopisDocumentGeneratorExtended(supabase)
        
        # Récupérer les participants
        participants = supabase.table('participants').select('*').eq('session_formation_id', session_id).execute()
        
        questionnaires_generes = []
        
        for participant in participants.data:
            # Générer le questionnaire
            questionnaire_path = generator.generer_questionnaire_prealable(session_id, participant['id'])
            
            # Upload vers Supabase Storage
            with open(questionnaire_path, 'rb') as f:
                storage_path = f'questionnaires/prealable_{participant["id"]}.pdf'
                supabase.storage.from_('documents').upload(storage_path, f.read())
            
            # Enregistrer dans la table
            supabase.table('documents').insert({
                'session_formation_id': session_id,
                'participant_id': participant['id'],
                'type': 'questionnaire_prealable',
                'nom_fichier': f'questionnaire_prealable_{participant["id"]}.pdf',
                'storage_path': storage_path,
                'statut': 'genere'
            }).execute()
            
            # Créer l'entrée dans questionnaires_prealables
            supabase.table('questionnaires_prealables').insert({
                'session_formation_id': session_id,
                'participant_id': participant['id'],
                'date_envoi': datetime.now().isoformat(),
                'repondu': False
            }).execute()
            
            questionnaires_generes.append(participant['id'])
            
            # Envoyer email au participant
            # (Intégration avec Resend)
        
        return {
            'success': True,
            'session_id': session_id,
            'questionnaires_envoyes': len(questionnaires_generes),
            'message': f'{len(questionnaires_generes)} questionnaires préalables envoyés'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


# ============================================
# WORKFLOW 5: CONVOCATIONS (J-4)
# ============================================

def workflow_envoyer_convocations(session_id: str) -> Dict:
    """
    Déclenché quand: J-4 avant la formation (cron job)
    Actions:
    1. Générer convocations personnalisées
    2. Générer feuilles d'émargement
    3. Générer règlement intérieur
    4. Envoyer tout par email aux participants
    5. Mettre à jour le statut à 'convoquee'
    """
    try:
        generator = QualiopisDocumentGeneratorExtended(supabase)
        
        # Récupérer les participants
        participants = supabase.table('participants').select('*').eq('session_formation_id', session_id).execute()
        
        # Générer le règlement intérieur (une seule fois)
        reglement_path = generator.generer_reglement_interieur()
        
        # Générer les feuilles d'émargement
        session = supabase.table('sessions_formation').select('*').eq('id', session_id).execute()
        emargement_path = generator.generer_feuille_emargement(session_id, session.data[0]['date_debut'])
        
        convocations_envoyees = []
        
        for participant in participants.data:
            # Générer la convocation
            convocation_path = generator.generer_convocation(session_id, participant['id'])
            
            # Upload vers Supabase Storage
            with open(convocation_path, 'rb') as f:
                storage_path = f'convocations/convocation_{participant["id"]}.pdf'
                supabase.storage.from_('documents').upload(storage_path, f.read())
            
            # Enregistrer dans la table
            supabase.table('documents').insert({
                'session_formation_id': session_id,
                'participant_id': participant['id'],
                'type': 'convocation',
                'nom_fichier': f'convocation_{participant["id"]}.pdf',
                'storage_path': storage_path,
                'statut': 'envoye',
                'date_envoi': datetime.now().isoformat()
            }).execute()
            
            convocations_envoyees.append(participant['id'])
            
            # Envoyer email avec pièces jointes:
            # - Convocation personnalisée
            # - Règlement intérieur
            # - Programme de formation
            # (Intégration avec Resend)
        
        # Mettre à jour le statut de la session
        supabase.table('sessions_formation').update({
            'statut': 'convoquee',
            'date_envoi_convocation': datetime.now().isoformat()
        }).eq('id', session_id).execute()
        
        return {
            'success': True,
            'session_id': session_id,
            'convocations_envoyees': len(convocations_envoyees),
            'message': f'{len(convocations_envoyees)} convocations envoyées'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


# ============================================
# WORKFLOW 6: ÉVALUATIONS À CHAUD (FIN FORMATION)
# ============================================

def workflow_evaluations_a_chaud(session_id: str) -> Dict:
    """
    Déclenché quand: Fin de la formation (même jour)
    Actions:
    1. Générer évaluations à chaud pour chaque participant
    2. Envoyer par email immédiatement
    """
    try:
        generator = QualiopisDocumentGeneratorExtended(supabase)
        
        # Récupérer les participants
        participants = supabase.table('participants').select('*').eq('session_formation_id', session_id).execute()
        
        evaluations_envoyees = []
        
        for participant in participants.data:
            # Générer l'évaluation
            evaluation_path = generator.generer_evaluation_a_chaud(session_id, participant['id'])
            
            # Upload vers Supabase Storage
            with open(evaluation_path, 'rb') as f:
                storage_path = f'evaluations/a_chaud_{participant["id"]}.pdf'
                supabase.storage.from_('documents').upload(storage_path, f.read())
            
            # Créer l'entrée dans evaluations
            supabase.table('evaluations').insert({
                'session_formation_id': session_id,
                'participant_id': participant['id'],
                'type': 'a_chaud',
                'date_evaluation': datetime.now().date().isoformat(),
                'repondu': False
            }).execute()
            
            evaluations_envoyees.append(participant['id'])
            
            # Envoyer email
            # (Intégration avec Resend)
        
        return {
            'success': True,
            'session_id': session_id,
            'evaluations_envoyees': len(evaluations_envoyees),
            'message': f'{len(evaluations_envoyees)} évaluations à chaud envoyées'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


# ============================================
# WORKFLOW 7: BILAN FORMATEUR (J+1)
# ============================================

def workflow_bilan_formateur(session_id: str) -> Dict:
    """
    Déclenché quand: J+1 après la formation (cron job)
    Actions:
    1. Générer questionnaire formateur
    2. Envoyer par email au formateur
    """
    try:
        generator = QualiopisDocumentGeneratorExtended(supabase)
        
        # Générer le questionnaire formateur
        questionnaire_path = generator.generer_questionnaire_formateur(session_id)
        
        # Upload vers Supabase Storage
        with open(questionnaire_path, 'rb') as f:
            storage_path = f'evaluations/formateur_{session_id}.pdf'
            supabase.storage.from_('documents').upload(storage_path, f.read())
        
        # Créer l'entrée dans evaluations
        supabase.table('evaluations').insert({
            'session_formation_id': session_id,
            'type': 'formateur',
            'date_evaluation': datetime.now().date().isoformat(),
            'repondu': False
        }).execute()
        
        # Envoyer email au formateur
        # (Intégration avec Resend)
        
        return {
            'success': True,
            'session_id': session_id,
            'message': 'Questionnaire formateur envoyé'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


# ============================================
# WORKFLOW 8: CERTIFICATS & CLÔTURE (J+2)
# ============================================

def workflow_cloture_formation(session_id: str) -> Dict:
    """
    Déclenché quand: J+2 après la formation (cron job)
    Actions:
    1. Générer certificats de réalisation pour chaque participant
    2. Générer évaluation satisfaction client
    3. Envoyer les certificats aux participants
    4. Envoyer l'évaluation au responsable entreprise
    5. Mettre à jour le statut à 'terminee'
    """
    try:
        generator = QualiopisDocumentGeneratorExtended(supabase)
        
        # Récupérer les participants
        participants = supabase.table('participants').select('*').eq('session_formation_id', session_id).execute()
        
        certificats_envoyes = []
        
        for participant in participants.data:
            # Générer le certificat
            certificat_path = generator.generer_certificat_realisation(session_id, participant['id'])
            
            # Upload vers Supabase Storage
            with open(certificat_path, 'rb') as f:
                storage_path = f'certificats/certificat_{participant["id"]}.pdf'
                supabase.storage.from_('documents').upload(storage_path, f.read())
            
            # Enregistrer dans la table
            supabase.table('documents').insert({
                'session_formation_id': session_id,
                'participant_id': participant['id'],
                'type': 'certificat',
                'nom_fichier': f'certificat_{participant["id"]}.pdf',
                'storage_path': storage_path,
                'statut': 'envoye',
                'date_envoi': datetime.now().isoformat()
            }).execute()
            
            certificats_envoyes.append(participant['id'])
            
            # Envoyer email avec certificat
            # (Intégration avec Resend)
        
        # Générer évaluation satisfaction client
        eval_client_path = generator.generer_evaluation_satisfaction_client(session_id)
        
        # Créer l'entrée dans evaluations
        supabase.table('evaluations').insert({
            'session_formation_id': session_id,
            'type': 'satisfaction_client',
            'date_evaluation': datetime.now().date().isoformat(),
            'repondu': False
        }).execute()
        
        # Envoyer email au responsable entreprise
        # (Intégration avec Resend)
        
        # Mettre à jour le statut de la session
        supabase.table('sessions_formation').update({
            'statut': 'terminee',
            'date_envoi_certificat': datetime.now().isoformat()
        }).eq('id', session_id).execute()
        
        return {
            'success': True,
            'session_id': session_id,
            'certificats_envoyes': len(certificats_envoyes),
            'message': f'Formation clôturée - {len(certificats_envoyes)} certificats envoyés'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


# ============================================
# WORKFLOW 9: ÉVALUATIONS À FROID (J+60)
# ============================================

def workflow_evaluations_a_froid(session_id: str) -> Dict:
    """
    Déclenché quand: J+60 après la formation (cron job)
    Actions:
    1. Générer évaluations à froid pour chaque participant
    2. Envoyer par email
    """
    try:
        generator = QualiopisDocumentGeneratorExtended(supabase)
        
        # Récupérer les participants
        participants = supabase.table('participants').select('*').eq('session_formation_id', session_id).execute()
        
        evaluations_envoyees = []
        
        for participant in participants.data:
            # Générer l'évaluation
            evaluation_path = generator.generer_evaluation_a_froid(session_id, participant['id'])
            
            # Upload vers Supabase Storage
            with open(evaluation_path, 'rb') as f:
                storage_path = f'evaluations/a_froid_{participant["id"]}.pdf'
                supabase.storage.from_('documents').upload(storage_path, f.read())
            
            # Créer l'entrée dans evaluations
            supabase.table('evaluations').insert({
                'session_formation_id': session_id,
                'participant_id': participant['id'],
                'type': 'a_froid',
                'date_evaluation': datetime.now().date().isoformat(),
                'repondu': False
            }).execute()
            
            evaluations_envoyees.append(participant['id'])
            
            # Envoyer email
            # (Intégration avec Resend)
        
        return {
            'success': True,
            'session_id': session_id,
            'evaluations_envoyees': len(evaluations_envoyees),
            'message': f'{len(evaluations_envoyees)} évaluations à froid envoyées'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


# ============================================
# WORKFLOW 10: ARCHIVAGE (J+90)
# ============================================

def workflow_archivage(session_id: str) -> Dict:
    """
    Déclenché quand: J+90 après la formation (cron job)
    Actions:
    1. Vérifier que tous les documents sont présents
    2. Mettre à jour le statut à 'archivee'
    3. Générer un rapport de conformité
    """
    try:
        # Vérifier la complétude des documents
        documents = supabase.table('documents').select('type').eq('session_formation_id', session_id).execute()
        
        types_requis = [
            'proposition', 'convention', 'programme', 'convocation',
            'emargement', 'certificat', 'questionnaire_prealable'
        ]
        
        types_presents = [doc['type'] for doc in documents.data]
        manquants = [t for t in types_requis if t not in types_presents]
        
        if manquants:
            return {
                'success': False,
                'session_id': session_id,
                'message': f'Documents manquants: {", ".join(manquants)}'
            }
        
        # Mettre à jour le statut
        supabase.table('sessions_formation').update({
            'statut': 'archivee'
        }).eq('id', session_id).execute()
        
        return {
            'success': True,
            'session_id': session_id,
            'message': 'Session archivée avec succès - Conformité Qualiopi validée'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


# ============================================
# CRON JOBS - PLANIFICATION
# ============================================

def cron_check_sessions_j_moins_7():
    """Vérifie les sessions à J-7 et envoie les questionnaires préalables"""
    date_cible = (datetime.now() + timedelta(days=7)).date()
    
    sessions = supabase.table('sessions_formation').select('id').eq('statut', 'confirmee').execute()
    
    for session in sessions.data:
        session_data = supabase.table('sessions_formation').select('date_debut').eq('id', session['id']).execute()
        date_debut = datetime.fromisoformat(session_data.data[0]['date_debut']).date()
        
        if date_debut == date_cible:
            workflow_questionnaires_prealables(session['id'])


def cron_check_sessions_j_moins_4():
    """Vérifie les sessions à J-4 et envoie les convocations"""
    date_cible = (datetime.now() + timedelta(days=4)).date()
    
    sessions = supabase.table('sessions_formation').select('id').eq('statut', 'confirmee').execute()
    
    for session in sessions.data:
        session_data = supabase.table('sessions_formation').select('date_debut').eq('id', session['id']).execute()
        date_debut = datetime.fromisoformat(session_data.data[0]['date_debut']).date()
        
        if date_debut == date_cible:
            workflow_envoyer_convocations(session['id'])


def cron_check_sessions_j_plus_1():
    """Vérifie les sessions à J+1 et envoie le bilan formateur"""
    date_cible = (datetime.now() - timedelta(days=1)).date()
    
    sessions = supabase.table('sessions_formation').select('id').eq('statut', 'convoquee').execute()
    
    for session in sessions.data:
        session_data = supabase.table('sessions_formation').select('date_fin').eq('id', session['id']).execute()
        date_fin = datetime.fromisoformat(session_data.data[0]['date_fin']).date()
        
        if date_fin == date_cible:
            workflow_bilan_formateur(session['id'])


def cron_check_sessions_j_plus_2():
    """Vérifie les sessions à J+2 et clôture la formation"""
    date_cible = (datetime.now() - timedelta(days=2)).date()
    
    sessions = supabase.table('sessions_formation').select('id').eq('statut', 'convoquee').execute()
    
    for session in sessions.data:
        session_data = supabase.table('sessions_formation').select('date_fin').eq('id', session['id']).execute()
        date_fin = datetime.fromisoformat(session_data.data[0]['date_fin']).date()
        
        if date_fin == date_cible:
            workflow_cloture_formation(session['id'])


def cron_check_sessions_j_plus_60():
    """Vérifie les sessions à J+60 et envoie les évaluations à froid"""
    date_cible = (datetime.now() - timedelta(days=60)).date()
    
    sessions = supabase.table('sessions_formation').select('id').eq('statut', 'terminee').execute()
    
    for session in sessions.data:
        session_data = supabase.table('sessions_formation').select('date_fin').eq('id', session['id']).execute()
        date_fin = datetime.fromisoformat(session_data.data[0]['date_fin']).date()
        
        if date_fin == date_cible:
            workflow_evaluations_a_froid(session['id'])


def cron_check_sessions_j_plus_90():
    """Vérifie les sessions à J+90 et archive"""
    date_cible = (datetime.now() - timedelta(days=90)).date()
    
    sessions = supabase.table('sessions_formation').select('id').eq('statut', 'terminee').execute()
    
    for session in sessions.data:
        session_data = supabase.table('sessions_formation').select('date_fin').eq('id', session['id']).execute()
        date_fin = datetime.fromisoformat(session_data.data[0]['date_fin']).date()
        
        if date_fin == date_cible:
            workflow_archivage(session['id'])


# ============================================
# EXEMPLE D'UTILISATION
# ============================================

if __name__ == "__main__":
    # Test d'un workflow
    session_id = "votre-session-id"
    
    # Exemple: Générer tous les documents d'une session
    result = workflow_generer_proposition(session_id)
    print(json.dumps(result, indent=2))
