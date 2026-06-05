#!/usr/bin/env python3
import os
import sys
import subprocess
import json

# Vérifier les dépendances
try:
    import yt_dlp
except ModuleNotFoundError:
    print("Installation de yt-dlp...", file=sys.stderr)
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "yt-dlp"])
    import yt_dlp

def download_mp3(url, output_dir):
    """
    Télécharge une vidéo YouTube et la convertit en MP3
    
    Args:
        url: L'URL de la vidéo YouTube
        output_dir: Le répertoire de destination
    """
    try:
        # Configurer les paramètres de téléchargement
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': os.path.join(output_dir, '%(title)s.%(ext)s'),
            'quiet': False,
            'no_warnings': False,
            'socket_timeout': 30,
        }
        
        # Télécharger la vidéo et convertir en MP3
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            return True, os.path.basename(filename)
        
    except Exception as e:
        print(f"Erreur: {str(e)}", file=sys.stderr)
        return False, None

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 download_mp3.py <url> <output_dir>", file=sys.stderr)
        sys.exit(1)
    
    url = sys.argv[1]
    output_dir = sys.argv[2]
    
    # Créer le répertoire s'il n'existe pas
    os.makedirs(output_dir, exist_ok=True)
    
    # Vérifier que FFmpeg est installé
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Erreur: FFmpeg n'est pas installé", file=sys.stderr)
        sys.exit(1)
    
    # Télécharger le MP3
    success, filename = download_mp3(url, output_dir)
    
    if success and filename:
        # Retourner le nom du fichier en JSON pour que PHP le lise
        print(json.dumps({"success": True, "filename": filename}))
        sys.exit(0)
    else:
        print(json.dumps({"success": False, "filename": None}))
        sys.exit(1)
