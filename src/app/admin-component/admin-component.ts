import { Component, OnInit } from '@angular/core';
import { Station } from '../models/station.model';
import { VolumioService } from '../services/volumio-service';
import { NgClass } from '@angular/common';
import { StationDataService } from '../services/station-data.services';

@Component({
  selector: 'app-admin-component',
  imports: [NgClass],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.scss',
})
export class AdminComponent  implements OnInit{
  stations : Station[] = [];

    constructor(
      private volumioService : VolumioService,
      private stationDataService : StationDataService
    ) {}

  ngOnInit(): void {
    this.stations = this.stationDataService.getStations();
    this.stations = [
      {id: 1, nom: 'Gare Paris Nord', adresseIp: '172.20.10.12', etat: 'online', version : '1.0.0', currentPlaylist : ""},
      {id: 2, nom: 'Gare Saint-Denis', adresseIp: '172.20.10.3', etat: 'online', version : '1.0.0', currentPlaylist : ""}
    ];

    // Premier lancement au chargement de la page
    this.refreshAllStations();
    this.updateAllPlaylists();
    // Puis toutes les 30 secondes
    setInterval(() => {
      this.refreshAllStations();
    }, 10000);
  }

  refreshStatus(station: Station) {
    this.volumioService.getStateEnhanced(station.adresseIp).subscribe({
      next: (enrichedState) => {
        station.etat = 'online';
        station.version = enrichedState.version;
        // On récupère la source calculée par le service
        station.currentSource = enrichedState.calculatedSource; 
      },
      error: () => {
        station.etat = 'offline';
        station.currentSource = 'local'; // Par défaut en cas de coupure
      }
    });
  }

  updateAllPlaylists() {
    this.stations.forEach(station => {
      this.volumioService.getPlaylistStatus(station.adresseIp).subscribe(playlist => {
        station.currentPlaylist = playlist;
      });
    });
  }

  stopAndRefresh(station: Station) {
    this.volumioService.stopStation(station.adresseIp).subscribe(() => {
      // Une fois arrêté, on met à jour le statut de la playlist pour cette gare
      this.volumioService.getPlaylistStatus(station.adresseIp).subscribe(playlist => {
        station.currentPlaylist = playlist;
        alert(`Lecture arrêtée avec succès sur ${station.nom}`);
      });
    });
  }

  refreshAllStations() {
    console.log("Actualisation en cours...")
    // Vérifiez que this.stations n'est pas vide
    if (this.stations && this.stations.length > 0) {
      this.stations.forEach(station => {
        this.refreshStatus(station);
        // 1. Récupération de l'état complet (inclut la Version et la Playlist)
        this.volumioService.getState(station.adresseIp).subscribe(state => {
          // Mise à jour de la version
          station.version = state.version || 'Inconnue'; 
          
          // Mise à jour de la playlist en cours (souvent dans state.title ou state.service)
          station.currentPlaylist = state.title || 'Aucune playlist';
        });

        // 2. On vérifie si la gare est en ligne ou en local (via notre test de serveur central)
        this.volumioService.checkServerAvailability().subscribe(isAlive => {
          station.currentSource = isAlive ? 'server' : 'local';
        });
      });
    } 
  }
}

