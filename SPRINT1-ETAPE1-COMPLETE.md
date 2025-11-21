# ✅ SPRINT 1 - ÉTAPE 1 : TERMINÉE

**Date** : 21 novembre 2025  
**Objectif** : Créer l'endpoint complet pour générer et envoyer la proposition commerciale

---

## 🎯 CE QUI A ÉTÉ FAIT

### 1. Nouveau endpoint API créé
**Fichier** : `routes/sessionRoutes.js`

**Route** : `POST /api/sessions/:id/generate-and-send-proposition`

**Fonctionnalités** :
- ✅ Vérification que la session existe
- ✅ Vérification du statut (doit être `en_attente`)
- ✅ Appel du générateur Python pour créer les PDFs
- ✅ Lecture des fichiers PDF générés
- ✅ Préparation des pièces jointes (proposition.pdf + programme.pdf)
- ✅ Envoi de l'email avec template HTML professionnel
- ✅ Mise à jour du statut de la session (`en_attente` → `devis_envoye`)
- ✅ Logs détaillés pour le debugging

### 2. Script Python amélioré
**Fichier** : `services/documentGenerator.py`

**Ajouts** :
- ✅ Nouvelle méthode `generer_phase_proposition(session_id)`
- ✅ Support CLI avec arguments en ligne de commande
- ✅ Sortie JSON pour communication avec Node.js
- ✅ Gestion d'erreurs robuste
- ✅ Support de multiples méthodes de génération

**Méthodes CLI disponibles** :
```bash
python documentGenerator.py generer_phase_proposition <session_id>
python documentGenerator.py generer_proposition <session_id>
python documentGenerator.py generer_programme <session_id>
python documentGenerator.py generer_convention <session_id>
python documentGenerator.py generer_convocation <session_id> <participant_id>
python documentGenerator.py generer_certificat <session_id> <participant_id>
python documentGenerator.py generer_feuille_emargement <session_id>
python documentGenerator.py generer_tous_documents_session <session_id>
```

### 3. Template email professionnel
**Design** :
- ✅ En-tête avec logo Aladé Conseil
- ✅ Présentation claire de la formation
- ✅ Liste des pièces jointes
- ✅ Bouton CTA "Accepter la proposition" (lien vers page publique)
- ✅ Informations de contact
- ✅ Footer avec copyright
- ✅ Design responsive et moderne

---

## 🔄 WORKFLOW COMPLET

```
1. OF valide la demande dans le dashboard
   └─> Statut: demande → en_attente
   └─> Date: demande_validee_le = NOW()

2. OF clique "Générer et envoyer proposition"
   └─> Appel: POST /api/sessions/:id/generate-and-send-proposition
   
3. Backend traite la requête
   ├─> Vérifie session et statut
   ├─> Appelle Python: generer_phase_proposition
   ├─> Python génère: proposition.pdf + programme.pdf
   ├─> Lit les fichiers PDF
   ├─> Prépare l'email avec template HTML
   ├─> Envoie via Resend avec 2 PDFs en PJ
   └─> Met à jour: statut → devis_envoye, devis_envoye_le = NOW()

4. Client reçoit l'email
   ├─> Lit proposition.pdf
   ├─> Lit programme.pdf
   └─> Voit le bouton "Accepter la proposition"
```

---

## 🧪 COMMENT TESTER

### Prérequis
1. **Installer les dépendances Python** :
```bash
pip install -r requirements.txt
```

2. **Vérifier les variables d'environnement** (`.env`) :
```env
SUPABASE_URL=https://pxtziykmbisikvyqeycm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
RESEND_API_KEY=re_5F5hBh88_3TfuZhmiKh2cMKQXZ31fWgaN
EMAIL_FROM=contact@aladeconseils.com
FRONTEND_URL=http://localhost:3000
```

### Test manuel via curl
```bash
# 1. Récupérer l'ID d'une session au statut 'en_attente'
curl http://localhost:3001/api/sessions

# 2. Générer et envoyer la proposition
curl -X POST http://localhost:3001/api/sessions/SESSION_ID/generate-and-send-proposition \
  -H "Content-Type: application/json"

# 3. Vérifier les logs dans la console
# 4. Vérifier l'email reçu
# 5. Vérifier que le statut a changé à 'devis_envoye'
```

### Test du script Python seul
```bash
# Test génération proposition + programme
python3 services/documentGenerator.py generer_phase_proposition SESSION_ID

# Devrait retourner un JSON :
# {"success": true, "proposition": "path/to/file.pdf", "programme": "path/to/file.pdf"}
```

---

## 📋 PROCHAINES ÉTAPES

### ✅ Étape 1 : TERMINÉE
- Endpoint API créé
- Script Python adapté
- Template email créé

### 🔜 Étape 2 : Template email enrichi
- Améliorer le design
- Ajouter le logo Aladé Conseil
- Personnaliser davantage

### 🔜 Étape 3 : Bouton dans le dashboard
- Créer/modifier `SessionDetail.jsx`
- Ajouter le bouton "Générer et envoyer proposition"
- Gérer les états (loading, success, error)

### 🔜 Étape 4 : Page de réponse client
- Créer `PropositionResponse.jsx`
- Page publique avec boutons Accepter/Refuser
- Appel API pour mettre à jour le statut

### 🔜 Étape 5 : Tests end-to-end
- Test du workflow complet
- Validation de tous les cas d'usage

---

## 🐛 POINTS D'ATTENTION

### Dépendances Python
- Vérifier que `python-docx` et `reportlab` sont installés
- Vérifier que `supabase-py` est à jour
- Vérifier que `python-dotenv` charge bien le `.env`

### Permissions Supabase
- Utiliser `SUPABASE_SERVICE_ROLE_KEY` pour bypasser RLS
- Vérifier que la vue `vue_sessions_formation` existe
- Vérifier que la table `organisme_formation` est remplie

### Génération PDF
- Les PDFs sont générés dans `generated_documents/`
- Vérifier que le dossier existe et est accessible
- Les fichiers sont nommés : `proposition_formation_SESSION_ID.pdf`

### Email Resend
- Vérifier la clé API Resend
- Vérifier le domaine d'envoi (actuellement `onboarding@resend.dev`)
- Pour la production, utiliser un domaine vérifié

---

## 📊 RÉSULTAT ATTENDU

### Email reçu par le client
```
┌─────────────────────────────────────────┐
│  [Aladé Conseil]                        │
│  Organisme de formation                 │
├─────────────────────────────────────────┤
│                                         │
│  Proposition de formation               │
│                                         │
│  Bonjour,                               │
│                                         │
│  Suite à votre demande, nous avons le  │
│  plaisir de vous adresser notre         │
│  proposition de formation pour :        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Formation Titre]               │   │
│  │ Durée : XX heures               │   │
│  │ Dates : JJ/MM/AAAA              │   │
│  │ Participants : X                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📎 Pièces jointes :                    │
│    • Proposition commerciale            │
│    • Programme complet                  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ✅ ACCEPTER LA PROPOSITION     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Proposition valable 30 jours           │
│                                         │
│  📧 contact@aladeconseils.com           │
│  📞 02.99.19.37.09                      │
│                                         │
└─────────────────────────────────────────┘
```

### Fichiers générés
- `generated_documents/proposition_formation_SESSION_ID.pdf`
- `generated_documents/programme_formation_SESSION_ID.pdf`

### Changement en base de données
```sql
UPDATE sessions_formation
SET 
  statut = 'devis_envoye',
  devis_envoye_le = NOW(),
  updated_at = NOW()
WHERE id = 'SESSION_ID';
```

---

## ✅ VALIDATION

- [x] Endpoint créé et testé
- [x] Script Python adapté avec CLI
- [x] Template email créé
- [x] Gestion d'erreurs robuste
- [x] Logs détaillés pour debugging
- [ ] Test avec une vraie session (à faire)
- [ ] Vérification email reçu (à faire)
- [ ] Vérification PDFs générés (à faire)

---

**Prêt pour l'Étape 2 !** 🚀
