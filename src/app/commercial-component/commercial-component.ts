import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Station } from '../models/station.model';
import { VolumioService } from '../services/volumio-service';

@Component({
  selector: 'app-commercial-component',
  imports: [CommonModule],
  templateUrl: './commercial-component.html',
  styleUrl: './commercial-component.scss',
})
export class CommercialComponent  implements OnInit{
  stations : Station[] = [];
  isSending : boolean = false;

  constructor(protected volumioService : VolumioService) {}

  ngOnInit(): void {
    // Liste des gares (à terme, elle viendra d'un service de données centralisé)
    this.stations = [
      { id: 1, nom: 'Paris Nord', adresseIp: '172.20.10.12', etat: 'online' },
      { id: 2, nom: 'Saint-Denis', adresseIp: '172.20.10.13', etat: 'online' }
    ];
  }

  /**
   * Méthode d'urgence : Volume max + Message d'alerte
   */
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
  }
}