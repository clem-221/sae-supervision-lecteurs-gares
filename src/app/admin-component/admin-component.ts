import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Station } from '../models/station.model';
import { VolumioService } from '../services/volumio-service';
import { StationDataService } from '../services/station-data.services';
import { catchError, forkJoin, interval, of, startWith, Subscription } from 'rxjs';
import { CalendrierPlaylistComponent } from "../calendrier-playlist-component/calendrier-playlist-component";
import { TablesStationsComponent } from '../tables-stations-component/tables-stations-component'; // Vérifie le chemin

@Component({
  selector: 'app-admin-component',
  imports: [
    CalendrierPlaylistComponent,
    TablesStationsComponent
  ],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent  implements OnInit, OnDestroy{
  stations : Station[] = [];
  private refreshSubscription !: Subscription;
  private isInteractingWithCalendar = true;

    constructor(
      private volumioService : VolumioService,
      private stationDataService : StationDataService,
      private cdr : ChangeDetectorRef,
    ) {}

  ngOnInit(): void {
    this.stations = this.stationDataService.getStations();
    this.refreshSubscription = interval(600) // Toutes les 600 millisecondes
        .pipe(
          startWith(0) // Lance l'actualisation immédiatement au chargement
        )
        .subscribe(() => {
            this.stations = [...this.stationDataService.getStations()];  
            this.refreshAllStations();
          if (!this.isInteractingWithCalendar) {  
            this.cdr.markForCheck();
          }
        });
  }

  refreshStatus(station: Station) {
    this.volumioService.getStateEnhanced(station.adresseIp).subscribe({
      next: (enrichedState) => {
        station.etat = 'online';

        if(enrichedState && enrichedState.version){
          station.version = enrichedState.version;
        }

        // On récupère la source calculée par le service
        station.currentSource = "server"; 
        this.cdr.detectChanges();
      },
      error: () => {
        station.etat = 'offline';
        station.currentSource = 'local'; // Par défaut en cas de coupure
        this.cdr.detectChanges();
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
    console.log("Tentative de rafraîchissement à :", new Date().toLocaleTimeString());
    console.log("Actualisation en cours...")
    // Vérifiez que this.stations n'est pas vide
    if (this.stations && this.stations.length > 0) {
        const requests = this.stations.map(station => 
        this.volumioService.getState(station.adresseIp).pipe(
          // Si UNE gare échoue, on renvoie un objet 'error' pour ne pas bloquer forkJoin
          catchError(err => of({ isError: true, stationId: station.id }))
        )
      );

      // 2. forkJoin lance TOUTES les requêtes en même temps
      forkJoin(requests).subscribe({
        next: (results) => {
          results.forEach((state, index) => {
            console.log(`Données reçues pour la gare ${this.stations[index].nom} :`, state);
            if (state.isError) {
              // Gestion du cas Hors-ligne (sans bloquer les autres)
              this.stations[index].etat = 'offline';
              this.stations[index].currentPlaylist = 'Indisponible (Hors-ligne)';
              this.stations[index].version = state.version ||this.stations[index].version || "1.0.0";
            } else {
              // Gestion du cas En ligne
              this.stations[index].etat = 'online';
              // On récupère le statut (play, pause, ou stop)
              this.stations[index].status = state.status;

              this.stations[index].currentPlaylist = state.title || 'Musique locale';

              this.stations[index].version = state.version || state.systemversion || this.stations[index].version || "1.0.0";              
              
              this.stations[index].trackType = state.trackType;
              
              if (this.stations[index].adresseIp === this.volumioService.SERVER_IP) {
                this.stations[index].currentSource = 'server';
              } else {
                this.stations[index].currentSource = 'local';
              }
            }
            this.cdr.markForCheck(); // On demande à Angular de vérifier les changements pour cette gare
        }); 
        },
        error: (err) => {
          console.error("Erreur de connexion (Wi-Fi probable)", err);
          this.stations.forEach(station => {
            station.etat = 'offline'; // Le lecteur ne répond plus
            station.currentSource = 'local'; // On bascule en local par défaut si hors-ligne
            station.currentPlaylist = 'Indisponible (Vérifier Wi-Fi)';
          });
        }
      });
    } else {
      console.warn("Attention : la liste des stations est vide !");
    } 
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  onControlAction(station: Station, action: 'play' | 'pause' | 'stop') {
    const previousState = station.etat;
    station.status = 'loading'; // On force l'affichage du sablier ⏳
    this.volumioService.sendControl(station.adresseIp, action).subscribe({
      next: () => {
        console.log(`Action ${action} réussie sur ${station.nom}`);
        
        // On attend 600ms pour laisser le temps à Volumio de changer d'état
        // puis on rafraîchit les gares
        setTimeout(() => {
          this.refreshAllStations();
        }, 600);
      },
      error: (err) => {
        console.error(`Echec de l'action ${action}`, err)
        station.etat = previousState; // En cas d'erreur, on remet l'ancien état
        this.cdr.detectChanges();
      }
    });
  }

  
}

