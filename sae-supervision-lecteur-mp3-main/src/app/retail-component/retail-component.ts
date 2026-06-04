import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Station } from '../models/station.model';
import { VolumioService } from '../services/volumio-service';

@Component({
  selector: 'app-retail-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retail-component.html',
  styleUrl: './retail-component.scss',
})
export class RetailComponent implements OnInit{
  stations : Station[] = [];
  playlists : string[] = [];
  selectedStation ?: Station;
  serverPlaylists: string[] = ['Ambiance Matin', 'Heure de Pointe', 'Ambiance Soir']; // Playlists communes
  localPlaylist: string = ''; // Sera récupérée via l'API locale de la gare

  constructor(private volumioService : VolumioService) {}

  ngOnInit(): void {
    setInterval(() => this.updateConnectionStatus(), 10000);
    // On récupère la liste des gares (idéalement via un service partagé plus tard)
    this.stations = [
      { id: 1, nom: 'Paris Nord', adresseIp: '172.20.10.12', etat: 'online' },
      { id: 2, nom: 'Saint-Denis', adresseIp: '172.20.10.3', etat: 'online' }
    ];
  }

  onSelectStation(station: Station) {
    this.selectedStation = station;
    
    this.updateConnectionStatus();

    // On récupère l'état pour savoir quelle est la playlist locale de secours
    this.volumioService.getState(station.adresseIp).subscribe(state => {
      // Supposons que Volumio renvoie une info sur le contenu local
      this.localPlaylist = 'Playlist_Secours_' + station.nom; 
    });
  }

  changePlaylist(playlistName: string, isLocal: boolean = false) {
    if (this.selectedStation) {
      // AJOUT : On bascule l'affichage en mode local
      this.selectedStation.currentSource = isLocal ? 'local' : 'server';
      this.volumioService.playPlaylist(this.selectedStation.adresseIp, playlistName).subscribe(() => {
        alert(`Playlist "${playlistName}" lancée à ${this.selectedStation?.nom}`);
      });
    }
  }

  updateConnectionStatus() {
    if (this.selectedStation) {
      this.volumioService.checkServerAvailability().subscribe(isAlive => {
        this.selectedStation!.currentSource = isAlive ? 'server' : 'local';
      });
    }
  }
}
