#!/usr/bin/env python3
"""
Script de test pour la génération de documents
"""

import os
from dotenv import load_dotenv
from supabase import create_client
from services.templateDocumentGenerator import TemplateDocumentGenerator

# Charger les variables d'environnement
load_dotenv()

def test_generation():
    print("🚀 Test de génération de documents\n")
    
    # Connexion à Supabase
    print("📡 Connexion à Supabase...")
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY')
    
    if not supabase_url or not supabase_key:
        print("❌ Erreur : SUPABASE_URL et SUPABASE_KEY doivent être définis dans .env")
        return
    
    supabase = create_client(supabase_url, supabase_key)
    print("✅ Connecté à Supabase\n")
    
    # Créer le générateur
    print("🔧 Initialisation du générateur...")
    generator = TemplateDocumentGenerator(supabase)
    print("✅ Générateur initialisé\n")
    
    # Récupérer une session de test
    print("🔍 Recherche d'une session de test...")
    response = supabase.table('sessions_formation').select('*').limit(1).execute()
    
    if not response.data:
        print("❌ Aucune session trouvée dans la base de données")
        print("💡 Créez d'abord une session via le formulaire de demande")
        return
    
    session = response.data[0]
    session_id = session['id']
    print(f"✅ Session trouvée : {session_id}")
    print(f"   Formation : {session.get('formation_titre', 'N/A')}")
    print(f"   Entreprise : {session.get('entreprise_nom', 'N/A')}\n")
    
    # Récupérer les participants
    print("👥 Recherche des participants...")
    participants_response = supabase.table('participants').select('*').eq('session_formation_id', session_id).execute()
    participants = participants_response.data
    print(f"✅ {len(participants)} participant(s) trouvé(s)\n")
    
    # Test 1 : Générer la proposition
    print("📄 Test 1 : Génération de la proposition de formation...")
    try:
        file_path = generator.generer_proposition(session_id)
        print(f"✅ Proposition générée : {file_path}\n")
    except Exception as e:
        print(f"❌ Erreur : {str(e)}\n")
    
    # Test 2 : Générer le programme
    print("📄 Test 2 : Génération du programme de formation...")
    try:
        file_path = generator.generer_programme(session_id)
        print(f"✅ Programme généré : {file_path}\n")
    except Exception as e:
        print(f"❌ Erreur : {str(e)}\n")
    
    # Test 3 : Générer la convention
    print("📄 Test 3 : Génération de la convention...")
    try:
        file_path = generator.generer_convention(session_id)
        print(f"✅ Convention générée : {file_path}\n")
    except Exception as e:
        print(f"❌ Erreur : {str(e)}\n")
    
    # Test 4 : Générer une convocation (si participants)
    if participants:
        participant_id = participants[0]['id']
        participant_nom = f"{participants[0].get('prenom', '')} {participants[0].get('nom', '')}"
        print(f"📄 Test 4 : Génération de la convocation pour {participant_nom}...")
        try:
            file_path = generator.generer_convocation(session_id, participant_id)
            print(f"✅ Convocation générée : {file_path}\n")
        except Exception as e:
            print(f"❌ Erreur : {str(e)}\n")
    
    # Test 5 : Générer le règlement intérieur
    print("📄 Test 5 : Génération du règlement intérieur...")
    try:
        file_path = generator.generer_reglement_interieur(session_id)
        print(f"✅ Règlement intérieur généré : {file_path}\n")
    except Exception as e:
        print(f"❌ Erreur : {str(e)}\n")
    
    # Test 6 : Générer la feuille d'émargement entreprise
    print("📄 Test 6 : Génération de la feuille d'émargement entreprise...")
    try:
        file_path = generator.generer_feuille_emargement_entreprise(session_id)
        print(f"✅ Feuille d'émargement générée : {file_path}\n")
    except Exception as e:
        print(f"❌ Erreur : {str(e)}\n")
    
    print("=" * 60)
    print("✅ Tests terminés !")
    print(f"📁 Les documents générés sont dans : {generator.output_dir}/")
    print("=" * 60)

if __name__ == '__main__':
    test_generation()
