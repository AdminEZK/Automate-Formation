# 📧 Configuration Resend - Guide Complet

**Service d'envoi d'emails pour Automate Formation**

---

## 🎯 Objectif

Configurer Resend pour envoyer automatiquement tous les emails du parcours de formation :
- Confirmation de demande
- Proposition commerciale
- Convocations
- Certificats
- Évaluations
- etc.

---

## 📋 Étape 1 : Créer un compte Resend

### 1.1 Inscription

1. Aller sur [resend.com](https://resend.com)
2. Cliquer sur **"Sign Up"**
3. S'inscrire avec votre email professionnel
4. Vérifier votre email

### 1.2 Plan gratuit

Le plan gratuit Resend offre :
- ✅ **100 emails/jour**
- ✅ **3 000 emails/mois**
- ✅ Domaine personnalisé
- ✅ API complète

**Pour la production** : Passer au plan payant si besoin (plus de volume)

---

## 📋 Étape 2 : Obtenir la clé API

### 2.1 Créer une clé API

1. Se connecter à [resend.com](https://resend.com)
2. Aller dans **"API Keys"** (menu de gauche)
3. Cliquer sur **"Create API Key"**
4. Donner un nom : `Automate Formation - Production`
5. Sélectionner les permissions : **"Full Access"** (ou "Sending Access" minimum)
6. Cliquer sur **"Create"**
7. **COPIER LA CLÉ IMMÉDIATEMENT** (elle ne sera plus visible après)

La clé ressemble à : `re_123abc456def789ghi012jkl345mno678`

### 2.2 Ajouter la clé dans .env

Créer ou modifier le fichier `.env` à la racine du projet :

```env
# Resend Email Service
RESEND_API_KEY=re_votre_cle_api_ici
```

**⚠️ IMPORTANT** : Ne jamais committer ce fichier dans Git !

---

## 📋 Étape 3 : Configurer le domaine d'envoi

### 3.1 Pourquoi configurer un domaine ?

Par défaut, Resend utilise `onboarding@resend.dev` qui :
- ❌ Peut finir en spam
- ❌ N'est pas professionnel
- ❌ Limite à 100 emails/jour

Avec votre domaine :
- ✅ Emails professionnels (`contact@aladeconseils.com`)
- ✅ Meilleure délivrabilité
- ✅ Limite augmentée

### 3.2 Ajouter votre domaine

1. Dans Resend, aller dans **"Domains"**
2. Cliquer sur **"Add Domain"**
3. Entrer votre domaine : `aladeconseils.com`
4. Cliquer sur **"Add"**

### 3.3 Configurer les enregistrements DNS

Resend va vous donner 3 enregistrements DNS à ajouter :

**1. SPF (TXT)**
```
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all
```

**2. DKIM (TXT)**
```
Type: TXT
Name: resend._domainkey
Value: [fourni par Resend]
```

**3. DMARC (TXT)** (optionnel mais recommandé)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:contact@aladeconseils.com
```

### 3.4 Où ajouter ces enregistrements ?

Aller chez votre hébergeur de domaine (OVH, Gandi, Cloudflare, etc.) :

**Exemple OVH** :
1. Se connecter à l'espace client OVH
2. Aller dans **"Domaines"** → Sélectionner `aladeconseils.com`
3. Onglet **"Zone DNS"**
4. Cliquer sur **"Ajouter une entrée"**
5. Sélectionner **"TXT"**
6. Copier/coller les valeurs fournies par Resend
7. Répéter pour les 3 enregistrements
8. Sauvegarder

**⏱️ Délai** : La propagation DNS peut prendre 1h à 48h

### 3.5 Vérifier le domaine

1. Retourner dans Resend → **"Domains"**
2. Cliquer sur **"Verify"** à côté de votre domaine
3. Si tout est OK : ✅ **Verified**
4. Sinon : Attendre la propagation DNS ou vérifier les enregistrements

---

## 📋 Étape 4 : Tester l'envoi d'email

### 4.1 Test simple avec le script fourni

```bash
cd /Users/francois/Windsurf/Automate\ Formation
node examples/testResend.js
```

**Résultat attendu** :
```
Email envoyé avec succès!
ID de l'email: abc123def456
Test terminé
```

### 4.2 Modifier l'email de test

Éditer `examples/testResend.js` :

```javascript
const data = await resend.emails.send({
  from: 'contact@aladeconseils.com', // Votre domaine vérifié
  to: 'votre-email@exemple.com',      // Votre email de test
  subject: 'Test Automate Formation',
  html: '<p>Email de test depuis <strong>Aladé Conseil</strong>!</p>'
});
```

### 4.3 Test avec le service emailService.js

Créer un fichier de test :

```bash
node -e "
const emailService = require('./services/emailService');

emailService.sendConfirmationDemande(
  'votre-email@exemple.com',
  'Entreprise Test',
  {
    titre: 'Formation React',
    duree: 14,
    dates: '15-16 novembre 2025'
  },
  'contact@aladeconseils.com'
).then(result => {
  console.log('Résultat:', result);
}).catch(err => {
  console.error('Erreur:', err);
});
"
```

---

## 📋 Étape 5 : Configurer l'adresse d'envoi par défaut

### 5.1 Modifier emailService.js

Ouvrir `services/emailService.js` et remplacer toutes les occurrences de :

```javascript
from = 'onboarding@resend.dev'
```

Par :

```javascript
from = 'contact@aladeconseils.com'
```

**Ou mieux** : Utiliser une variable d'environnement

Ajouter dans `.env` :
```env
EMAIL_FROM=contact@aladeconseils.com
EMAIL_FROM_NAME=Aladé Conseil
```

Modifier `emailService.js` :
```javascript
const defaultFrom = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`;

async sendEmail(to, subject, html, from = defaultFrom) {
  // ...
}
```

---

## 📋 Étape 6 : Vérifier la configuration complète

### Checklist finale

- [ ] Compte Resend créé
- [ ] Clé API obtenue et ajoutée dans `.env`
- [ ] Domaine ajouté dans Resend
- [ ] Enregistrements DNS configurés (SPF, DKIM, DMARC)
- [ ] Domaine vérifié dans Resend (✅ Verified)
- [ ] Test d'envoi réussi avec `testResend.js`
- [ ] Service `emailService.js` configuré avec le bon domaine
- [ ] Variable `EMAIL_FROM` dans `.env`

---

## 🐛 Problèmes Courants

### Erreur : "API key is invalid"

**Cause** : Clé API incorrecte ou non configurée

**Solution** :
1. Vérifier que `RESEND_API_KEY` est bien dans `.env`
2. Vérifier que la clé commence par `re_`
3. Recréer une nouvelle clé API si nécessaire

### Erreur : "Domain not verified"

**Cause** : Domaine non vérifié ou DNS non propagé

**Solution** :
1. Vérifier les enregistrements DNS chez votre hébergeur
2. Attendre la propagation (jusqu'à 48h)
3. Utiliser `onboarding@resend.dev` temporairement pour tester

### Emails arrivent en spam

**Cause** : Configuration DNS incomplète

**Solution** :
1. Vérifier que SPF, DKIM et DMARC sont bien configurés
2. Ajouter un enregistrement DMARC si manquant
3. Tester avec [mail-tester.com](https://www.mail-tester.com)

### Limite de 100 emails/jour dépassée

**Cause** : Plan gratuit limité

**Solution** :
1. Passer au plan payant Resend
2. Ou utiliser un domaine vérifié (limite augmentée)

---

## 📊 Monitoring des emails

### Dashboard Resend

1. Se connecter à [resend.com](https://resend.com)
2. Aller dans **"Emails"**
3. Voir tous les emails envoyés :
   - ✅ Delivered (délivré)
   - 📬 Opened (ouvert)
   - 🔗 Clicked (cliqué)
   - ❌ Bounced (rejeté)
   - 📧 Spam (marqué comme spam)

### Webhooks (optionnel)

Pour être notifié des événements :

1. Dans Resend → **"Webhooks"**
2. Ajouter l'URL : `https://votre-api.com/api/webhooks/resend`
3. Sélectionner les événements : `email.delivered`, `email.bounced`, etc.

---

## 🚀 Prochaines étapes

Une fois Resend configuré :

1. ✅ Brancher l'email de confirmation au formulaire de demande
2. ✅ Tester le workflow complet
3. ✅ Configurer les autres emails (convocations, certificats, etc.)
4. ✅ Mettre en production

---

## 📞 Support

**Documentation Resend** : [resend.com/docs](https://resend.com/docs)

**Support Resend** : support@resend.com

**Questions sur ce projet** : Consulter `README-PRINCIPAL.md`

---

**🎉 Une fois configuré, Resend enverra automatiquement tous vos emails de formation !**
