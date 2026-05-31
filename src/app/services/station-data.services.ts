import { Injectable } from '@angular/core';
import { Station } from '../models/station.model';

@Injectable({
  providedIn: 'root'
})
export class StationDataService {
  // On centralise la liste ici. Une seule modification ici mettra à jour toute l'app.
  private stations: Station[] = [
    { 
      id: 1, 
      nom: 'Paris Nord', 
      adresseIp: '172.20.10.12', // Mettez la vraie IP ici
      etat: 'online',
      currentSource: 'local'
    },
    { 
      id: 2, 
      nom: 'Saint-Denis', 
      adresseIp: '172.20.10.5', // Mettez la vraie IP ici
      etat: 'online',
      currentSource: 'server'
    }
  ];

  getStations(): Station[] {
    return this.stations;
  }
}