#!/usr/bin/env python3
"""
Script de test pour générer des documents Qualiopi
Sans avoir besoin de Resend ou Yousign
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client

# Charger les variables d'environnement
load_dotenv()

# Configuration Supabase
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

print("🚀 Test de Génération de Documents Qualiopi")
print("=" * 60)
print(f"📍 Supabase URL: {SUPABASE_URL}")
print()

# Créer le client Supabase
try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Connexion Supabase réussie")
except Exception as e:
    print(f"❌ Erreur connexion Supabase: {e}")
    sys.exit(1)

# Vérifier les tables
print("\n📊 Vérification des tables...")
try:
    # Compter les entreprises
    entreprises = supabase.table('entreprises').select('id', count='exact').execute()
    print(f"   - Entreprises: {entreprises.count}")
    
    # Compter les formations
    formations = supabase.table('formations_catalogue').select('id', count='exact').execute()
    print(f"   - Formations: {formations.count}")
    
    # Compter les sessions
    sessions = supabase.table('sessions_formation').select('id', count='exact').execute()
    print(f"   - Sessions: {sessions.count}")
    
    # Compter les participants
    participants = supabase.table('participants').select('id', count='exact').execute()
    print(f"   - Participants: {participants.count}")
    
    # Vérifier l'organisme
    organisme = supabase.table('organisme_formation').select('*').limit(1).execute()
    if organisme.data:
        print(f"   - Organisme: {organisme.data[0]['nom']}")
    else:
        print("   ⚠️  Organisme non configuré")
    
except Exception as e:
    print(f"❌ Erreur lors de la vérification: {e}")
    sys.exit(1)

# Si on a des sessions, on peut tester la génération
if sessions.count > 0:
    print("\n📄 Test de génération de documents...")
    
    # Récupérer la première session
    session = supabase.table('vue_sessions_complete').select('*').limit(1).execute()
    
    if session.data:
        session_data = session.data[0]
        print(f"   Session trouvée: {session_data.get('formation_titre', 'N/A')}")
        print(f"   Entreprise: {session_data.get('entreprise_nom', 'N/A')}")
        print(f"   Dates: {session_data.get('date_debut', 'N/A')} → {session_data.get('date_fin', 'N/A')}")
        
        # Importer le générateur
        try:
            sys.path.append(os.path.join(os.path.dirname(__file__), 'services'))
            from documentGeneratorExtended import QualiopisDocumentGeneratorExtended
            
            print("\n🔨 Génération des documents...")
            generator = QualiopisDocumentGeneratorExtended(supabase)
            
            # Générer tous les documents
            documents = generator.generer_tous_documents_complets(session_data['id'])
            
            print("\n✅ Documents générés avec succès!")
            print("\n📋 Résumé:")
            total = 0
            for type_doc, fichiers in documents.items():
                count = len(fichiers)
                total += count
                print(f"   - {type_doc}: {count} document(s)")
            
            print(f"\n🎉 TOTAL: {total} documents générés!")
            print(f"📁 Dossier: {os.path.join(os.getcwd(), 'generated_documents')}")
            
        except Exception as e:
            print(f"❌ Erreur lors de la génération: {e}")
            import traceback
            traceback.print_exc()
    else:
        print("   ⚠️  Aucune session trouvée")
else:
    print("\n⚠️  Aucune session dans la base de données")
    print("\n💡 Pour créer une session de test, exécutez le SQL ci-dessus dans Supabase")

print("\n" + "=" * 60)
print("✅ Test terminé!")
