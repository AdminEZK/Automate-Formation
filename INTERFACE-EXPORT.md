# 📥 Interface Utilisateur - Fonctionnalités d'Export

**Version** : 1.0 - MVP  
**Date** : 8 octobre 2025

---

## 🎯 OBJECTIF

Permettre aux utilisateurs de **télécharger et exporter** tous les documents et données depuis l'interface web, sans dépendance à un stockage cloud externe.

---

## 📊 PAGES DE L'INTERFACE

### 1. **Dashboard Principal**

**Vue d'ensemble** :
- Liste des sessions en cours
- Statistiques rapides
- Actions rapides

**Boutons d'export** :
- 📥 **Exporter toutes les sessions** (CSV/Excel)
- 📥 **Exporter les statistiques** (PDF)

---

### 2. **Page Session Individuelle**

**Informations affichées** :
- Détails de la session
- Entreprise cliente
- Formation
- Participants
- Documents générés
- Historique

**Boutons d'export** :
```
┌─────────────────────────────────────┐
│  Session #12345                     │
│  Formation: Gestion de Projet       │
│  Entreprise: Acme Corp              │
│  Statut: Terminée                   │
│                                     │
│  📥 Télécharger tous les documents  │
│  📥 Exporter dossier complet (ZIP)  │
│  📥 Générer rapport session (PDF)   │
└─────────────────────────────────────┘
```

**Actions disponibles** :
1. ✅ **Télécharger tous les documents** - ZIP avec tous les PDFs
2. ✅ **Exporter dossier complet** - ZIP avec documents + données JSON
3. ✅ **Générer rapport session** - PDF récapitulatif

---

### 3. **Page Documents**

**Liste des documents** :
- Tous les documents générés
- Filtres par type, date, session
- Recherche

**Interface** :
```
┌──────────────────────────────────────────────────────┐
│  Documents                                           │
│  ┌────────────────────────────────────────────────┐ │
│  │ 🔍 Rechercher...    [Type ▼] [Date ▼] [Session ▼] │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ☑ Convention - Session #123 - 01/10/2025           │
│     📥 Télécharger PDF  |  👁️ Aperçu                │
│                                                      │
│  ☑ Certificat - Jean Dupont - 05/10/2025            │
│     📥 Télécharger PDF  |  👁️ Aperçu                │
│                                                      │
│  [☑ Sélectionner tout]                              │
│  📥 Télécharger sélection (ZIP)                     │
└──────────────────────────────────────────────────────┘
```

**Actions disponibles** :
1. ✅ **Télécharger document individuel** - PDF
2. ✅ **Télécharger sélection** - ZIP multiple
3. ✅ **Aperçu** - Visualisation dans le navigateur

---

### 4. **Page Participants**

**Liste des participants** :
- Tous les participants
- Filtres par session, entreprise
- Recherche

**Boutons d'export** :
- 📥 **Exporter liste participants** (CSV/Excel)
- 📥 **Exporter avec documents** (ZIP)
- 📥 **Exporter certificats** (ZIP)

---

### 5. **Page Évaluations**

**Résultats des évaluations** :
- Évaluations à chaud
- Évaluations à froid
- Évaluations clients
- Statistiques

**Boutons d'export** :
- 📥 **Exporter résultats** (CSV/Excel)
- 📥 **Exporter graphiques** (PDF)
- 📥 **Rapport d'analyse** (PDF)

---

### 6. **Page Entreprises**

**Liste des entreprises clientes** :
- Informations entreprises
- Historique formations
- Documents

**Boutons d'export** :
- 📥 **Exporter liste entreprises** (CSV)
- 📥 **Exporter dossier client** (ZIP)
- 📥 **Rapport activité client** (PDF)

---

## 📦 FORMATS D'EXPORT

### 1. **Documents PDF**
- Tous les documents générés
- Format : PDF/A (archivage)
- Nom : `[Type]_[Session]_[Date].pdf`

### 2. **Archives ZIP**
- Structure organisée par dossiers
- Nom : `Session_[ID]_[Date].zip`

**Structure ZIP** :
```
Session_12345_20251008.zip
├── 01_Commercial/
│   ├── Proposition_Formation.pdf
│   └── Programme_Formation.pdf
├── 02_Contractuel/
│   └── Convention_Signee.pdf
├── 03_Preparation/
│   ├── Questionnaire_Prealable_Participant1.pdf
│   └── Questionnaire_Prealable_Participant2.pdf
├── 04_Convocation/
│   ├── Convocation_Participant1.pdf
│   ├── Convocation_Participant2.pdf
│   └── Reglement_Interieur.pdf
├── 05_Formation/
│   ├── Feuille_Emargement_Jour1.pdf
│   └── Feuille_Emargement_Jour2.pdf
├── 06_Evaluations/
│   ├── Evaluation_Chaud_Participant1.pdf
│   ├── Evaluation_Chaud_Participant2.pdf
│   ├── Evaluation_Froid_Participant1.pdf
│   └── Evaluation_Client.pdf
├── 07_Certificats/
│   ├── Certificat_Participant1.pdf
│   └── Certificat_Participant2.pdf
└── session_data.json
```

### 3. **Données CSV/Excel**
- Listes (participants, sessions, entreprises)
- Format : CSV UTF-8 ou XLSX
- Nom : `[Type]_Export_[Date].csv`

### 4. **Rapports PDF**
- Rapport session
- Rapport statistiques
- Rapport Qualiopi
- Format : PDF avec graphiques

### 5. **Données JSON**
- Export technique
- Toutes les métadonnées
- Format : JSON structuré

---

## 🔧 IMPLÉMENTATION TECHNIQUE

### Frontend (React)

```javascript
// components/ExportButton.jsx
import { Download } from 'lucide-react';

export function ExportButton({ sessionId, type }) {
  const handleExport = async () => {
    const response = await fetch(`/api/export/${type}/${sessionId}`);
    const blob = await response.blob();
    
    // Téléchargement automatique
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${sessionId}_${Date.now()}.${getExtension(type)}`;
    a.click();
  };

  return (
    <button onClick={handleExport}>
      <Download /> Télécharger {type}
    </button>
  );
}
```

### Backend (Express)

```javascript
// routes/export.js
import express from 'express';
import archiver from 'archiver';
import { supabase } from '../services/supabaseService.js';

const router = express.Router();

// Export ZIP complet d'une session
router.get('/export/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  
  // Récupérer tous les documents
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('session_id', sessionId);
  
  // Créer archive ZIP
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  res.attachment(`Session_${sessionId}_${Date.now()}.zip`);
  archive.pipe(res);
  
  // Ajouter chaque document
  for (const doc of documents) {
    const { data: file } = await supabase.storage
      .from('documents')
      .download(doc.file_path);
    
    archive.append(file, { 
      name: `${doc.category}/${doc.file_name}` 
    });
  }
  
  // Ajouter métadonnées JSON
  const metadata = await getSessionMetadata(sessionId);
  archive.append(JSON.stringify(metadata, null, 2), { 
    name: 'session_data.json' 
  });
  
  archive.finalize();
});

// Export CSV participants
router.get('/export/participants/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  
  const { data: participants } = await supabase
    .from('participants')
    .select('*')
    .eq('session_formation_id', sessionId);
  
  // Convertir en CSV
  const csv = convertToCSV(participants);
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=Participants_${sessionId}.csv`);
  res.send(csv);
});

// Export rapport PDF
router.get('/export/report/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  
  // Générer rapport PDF avec ReportLab ou PDFKit
  const pdf = await generateSessionReport(sessionId);
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Rapport_${sessionId}.pdf`);
  res.send(pdf);
});

export default router;
```

---

## 📱 INTERFACE MOBILE

**Responsive** :
- Boutons d'export adaptés mobile
- Téléchargement direct sur appareil
- Partage via système natif

---

## 🔒 SÉCURITÉ

### Contrôle d'accès
- ✅ Authentification requise
- ✅ Vérification permissions (RLS Supabase)
- ✅ Logs des téléchargements

### Protection données
- ✅ URLs signées temporaires (1h)
- ✅ Pas de cache navigateur
- ✅ HTTPS obligatoire

---

## 📊 STATISTIQUES D'EXPORT

**Tracking** :
- Nombre de téléchargements par document
- Types d'exports les plus utilisés
- Utilisateurs actifs

**Table Supabase** :
```sql
CREATE TABLE export_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    session_id UUID REFERENCES sessions_formation(id),
    export_type VARCHAR(50), -- 'pdf', 'zip', 'csv', 'report'
    document_id UUID REFERENCES documents(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 PRIORITÉS MVP

### Phase 1 (MVP)
1. ✅ Téléchargement PDF individuel
2. ✅ Export ZIP session complète
3. ✅ Export CSV participants
4. ✅ Export CSV sessions

### Phase 2
5. ✅ Rapports PDF automatiques
6. ✅ Export Excel (XLSX)
7. ✅ Statistiques d'export
8. ✅ Partage sécurisé (liens temporaires)

---

## 💡 BONNES PRATIQUES

### UX
- Boutons clairs et visibles
- Feedback visuel (loading, succès)
- Noms de fichiers explicites
- Organisation logique des dossiers

### Performance
- Génération asynchrone pour gros fichiers
- Compression optimale
- Cache côté serveur (1h)
- Streaming pour gros ZIP

### Accessibilité
- Raccourcis clavier
- Descriptions ARIA
- Support lecteurs d'écran

---

**L'interface d'export permet une autonomie totale sans dépendance à un stockage cloud externe, tout en gardant la traçabilité et la sécurité.**
