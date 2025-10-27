#!/usr/bin/env python3
"""
Script CLI pour générer des documents depuis les templates Word
Usage: python generate_documents_cli.py <method_name> <session_id> [participant_id]
"""

import sys
import json
import os
from dotenv import load_dotenv
from supabase import create_client
from services.templateDocumentGenerator import TemplateDocumentGenerator

# Charger les variables d'environnement
load_dotenv()

def main():
    if len(sys.argv) < 3:
        print(json.dumps({
            'success': False,
            'error': 'Usage: python generate_documents_cli.py <method_name> <session_id> [participant_id]'
        }))
        sys.exit(1)
    
    method_name = sys.argv[1]
    session_id = sys.argv[2]
    participant_id = sys.argv[3] if len(sys.argv) > 3 else None
    
    try:
        # Connexion à Supabase
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_KEY')
        
        if not supabase_url or not supabase_key:
            raise ValueError('SUPABASE_URL et SUPABASE_KEY doivent être définis dans .env')
        
        supabase = create_client(supabase_url, supabase_key)
        
        # Créer le générateur
        generator = TemplateDocumentGenerator(supabase)
        
        # Appeler la méthode demandée
        if method_name == 'generer_tous_documents_session':
            result = generator.generer_tous_documents_session(session_id)
            print(json.dumps({
                'success': True,
                'documents': result
            }))
        else:
            # Appeler la méthode spécifique
            if hasattr(generator, method_name):
                method = getattr(generator, method_name)
                
                # Appeler avec ou sans participant_id selon la méthode
                if participant_id:
                    file_path = method(session_id, participant_id)
                else:
                    file_path = method(session_id)
                
                print(json.dumps({
                    'success': True,
                    'filePath': file_path
                }))
            else:
                raise ValueError(f'Méthode inconnue: {method_name}')
    
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)

if __name__ == '__main__':
    main()
