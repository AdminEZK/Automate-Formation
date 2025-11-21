# 🚨 SÉCURITÉ : CLÉ API RESEND EXPOSÉE

**Date** : 21 novembre 2025  
**Gravité** : 🔴 CRITIQUE  
**Statut** : ⚠️ EN COURS DE RÉSOLUTION

---

## ⚠️ PROBLÈME

GitGuardian a détecté une **clé API Resend exposée** dans le dépôt GitHub.

**Risques** :
- ❌ Quelqu'un peut envoyer des emails en ton nom
- ❌ Consommation de ton quota Resend
- ❌ Spam / Phishing possible
- ❌ Réputation email compromise

---

## ✅ ACTIONS IMMÉDIATES

### 1. RÉVOQUER LA CLÉ EXPOSÉE (URGENT !)

```bash
# Aller sur Resend
https://resend.com/api-keys

# Étapes :
1. Se connecter
2. Aller dans "API Keys"
3. Trouver la clé exposée
4. Cliquer "Revoke" / "Supprimer"
5. Confirmer la révocation
```

**⚠️ À FAIRE MAINTENANT AVANT TOUT LE RESTE !**

---

### 2. CRÉER UNE NOUVELLE CLÉ

```bash
# Sur Resend
1. Cliquer "Create API Key"
2. Nom : "Automate Formation - Production"
3. Permissions : "Full Access" ou "Send Emails"
4. Copier la nouvelle clé (elle ne sera affichée qu'une fois !)
```

---

### 3. METTRE À JOUR LE .env LOCAL

```bash
# Fichier : .env
RESEND_API_KEY=re_NOUVELLE_CLE_ICI
```

**⚠️ NE JAMAIS COMMITER CE FICHIER !**

---

### 4. METTRE À JOUR RENDER (PRODUCTION)

```bash
# Aller sur Render
https://dashboard.render.com

# Étapes :
1. Sélectionner le service backend
2. Aller dans "Environment"
3. Modifier RESEND_API_KEY
4. Coller la nouvelle clé
5. Sauvegarder (le service redémarrera automatiquement)
```

---

### 5. VÉRIFIER LE .gitignore

```bash
# Vérifier que .env est bien ignoré
cat .gitignore | grep ".env"

# Devrait afficher :
# .env
# .env.local
# .env.development.local
# .env.test.local
# .env.production.local
```

✅ **C'est déjà le cas !**

---

### 6. NETTOYER L'HISTORIQUE GIT (SI NÉCESSAIRE)

Si la clé a été commitée par erreur dans l'historique :

```bash
# Option 1 : Utiliser BFG Repo-Cleaner (RECOMMANDÉ)
# Télécharger : https://rtyley.github.io/bfg-repo-cleaner/

# Créer un fichier avec les patterns à supprimer
echo "RESEND_API_KEY" > patterns.txt
echo "re_[a-zA-Z0-9]{32}" >> patterns.txt

# Nettoyer l'historique
java -jar bfg.jar --replace-text patterns.txt

# Force push (ATTENTION !)
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
```

```bash
# Option 2 : Utiliser git-filter-repo (ALTERNATIF)
pip install git-filter-repo

# Créer un script de remplacement
cat > replace.txt << EOF
RESEND_API_KEY=re_***REMOVED***
regex:re_[a-zA-Z0-9]{32}==>re_***REMOVED***
EOF

# Nettoyer
git filter-repo --replace-text replace.txt

# Force push
git push origin --force --all
```

**⚠️ ATTENTION : Ces commandes réécrivent l'historique Git !**

---

### 7. VÉRIFIER QUE TOUT FONCTIONNE

```bash
# Tester l'envoi d'email avec la nouvelle clé
curl -X POST http://localhost:3001/api/sessions/SESSION_ID/generate-and-send-proposition

# Vérifier les logs
# Devrait voir : "Email envoyé avec succès"
```

---

## 🛡️ PRÉVENTION FUTURE

### 1. Ajouter un pre-commit hook

```bash
# Créer .git/hooks/pre-commit
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Vérifier qu'aucun fichier .env n'est commité
if git diff --cached --name-only | grep -E "\.env$|\.env\."; then
    echo "❌ ERREUR : Vous essayez de commiter un fichier .env !"
    echo "Les fichiers .env contiennent des secrets et ne doivent JAMAIS être commitées."
    exit 1
fi

# Vérifier les clés API dans les fichiers
if git diff --cached | grep -E "RESEND_API_KEY|SUPABASE.*KEY|re_[a-zA-Z0-9]{32}"; then
    echo "❌ ERREUR : Une clé API a été détectée dans votre commit !"
    echo "Retirez toutes les clés API avant de commiter."
    exit 1
fi

exit 0
EOF

chmod +x .git/hooks/pre-commit
```

### 2. Utiliser des variables d'environnement

```bash
# Toujours utiliser process.env
const apiKey = process.env.RESEND_API_KEY;

# JAMAIS en dur dans le code
const apiKey = "re_abc123..."; // ❌ JAMAIS FAIRE ÇA !
```

### 3. Fichiers .env.example

```bash
# Créer .env.example (SANS les vraies valeurs)
cat > .env.example << EOF
# Configuration Backend
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici

# Resend
RESEND_API_KEY=re_votre_cle_ici
EMAIL_FROM=contact@votre-domaine.com

# Frontend
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
EOF

# Commiter ce fichier (il ne contient pas de secrets)
git add .env.example
git commit -m "docs: Add .env.example template"
```

### 4. Scanner régulièrement

```bash
# Installer gitleaks
brew install gitleaks

# Scanner le repo
gitleaks detect --source . --verbose

# Ajouter au CI/CD
# .github/workflows/security.yml
```

---

## 📋 CHECKLIST

- [ ] 1. Clé Resend révoquée sur https://resend.com/api-keys
- [ ] 2. Nouvelle clé créée
- [ ] 3. .env local mis à jour
- [ ] 4. Variables Render mises à jour
- [ ] 5. .gitignore vérifié (✅ déjà OK)
- [ ] 6. Historique Git nettoyé (si nécessaire)
- [ ] 7. Test d'envoi email réussi
- [ ] 8. Pre-commit hook installé
- [ ] 9. .env.example créé
- [ ] 10. GitGuardian notifié de la résolution

---

## 🔗 RESSOURCES

- Resend Dashboard : https://resend.com/api-keys
- Render Dashboard : https://dashboard.render.com
- BFG Repo-Cleaner : https://rtyley.github.io/bfg-repo-cleaner/
- GitGuardian : https://www.gitguardian.com/
- Git Filter-Repo : https://github.com/newren/git-filter-repo

---

## 📞 SUPPORT

Si tu as besoin d'aide :
- Resend Support : support@resend.com
- GitGuardian : support@gitguardian.com

---

**Document créé le 21 novembre 2025**  
**Priorité : 🔴 CRITIQUE - À TRAITER IMMÉDIATEMENT**
