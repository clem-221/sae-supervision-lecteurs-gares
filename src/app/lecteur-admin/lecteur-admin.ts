import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolumioService } from '../services/volumio-service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-lecteur-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lecteur-admin.html',
  styleUrls: ['./lecteur-admin.scss'],
})
export class LecteurAdmin implements OnInit, OnDestroy {
  
  currentSong = {
    title: 'Aucun titre',
    artist: 'Artiste inconnu',
    album: 'Album inconnu',
    albumart: '/assets/default-album.png',
    status: 'stop',
    volume: 50,
    duration: 0,
    seek: 0
  };

  private refreshSubscription: Subscription | undefined;
  private readonly IP_STATION = '172.20.10.12';

  constructor(private volumioService: VolumioService) {}

  ngOnInit(): void {
    this.refreshPlayerState();
    this.refreshSubscription = interval(2000).subscribe(() => {
      this.refreshPlayerState();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  refreshPlayerState(): void {
    this.volumioService.getState(this.IP_STATION).subscribe({
      next: (state: any) => {
        this.currentSong = {
          title: state.title || 'Aucun titre',
          artist: state.artist || 'Artiste inconnu',
          album: state.album || 'Album inconnu',
          albumart: this.getImageUrl(state.albumart),
          status: state.status || 'stop',
          volume: state.volume || 50,
          duration: state.duration || 0,
          seek: state.seek || 0
        };
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'état:', err);
      }
    });
  }

  private getImageUrl(albumart: string): string {
    if (!albumart) {
      return '/assets/default-album.png';
    }
    if (albumart.startsWith('http')) {
      return albumart;
    }
    return `http://${this.IP_STATION}${albumart}`;
  }

  togglePlayPause(): void {
    const cmd = this.currentSong.status === 'play' ? 'pause' : 'play';
    this.volumioService.sendBasicCommand(this.IP_STATION, cmd).subscribe({
      next: () => this.refreshPlayerState(),
      error: (err) => console.error('Erreur play/pause:', err)
    });
  }

  nextTrack(): void {
    this.volumioService.sendBasicCommand(this.IP_STATION, 'next').subscribe({
      next: () => this.refreshPlayerState(),
      error: (err) => console.error('Erreur next:', err)
    });
  }

  previousTrack(): void {
    this.volumioService.sendBasicCommand(this.IP_STATION, 'prev').subscribe({
      next: () => this.refreshPlayerState(),
      error: (err) => console.error('Erreur prev:', err)
    });
  }

  changeVolume(volume: number): void {
    this.volumioService.sendBasicCommand(this.IP_STATION, `volume&volume=${volume}`).subscribe({
      error: (err) => console.error('Erreur volume:', err)
    });
  }

  stop(): void {
    this.volumioService.sendBasicCommand(this.IP_STATION, 'stop').subscribe({
      next: () => this.refreshPlayerState(),
      error: (err) => console.error('Erreur stop:', err)
    });
  }
}

