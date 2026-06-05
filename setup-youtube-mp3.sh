#!/bin/bash

echo "🎵 Installation des dépendances pour le Convertisseur YouTube MP3"
echo "================================================================="

# Vérifier Python
echo "Vérification de Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 n'est pas installé"
    exit 1
fi
echo "✅ Python3 trouvé: $(python3 --version)"

# Installer youtube_dl
echo -e "\n📦 Installation de youtube_dl..."
pip install youtube_dl -q
if [ $? -eq 0 ]; then
    echo "✅ youtube_dl installé"
else
    echo "❌ Erreur lors de l'installation de youtube_dl"
    exit 1
fi

# Vérifier/installer FFmpeg
echo -e "\n🎬 Vérification de FFmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo "⏳ FFmpeg n'est pas installé, installation en cours..."
    
    # Déterminer le système d'exploitation
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y ffmpeg
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install ffmpeg
        else
            echo "⚠️  Homebrew n'est pas installé. Installez Homebrew d'abord: https://brew.sh"
            exit 1
        fi
    else
        echo "❌ Système d'exploitation non supporté"
        exit 1
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ FFmpeg installé"
    else
        echo "❌ Erreur lors de l'installation de FFmpeg"
        exit 1
    fi
else
    echo "✅ FFmpeg trouvé: $(ffmpeg -version | head -n 1)"
fi

# Rendre le script Python exécutable
echo -e "\n🔐 Configuration des permissions..."
chmod +x script/download_mp3.py
echo "✅ Script Python rendu exécutable"

# Créer le dossier de téléchargement
echo -e "\n📁 Création du dossier de téléchargement..."
mkdir -p public/downloads
chmod 777 public/downloads
echo "✅ Dossier créé avec permissions"

echo -e "\n✅ Installation terminée !"
echo -e "\n🚀 Prochaines étapes:"
echo "1. Lancez le serveur PHP: php -S localhost:8000"
echo "2. Dans un autre terminal, lancez Angular: ng serve"
echo "3. Ouvrez http://localhost:4200 dans votre navigateur"
echo "4. Allez dans la section 'Commercial' et testez le convertisseur"
