# 🔐 Intégration Yousign - Signature Électronique

**Version** : 1.0 - MVP  
**Date** : 8 octobre 2025

---

## 🎯 OBJECTIF

Intégrer **Yousign** pour la signature électronique des documents dans le MVP, notamment :
- Convention de formation
- Contrat formateur (sous-traitance)

---

## 📋 DOCUMENTS À SIGNER

### 1. **Convention de Formation** (Client)
- **Signataires** : 2
  - Représentant OF (organisme)
  - Représentant entreprise cliente
- **Déclenchement** : Après acceptation proposition
- **Statut** : `en_attente` → `confirmee`

### 2. **Contrat Formateur** (Sous-traitance)
- **Signataires** : 2
  - Représentant OF
  - Formateur
- **Déclenchement** : Lors de la mobilisation formateur
- **Statut** : Contrat actif

---

## 🔧 CONFIGURATION YOUSIGN

### 1. Créer un Compte

1. **Inscription** : https://yousign.com
2. **Plan** : Starter (29€/mois) ou Business (99€/mois)
3. **Mode** : Production

### 2. Obtenir les Credentials

```bash
# Dans le dashboard Yousign
# Settings > API Keys

YOUSIGN_API_KEY=your_api_key_here
YOUSIGN_ENVIRONMENT=production  # ou 'sandbox' pour tests
```

### 3. Configuration .env

```bash
# .env
YOUSIGN_API_KEY=ys_xxxxxxxxxxxxxxxxxxxxx
YOUSIGN_ENVIRONMENT=production
YOUSIGN_WEBHOOK_URL=https://votre-domaine.com/api/webhooks/yousign
```

---

## 💻 IMPLÉMENTATION

### 1. Installation

```bash
npm install @yousign/yousign-api
```

### 2. Service Yousign

```javascript
// services/yousignService.js
import { Yousign } from '@yousign/yousign-api';

const yousign = new Yousign({
  apiKey: process.env.YOUSIGN_API_KEY,
  environment: process.env.YOUSIGN_ENVIRONMENT
});

/**
 * Créer une procédure de signature
 */
export async function createSignatureProcedure(documentData) {
  const {
    documentPath,
    documentName,
    signers,
    sessionId
  } = documentData;

  try {
    // 1. Upload du document
    const file = await yousign.files.create({
      name: documentName,
      content: documentPath, // Base64 ou URL
      type: 'signable'
    });

    // 2. Créer la procédure
    const procedure = await yousign.procedures.create({
      name: `Signature - ${documentName}`,
      description: `Session de formation #${sessionId}`,
      start: true, // Démarrer immédiatement
      ordered: false, // Signatures dans n'importe quel ordre
      metadata: {
        session_id: sessionId,
        document_type: 'convention'
      }
    });

    // 3. Ajouter les signataires
    for (const signer of signers) {
      await yousign.members.create({
        procedure: procedure.id,
        user: {
          firstname: signer.prenom,
          lastname: signer.nom,
          email: signer.email,
          phone: signer.telephone
        },
        fileObjects: [{
          file: file.id,
          page: 1, // Page où signer
          position: signer.position || '100,100,300,150', // x,y,width,height
          mention: 'Lu et approuvé',
          mention2: 'Signature précédée de la mention "Lu et approuvé"'
        }]
      });
    }

    return {
      success: true,
      procedureId: procedure.id,
      fileId: file.id
    };

  } catch (error) {
    console.error('Erreur Yousign:', error);
    throw error;
  }
}

/**
 * Vérifier le statut d'une procédure
 */
export async function checkSignatureStatus(procedureId) {
  try {
    const procedure = await yousign.procedures.get(procedureId);
    
    return {
      status: procedure.status, // 'draft', 'active', 'finished', 'expired', 'refused'
      signed: procedure.status === 'finished',
      members: procedure.members.map(m => ({
        name: `${m.firstname} ${m.lastname}`,
        email: m.email,
        status: m.status,
        signedAt: m.operationDate
      }))
    };
  } catch (error) {
    console.error('Erreur vérification:', error);
    throw error;
  }
}

/**
 * Télécharger le document signé
 */
export async function downloadSignedDocument(fileId) {
  try {
    const file = await yousign.files.download(fileId);
    return file; // Buffer du PDF signé
  } catch (error) {
    console.error('Erreur téléchargement:', error);
    throw error;
  }
}

/**
 * Annuler une procédure
 */
export async function cancelSignatureProcedure(procedureId) {
  try {
    await yousign.procedures.cancel(procedureId);
    return { success: true };
  } catch (error) {
    console.error('Erreur annulation:', error);
    throw error;
  }
}
```

### 3. Route API

```javascript
// routes/signature.js
import express from 'express';
import { 
  createSignatureProcedure, 
  checkSignatureStatus,
  downloadSignedDocument 
} from '../services/yousignService.js';
import { supabase } from '../services/supabaseService.js';

const router = express.Router();

/**
 * POST /api/signature/convention/:sessionId
 * Envoyer une convention pour signature
 */
router.post('/convention/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // 1. Récupérer les données de la session
    const { data: session } = await supabase
      .from('sessions_formation')
      .select(`
        *,
        entreprise:entreprises(*),
        formation:formations_catalogue(*)
      `)
      .eq('id', sessionId)
      .single();

    // 2. Générer la convention PDF
    const conventionPdf = await generateConventionPDF(session);

    // 3. Définir les signataires
    const signers = [
      {
        prenom: process.env.OF_REPRESENTANT_PRENOM,
        nom: process.env.OF_REPRESENTANT_NOM,
        email: process.env.OF_REPRESENTANT_EMAIL,
        telephone: process.env.OF_REPRESENTANT_TELEPHONE,
        position: '100,650,300,700' // Position signature page 1
      },
      {
        prenom: session.entreprise.representant_legal_prenom,
        nom: session.entreprise.representant_legal_nom,
        email: session.entreprise.email_contact,
        telephone: session.entreprise.telephone,
        position: '350,650,550,700' // Position signature page 1
      }
    ];

    // 4. Créer la procédure Yousign
    const result = await createSignatureProcedure({
      documentPath: conventionPdf,
      documentName: `Convention_Formation_${sessionId}.pdf`,
      signers,
      sessionId
    });

    // 5. Enregistrer dans la BDD
    await supabase
      .from('documents')
      .insert({
        session_formation_id: sessionId,
        type: 'convention',
        file_name: `Convention_${sessionId}.pdf`,
        yousign_procedure_id: result.procedureId,
        yousign_file_id: result.fileId,
        status: 'pending_signature'
      });

    res.json({
      success: true,
      message: 'Convention envoyée pour signature',
      procedureId: result.procedureId
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/signature/status/:procedureId
 * Vérifier le statut d'une signature
 */
router.get('/status/:procedureId', async (req, res) => {
  try {
    const { procedureId } = req.params;
    const status = await checkSignatureStatus(procedureId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/webhooks/yousign
 * Webhook Yousign (notifications)
 */
router.post('/webhooks/yousign', async (req, res) => {
  try {
    const event = req.body;

    console.log('Webhook Yousign:', event);

    // Vérifier la signature du webhook (sécurité)
    // TODO: Implémenter vérification signature

    switch (event.eventName) {
      case 'procedure.finished':
        await handleProcedureFinished(event);
        break;
      
      case 'procedure.refused':
        await handleProcedureRefused(event);
        break;
      
      case 'member.finished':
        await handleMemberSigned(event);
        break;
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Erreur webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Gérer la fin d'une procédure (tous signés)
 */
async function handleProcedureFinished(event) {
  const { procedure } = event;
  
  // 1. Télécharger le document signé
  const signedPdf = await downloadSignedDocument(procedure.files[0].id);
  
  // 2. Uploader dans Supabase Storage
  const fileName = `conventions/signed_${procedure.id}.pdf`;
  await supabase.storage
    .from('documents')
    .upload(fileName, signedPdf);
  
  // 3. Mettre à jour la BDD
  await supabase
    .from('documents')
    .update({
      status: 'signed',
      file_path: fileName,
      signed_at: new Date()
    })
    .eq('yousign_procedure_id', procedure.id);
  
  // 4. Mettre à jour le statut de la session
  const { data: doc } = await supabase
    .from('documents')
    .select('session_formation_id')
    .eq('yousign_procedure_id', procedure.id)
    .single();
  
  await supabase
    .from('sessions_formation')
    .update({ statut: 'confirmee' })
    .eq('id', doc.session_formation_id);
  
  // 5. Envoyer email de confirmation
  // TODO: Implémenter avec Resend
}

/**
 * Gérer le refus d'une procédure
 */
async function handleProcedureRefused(event) {
  const { procedure } = event;
  
  await supabase
    .from('documents')
    .update({ status: 'refused' })
    .eq('yousign_procedure_id', procedure.id);
  
  // TODO: Notifier l'OF
}

/**
 * Gérer la signature d'un membre
 */
async function handleMemberSigned(event) {
  const { member } = event;
  
  console.log(`${member.firstname} ${member.lastname} a signé`);
  
  // TODO: Notifier l'autre partie
}

export default router;
```

### 4. Workflow Windmill

```python
# windmill_flows/send_convention_signature.py
import requests
import os

def main(session_id: str):
    """
    Envoyer une convention pour signature via Yousign
    """
    api_url = os.getenv('API_URL')
    
    # Appeler l'API pour créer la procédure
    response = requests.post(
        f'{api_url}/api/signature/convention/{session_id}'
    )
    
    if response.status_code == 200:
        result = response.json()
        return {
            'success': True,
            'procedure_id': result['procedureId'],
            'message': 'Convention envoyée pour signature'
        }
    else:
        raise Exception(f'Erreur: {response.text}')
```

---

## 🔔 WEBHOOKS YOUSIGN

### Configuration

1. **Dans Yousign Dashboard** :
   - Settings > Webhooks
   - URL : `https://votre-domaine.com/api/webhooks/yousign`
   - Events : 
     - `procedure.finished`
     - `procedure.refused`
     - `member.finished`

### Sécurité

```javascript
// Vérifier la signature du webhook
import crypto from 'crypto';

function verifyYousignWebhook(payload, signature) {
  const secret = process.env.YOUSIGN_WEBHOOK_SECRET;
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return hash === signature;
}
```

---

## 📊 TABLE SUPABASE

```sql
-- Ajouter colonnes Yousign dans la table documents
ALTER TABLE documents ADD COLUMN yousign_procedure_id VARCHAR(255);
ALTER TABLE documents ADD COLUMN yousign_file_id VARCHAR(255);
ALTER TABLE documents ADD COLUMN status VARCHAR(50) DEFAULT 'draft';
ALTER TABLE documents ADD COLUMN signed_at TIMESTAMP;

-- Index
CREATE INDEX idx_documents_yousign_procedure ON documents(yousign_procedure_id);
```

---

## 🎯 PARCOURS UTILISATEUR

### 1. OF envoie la convention
```
OF clique "Envoyer pour signature"
  ↓
Système génère PDF
  ↓
Yousign crée procédure
  ↓
Emails envoyés aux 2 signataires
```

### 2. Signataires signent
```
Client reçoit email Yousign
  ↓
Clique sur lien
  ↓
Lit la convention
  ↓
Signe électroniquement
  ↓
Confirmation
```

### 3. Document finalisé
```
Tous ont signé
  ↓
Webhook → Système notifié
  ↓
PDF signé téléchargé
  ↓
Stocké dans Supabase
  ↓
Statut session → confirmee
  ↓
Emails de confirmation
```

---

## 💰 COÛTS YOUSIGN

### Plans
- **Starter** : 29€/mois - 10 signatures/mois
- **Business** : 99€/mois - 50 signatures/mois
- **Enterprise** : Sur devis - Illimité

### Signatures supplémentaires
- 2€ par signature au-delà du forfait

---

## ✅ AVANTAGES

- ✅ **Légal** : Valeur juridique (eIDAS)
- ✅ **Rapide** : Signature en 2 minutes
- ✅ **Traçabilité** : Horodatage, certificat
- ✅ **UX** : Interface simple et claire
- ✅ **Mobile** : Signature sur smartphone
- ✅ **Français** : Conforme RGPD

---

## 🚀 PROCHAINES ÉTAPES

1. ✅ Créer compte Yousign
2. ✅ Obtenir API Key
3. ✅ Implémenter service
4. ✅ Tester en sandbox
5. ✅ Configurer webhooks
6. ✅ Passer en production

---

**Avec Yousign, la signature des conventions passe de 3 jours (courrier) à 5 minutes (électronique) !** ⚡
