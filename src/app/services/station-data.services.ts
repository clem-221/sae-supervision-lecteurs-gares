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
      adresseIp: '172.20.10.3', 
      etat: 'offline',
      currentSource: 'local'
    },
    { 
      id: 2, 
      nom: 'Saint-Denis', 
      adresseIp: '172.20.10.12', 
      etat: 'online',
      currentSource: 'server'
    }
  ];

  getStations(): Station[] {
    return this.stations;
  }
}