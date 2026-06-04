import { Component, OnInit } from '@angular/core';
import { VolumioService } from '../services/volumio-service';
import { CalendrierPlaylistComponent } from "../calendrier-playlist-component/calendrier-playlist-component";

@Component({
  selector: 'app-commercial-component',
  imports: [
    CalendrierPlaylistComponent,
  ],
  templateUrl: './commercial-component.html',
  styleUrls: ['./commercial-component.scss'],
})
export class CommercialComponent{
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
