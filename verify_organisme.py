import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("🔍 Vérification de l'organisme...")
try:
    result = supabase.table('organisme_formation').select('*').execute()
    if result.data:
        print(f"✅ Organisme trouvé: {result.data[0]['nom']}")
        print(f"   SIRET: {result.data[0]['siret']}")
        print(f"   Ville: {result.data[0]['ville']}")
    else:
        print("❌ Aucun organisme dans la table")
        print("\n💡 Exécutez config-organisme-alade.sql dans Supabase")
except Exception as e:
    print(f"❌ Erreur: {e}")
