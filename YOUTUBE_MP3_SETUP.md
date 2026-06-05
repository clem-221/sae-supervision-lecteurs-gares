# 🎵 Intégration Convertisseur YouTube MP3

## ✅ Composants Créés/Modifiés

### 1. **Service TypeScript** 
**Fichier:** `src/app/services/youtube-mp3.service.ts`
- Service qui communique avec le backend PHP
- Envoie l'URL YouTube à l'endpoint `/download-mp3.php`
- Retourne les infos du fichier téléchargé

### 2. **Endpoint PHP**
**Fichier:** `download-mp3.php`
- Valide les requêtes POST
- Vérifie que l'URL est une URL YouTube valide
- Exécute le script Python `script/download_mp3.py`
- Retourne le statut et le lien de téléchargement en JSON

### 3. **Script Python**
**Fichier:** `script/download_mp3.py`
- Télécharge la vidéo YouTube
- Convertit en MP3 avec FFmpeg
- Enregistre dans `public/downloads/`
- Gère les dépendances (youtube_dl, FFmpeg)

### 4. **Composant Commercial Mis à Jour**
**Fichiers modifiés:**
- `src/app/commercial-component/commercial-component.ts`
- `src/app/commercial-component/commercial-component.html`
- `src/app/commercial-component/commercial-component.scss`

**Interface:**
- Barre de saisie pour l'URL YouTube
- Bouton de téléchargement
- Messages de statut (succès/erreur)
- Responsive design

## 🔧 Dépendances Requises

### Python (serveur backend)
```bash
pip install youtube_dl
apt-get install ffmpeg
```

### Node.js (Angular - déjà installé)
✅ `@angular/common`
✅ `@angular/forms`
✅ `@angular/common/http`

## 📝 Procédure d'Utilisation

1. **Collez une URL YouTube** dans la barre de saisie
2. **Cliquez sur "Télécharger MP3"** ou appuyez sur Enter
3. **Attendez le téléchargement** (statut affiché en temps réel)
4. **Le MP3 se télécharge automatiquement** une fois prêt
5. **Message de confirmation** avec le nom du fichier

## 🚀 Déploiement

### Sur Linux/Mac:
```bash
# 1. Installer les dépendances
pip install youtube_dl
brew install ffmpeg  # macOS
# ou
sudo apt-get install ffmpeg  # Linux

# 2. Rendre le script Python exécutable
chmod +x script/download_mp3.py

# 3. Lancer le serveur PHP
php -S localhost:8000

# 4. Lancer Angular en parallèle (autre terminal)
ng serve
```

### Permissions du dossier:
```bash
chmod -R 777 public/downloads
```

## 🔒 Sécurité

- ✅ Validation des URLs YouTube uniquement
- ✅ Vérification du protocole HTTP/HTTPS
- ✅ Échappement des paramètres shell
- ✅ Gestion des erreurs complète
- ✅ CORS configuré

## ⚙️ Configuration

### URL de l'API
Modifiez dans `youtube-mp3.service.ts` si votre serveur est différent:
```typescript
private apiUrl = 'http://localhost:8000/download-mp3.php';
```

### Dossier de téléchargement
Défini dans `download-mp3.php`:
```php
$downloadDir = __DIR__ . '/public/downloads';
```

## 📦 Fichiers du Projet

```
sae-supervision-lecteur-mp3/
├── download-mp3.php                    (NEW - Endpoint PHP)
├── script/
│   └── download_mp3.py                 (NEW - Script Python)
├── public/
│   └── downloads/                      (NEW - Dossier des MP3)
└── src/app/
    ├── commercial-component/
    │   ├── commercial-component.ts     (MODIFIÉ)
    │   ├── commercial-component.html   (MODIFIÉ)
    │   └── commercial-component.scss   (MODIFIÉ)
    └── services/
        └── youtube-mp3.service.ts      (NEW - Service Angular)
```

## 🐛 Dépannage

### Erreur: "Méthode non autorisée"
→ Vérifiez que le endpoint accepte POST

### Erreur: "URL YouTube invalide"
→ Utilisez une URL complete: `https://www.youtube.com/watch?v=...`

### Erreur: "FFmpeg n'est pas installé"
→ Le script l'installe automatiquement (sudo requis)

### Erreur: "youtube_dl non trouvé"
→ Le script l'installe automatiquement

### Fichier ne se télécharge pas
→ Vérifiez les permissions: `chmod 777 public/downloads`

## ✨ Fonctionnalités

- ✅ Interface minimaliste et intuitive
- ✅ Validation en temps réel
- ✅ Messages de statut détaillés
- ✅ Téléchargement automatique
- ✅ Responsive (mobile, tablette, desktop)
- ✅ Animations fluides
- ✅ Gestion d'erreurs complète
- ✅ Intégration avec le composant calendrier existant

