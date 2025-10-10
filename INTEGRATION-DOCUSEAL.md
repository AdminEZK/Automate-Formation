# 🔐 Intégration DocuSeal - Alternative Gratuite à Yousign

**Version** : 1.0 - MVP  
**Date** : 8 octobre 2025  
**Prix** : **GRATUIT** (open source)

---

## 🎯 POURQUOI DOCUSEAL ?

- ✅ **100% gratuit** (open source)
- ✅ **Auto-hébergé** (contrôle total)
- ✅ **Illimité** (pas de limite de signatures)
- ✅ **Conforme eIDAS** (valeur juridique)
- ✅ **API REST** complète
- ✅ **Webhooks** pour notifications
- ✅ **Interface moderne** et simple

**vs Yousign** : 0€ vs 29€/mois (économie de 348€/an)

---

## 🚀 INSTALLATION DOCKER

### 1. Docker Compose

```yaml
# docker-compose.yml (ajouter ce service)
services:
  docuseal:
    image: docuseal/docuseal:latest
    container_name: docuseal
    ports:
      - "3001:3000"
    volumes:
      - docuseal-data:/data
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/docuseal
      - SECRET_KEY_BASE=${DOCUSEAL_SECRET_KEY}
    restart: unless-stopped
    networks:
      - automate-formation

volumes:
  docuseal-data:

networks:
  automate-formation:
    external: true
```

### 2. Démarrage

```bash
# Générer une clé secrète
openssl rand -hex 64

# Ajouter dans .env
DOCUSEAL_SECRET_KEY=votre_cle_generee
DOCUSEAL_URL=http://localhost:3001

# Démarrer
docker-compose up -d docuseal
```

### 3. Configuration Initiale

```bash
# Accéder à l'interface
open http://localhost:3001

# Créer un compte admin
# Email: admin@votre-domaine.com
# Password: votre_mot_de_passe_securise
```

---

## 🔧 CONFIGURATION API

### 1. Obtenir l'API Key

1. Connexion à DocuSeal
2. Settings > API Keys
3. Créer une nouvelle clé
4. Copier la clé

```bash
# .env
DOCUSEAL_API_KEY=ds_xxxxxxxxxxxxxxxxxxxxx
DOCUSEAL_URL=http://localhost:3001
```

### 2. Service DocuSeal

```javascript
// services/docusealService.js
import axios from 'axios';

const docuseal = axios.create({
  baseURL: process.env.DOCUSEAL_URL,
  headers: {
    'X-Auth-Token': process.env.DOCUSEAL_API_KEY,
    'Content-Type': 'application/json'
  }
});

/**
 * Créer un template de document
 */
export async function createTemplate(templateData) {
  const { name, documentPath } = templateData;
  
  try {
    const response = await docuseal.post('/api/templates', {
      name,
      document_url: documentPath,
      fields: [
        {
          name: 'signature_of',
          type: 'signature',
          required: true,
          page: 0,
          x: 100,
          y: 650,
          w: 200,
          h: 50
        },
        {
          name: 'signature_client',
          type: 'signature',
          required: true,
          page: 0,
          x: 350,
          y: 650,
          w: 200,
          h: 50
        }
      ]
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur création template:', error);
    throw error;
  }
}

/**
 * Envoyer un document pour signature
 */
export async function sendForSignature(signatureData) {
  const {
    templateId,
    signers,
    sessionId,
    documentName
  } = signatureData;
  
  try {
    const response = await docuseal.post('/api/submissions', {
      template_id: templateId,
      send_email: true,
      submitters: signers.map((signer, index) => ({
        role: index === 0 ? 'Organisme Formation' : 'Client',
        email: signer.email,
        name: `${signer.prenom} ${signer.nom}`,
        phone: signer.telephone
      })),
      metadata: {
        session_id: sessionId,
        document_type: 'convention'
      },
      message: `Merci de signer la ${documentName}`
    });
    
    return {
      success: true,
      submissionId: response.data.id,
      submissionSlug: response.data.slug
    };
    
  } catch (error) {
    console.error('Erreur envoi signature:', error);
    throw error;
  }
}

/**
 * Vérifier le statut d'une signature
 */
export async function checkSignatureStatus(submissionId) {
  try {
    const response = await docuseal.get(`/api/submissions/${submissionId}`);
    const submission = response.data;
    
    return {
      status: submission.status, // 'pending', 'completed', 'declined'
      signed: submission.status === 'completed',
      submitters: submission.submitters.map(s => ({
        name: s.name,
        email: s.email,
        status: s.status,
        signedAt: s.completed_at
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
export async function downloadSignedDocument(submissionId) {
  try {
    const response = await docuseal.get(
      `/api/submissions/${submissionId}/download`,
      { responseType: 'arraybuffer' }
    );
    
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Erreur téléchargement:', error);
    throw error;
  }
}

/**
 * Archiver une soumission
 */
export async function archiveSubmission(submissionId) {
  try {
    await docuseal.delete(`/api/submissions/${submissionId}`);
    return { success: true };
  } catch (error) {
    console.error('Erreur archivage:', error);
    throw error;
  }
}

export default {
  createTemplate,
  sendForSignature,
  checkSignatureStatus,
  downloadSignedDocument,
  archiveSubmission
};
```

### 3. Route API

```javascript
// routes/signature.js
import express from 'express';
import { 
  sendForSignature, 
  checkSignatureStatus,
  downloadSignedDocument 
} from '../services/docusealService.js';
import { supabase } from '../services/supabaseService.js';

const router = express.Router();

/**
 * POST /api/signature/convention/:sessionId
 * Envoyer une convention pour signature
 */
router.post('/convention/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // 1. Récupérer les données
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
    
    // 3. Upload temporaire pour DocuSeal
    const { data: upload } = await supabase.storage
      .from('temp')
      .upload(`convention_${sessionId}.pdf`, conventionPdf);
    
    const { data: { publicUrl } } = supabase.storage
      .from('temp')
      .getPublicUrl(upload.path);

    // 4. Définir les signataires
    const signers = [
      {
        prenom: process.env.OF_REPRESENTANT_PRENOM,
        nom: process.env.OF_REPRESENTANT_NOM,
        email: process.env.OF_REPRESENTANT_EMAIL,
        telephone: process.env.OF_REPRESENTANT_TELEPHONE
      },
      {
        prenom: session.entreprise.representant_legal_prenom,
        nom: session.entreprise.representant_legal_nom,
        email: session.entreprise.email_contact,
        telephone: session.entreprise.telephone
      }
    ];

    // 5. Envoyer pour signature
    const result = await sendForSignature({
      templateId: process.env.DOCUSEAL_CONVENTION_TEMPLATE_ID,
      signers,
      sessionId,
      documentName: 'Convention de Formation'
    });

    // 6. Enregistrer dans la BDD
    await supabase
      .from('documents')
      .insert({
        session_formation_id: sessionId,
        type: 'convention',
        file_name: `Convention_${sessionId}.pdf`,
        docuseal_submission_id: result.submissionId,
        status: 'pending_signature'
      });

    res.json({
      success: true,
      message: 'Convention envoyée pour signature',
      submissionId: result.submissionId
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/signature/status/:submissionId
 * Vérifier le statut
 */
router.get('/status/:submissionId', async (req, res) => {
  try {
    const { submissionId } = req.params;
    const status = await checkSignatureStatus(submissionId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/webhooks/docuseal
 * Webhook DocuSeal
 */
router.post('/webhooks/docuseal', async (req, res) => {
  try {
    const event = req.body;

    console.log('Webhook DocuSeal:', event);

    switch (event.event_type) {
      case 'submission.completed':
        await handleSubmissionCompleted(event);
        break;
      
      case 'submission.declined':
        await handleSubmissionDeclined(event);
        break;
      
      case 'submitter.completed':
        await handleSubmitterCompleted(event);
        break;
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Erreur webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Gérer la fin d'une soumission
 */
async function handleSubmissionCompleted(event) {
  const { submission } = event;
  
  // 1. Télécharger le document signé
  const signedPdf = await downloadSignedDocument(submission.id);
  
  // 2. Uploader dans Supabase Storage
  const fileName = `conventions/signed_${submission.id}.pdf`;
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
    .eq('docuseal_submission_id', submission.id);
  
  // 4. Mettre à jour le statut de la session
  const { data: doc } = await supabase
    .from('documents')
    .select('session_formation_id')
    .eq('docuseal_submission_id', submission.id)
    .single();
  
  await supabase
    .from('sessions_formation')
    .update({ statut: 'confirmee' })
    .eq('id', doc.session_formation_id);
  
  // 5. Envoyer email de confirmation
  // TODO: Implémenter avec Resend
}

async function handleSubmissionDeclined(event) {
  const { submission } = event;
  
  await supabase
    .from('documents')
    .update({ status: 'declined' })
    .eq('docuseal_submission_id', submission.id);
}

async function handleSubmitterCompleted(event) {
  const { submitter } = event;
  console.log(`${submitter.name} a signé`);
}

export default router;
```

---

## 🔔 WEBHOOKS DOCUSEAL

### Configuration

1. **Dans DocuSeal** :
   - Settings > Webhooks
   - URL : `https://votre-domaine.com/api/webhooks/docuseal`
   - Events : 
     - `submission.completed`
     - `submission.declined`
     - `submitter.completed`

---

## 📊 TABLE SUPABASE

```sql
-- Ajouter colonnes DocuSeal
ALTER TABLE documents ADD COLUMN docuseal_submission_id VARCHAR(255);
ALTER TABLE documents ADD COLUMN docuseal_template_id VARCHAR(255);
ALTER TABLE documents ADD COLUMN status VARCHAR(50) DEFAULT 'draft';
ALTER TABLE documents ADD COLUMN signed_at TIMESTAMP;

-- Index
CREATE INDEX idx_documents_docuseal_submission ON documents(docuseal_submission_id);
```

---

## 🎨 INTERFACE UTILISATEUR

DocuSeal fournit une interface web complète :
- Dashboard des signatures
- Création de templates
- Suivi en temps réel
- Historique

**Accès** : http://localhost:3001

---

## 🔒 SÉCURITÉ

### Production

```yaml
# docker-compose.yml (production)
services:
  docuseal:
    image: docuseal/docuseal:latest
    environment:
      - FORCE_SSL=true
      - ALLOWED_HOSTS=votre-domaine.com
      - SECRET_KEY_BASE=${DOCUSEAL_SECRET_KEY}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.docuseal.rule=Host(`signatures.votre-domaine.com`)"
      - "traefik.http.routers.docuseal.tls.certresolver=letsencrypt"
```

---

## 💰 COMPARAISON COÛTS

| Service | Coût/mois | 10 signatures | 50 signatures | 100 signatures |
|---------|-----------|---------------|---------------|----------------|
| **DocuSeal** | **0€** | **0€** | **0€** | **0€** |
| Yousign | 29€ | 29€ | 99€ | 199€ |
| Universign | 0€ | 5€ | 25€ | 50€ |
| DocuSign | 25€ | 25€ | 65€ | 125€ |

**Économie annuelle avec DocuSeal** : **348€ à 2388€**

---

## ✅ AVANTAGES DOCUSEAL

- ✅ **Gratuit** (open source)
- ✅ **Illimité** (pas de limite)
- ✅ **Auto-hébergé** (contrôle total)
- ✅ **Conforme** (eIDAS)
- ✅ **API complète**
- ✅ **Webhooks**
- ✅ **Interface moderne**
- ✅ **Mobile friendly**
- ✅ **Personnalisable**

---

## ⚠️ INCONVÉNIENTS

- ❌ Vous devez l'héberger (Docker)
- ❌ Maintenance à votre charge
- ❌ Pas de support commercial
- ❌ Moins connu que Yousign

---

## 🚀 MIGRATION FACILE

Si vous voulez passer à Yousign plus tard :
- L'API est similaire
- Changez juste le service
- Les workflows restent identiques

---

## 📚 DOCUMENTATION

- **GitHub** : https://github.com/docusealco/docuseal
- **Docs** : https://www.docuseal.co/docs
- **API** : https://www.docuseal.co/docs/api

---

**Avec DocuSeal, vous économisez 348€/an tout en ayant une solution professionnelle et conforme !** 💰✅
