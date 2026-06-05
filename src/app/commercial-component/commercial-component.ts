import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VolumioService } from '../services/volumio-service';
import { YoutubeMp3Service } from '../services/youtube-mp3.service';
import { CalendrierPlaylistComponent } from "../calendrier-playlist-component/calendrier-playlist-component";

@Component({
  selector: 'app-commercial-component',
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CalendrierPlaylistComponent,
  ],
  templateUrl: './commercial-component.html',
  styleUrls: ['./commercial-component.scss'],
})
export class CommercialComponent implements OnInit {
  youtubeUrl: string = '';
  isDownloading: boolean = false;
  downloadMessage: string = '';
  downloadSuccess: boolean = false;

  constructor(private youtubeMp3Service: YoutubeMp3Service) {}

  ngOnInit(): void {
    // Initialisation
  }

  downloadMp3(): void {
    if (!this.youtubeUrl.trim()) {
      this.downloadMessage = '⚠️ Veuillez entrer une URL YouTube valide';
      this.downloadSuccess = false;
      return;
    }

    this.isDownloading = true;
    this.downloadMessage = '⏳ Téléchargement en cours...';
    this.downloadSuccess = false;

    this.youtubeMp3Service.downloadMp3(this.youtubeUrl).subscribe({
      next: (response) => {
        this.isDownloading = false;
        if (response.success) {
          this.downloadMessage = `✅ ${response.message}`;
          this.downloadSuccess = true;
          
          // Télécharger le fichier
          if (response.downloadUrl) {
            const link = document.createElement('a');
            link.href = response.downloadUrl;
            link.download = response.filename || 'audio.mp3';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Réinitialiser après 3 secondes
            setTimeout(() => {
              this.youtubeUrl = '';
              this.downloadMessage = '';
            }, 3000);
          }
        } else {
          this.downloadMessage = `❌ ${response.message || 'Erreur inconnue'}`;
          this.downloadSuccess = false;
        }
      },
      error: (error) => {
        this.isDownloading = false;
        const errorMsg = error?.message || 'Erreur réseau';
        this.downloadMessage = `❌ ${errorMsg}`;
        this.downloadSuccess = false;
        console.error('Erreur MP3:', error);
      }
    });
  }
}

  /*ngOnInit(): void {
    // Liste des gares (à terme, elle viendra d'un service de données centralisé)
    this.stations = [
      { id: 1, nom: 'Paris Nord', adresseIp: '172.20.10.5', etat: 'online' },
      { id: 2, nom: 'Saint-Denis', adresseIp: '172.20.10.3', etat: 'online' }
    ];
  }

  /**
   * Méthode d'urgence : Volume max + Message d'alerte
   *
  broadcastAlert(station: Station) {
    this.isSending = true;
    
    // On enchaîne les commandes grâce aux souscriptions
    this.volumioService.setVolume(station.adresseIp, 100).subscribe(() => {
      this.volumioService.playPlaylist(station.adresseIp, 'ALERTE_GENERALE').subscribe({
        next: () => {
          alert(`Message diffusé avec succès à ${station.nom}`);
          this.isSending = false;
        },
        error: () => {
          alert(`Échec de la diffusion à ${station.nom}`);
          this.isSending = false;
        }
      });
    });
  }

  stopAll(station: Station) {
    this.volumioService.sendBasicCommand(station.adresseIp, 'stop').subscribe();
  } */
