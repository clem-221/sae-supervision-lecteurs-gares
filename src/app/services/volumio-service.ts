import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VolumioService {

  constructor(private http: HttpClient) { }

  /**
   * Récupère l'état actuel d'un lecteur (Volume, titre, statut)
   * Utile pour l'Admin et le Retail
   */
  getState(ip: string): Observable<any> {
    return this.http.get(`http://${ip}/api/v1/getState`);
  }

  getStateEnhanced(ip: string): Observable<any> {
  return this.http.get(`http://${ip}/api/v1/getState`).pipe(
    map((state: any) => {
      // Logique de détection : on vérifie si l'URI contient l'adresse de votre serveur central
      const isServer = state.service === 'mpd' && state.uri && state.uri.includes('http://votre-serveur-central');
      
      // On ajoute une propriété personnalisée à l'objet pour nos composants
      return {
        ...state,
        calculatedSource: isServer ? 'server' : 'local'
      };
    })
  );
}

  /**
   * Envoie une commande simple au lecteur
   * @param ip L'adresse du lecteur en gare
   * @param cmd La commande (play, stop, pause, etc.)
   */
  sendBasicCommand(ip: string, cmd: string): Observable<any> {
    return this.http.get(`http://${ip}/api/v1/commands/?cmd=${cmd}`);
  }

  /**
   * Lance une playlist spécifique
   * Utile pour le profil Retail
   */
  playPlaylist(ip: string, playlistName: string): Observable<any> {
    return this.http.get(`http://${ip}/api/v1/commands/?cmd=playplaylist&name=${playlistName}`);
  }

  /**
   * Modifie le volume
   * Crucial pour le profil Commercial lors des alertes
   */
  setVolume(ip: string, volume: number): Observable<any> {
    return this.http.get(`http://${ip}/api/v1/commands/?cmd=volume&value=${volume}`);
  }

  /**
   * Récupère la liste des playlists disponibles sur le lecteur
   */
  listPlaylists(ip: string): Observable<any> {
    return this.http.get(`http://${ip}/api/v1/listplaylists`);
  }

  checkServerAvailability(): Observable<boolean> {
    // Remplacez par l'URL réelle de votre serveur central
    const serverUrl = 'http://172.20.10.12/api/v1/getState'; 
    return this.http.get(serverUrl).pipe(
      map(() => true), // Si la requête réussit
      catchError(() => of(false)) // Si la requête échoue (serveur injoignable)
    );
  }

  getPlaylistStatus(ip: string): Observable<string> {
    return this.http.get<any>(`http://${ip}/api/v1/getState`).pipe(
      map(state => {
        // Volumio renvoie souvent le nom de la playlist ou le titre en cours
        return state.service === 'mpd' ? (state.title || 'Aucune playlist') : 'Service indisponible';
      }),
      catchError(() => of('Erreur de connexion'))
    );
  }

  stopStation(ip: string): Observable<any> {
    // On envoie la commande 'stop' via l'API Volumio
    return this.sendBasicCommand(ip, 'stop');
  }
}
