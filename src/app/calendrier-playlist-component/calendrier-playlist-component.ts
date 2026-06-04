import {  ChangeDetectorRef, Input, Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CalendarOptions } from '@fullcalendar/core';
import { VolumioService } from '../services/volumio-service';
import { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin  from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendrier-playlist-component',
  standalone: true,
  imports: [
    FullCalendarModule,
    DragDropModule,
  ],
  templateUrl: './calendrier-playlist-component.html',
  styleUrl: './calendrier-playlist-component.scss',
})
export class CalendrierPlaylistComponent implements OnInit {
  @Input() selectedStationIp : string = '';

  draggableInstance: any = null;
  isInteractingWithCalendar: boolean = false;
  availablePlaylists :any[] = []

  constructor(
    private volumioService : VolumioService,
    private cdr : ChangeDetectorRef
  ){}

  ngOnInit(): void {
    if (this.selectedStationIp) {
      this.loadInternalPlaylists(this.selectedStationIp);
    }
  }

  
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek', // Vue semaine avec horaires
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    editable: true,
    droppable: true, // Autorise le dépôt
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    
    // Quand on commence à faire glisser un élément
    eventDragStart: () => {
      this.isInteractingWithCalendar = true;
    },
    // Cette fonction se déclenche quand tu lâches un fichier externe sur le calendrier
    drop: (info) => {
      console.log("Élément déposé !", info.dateStr);
    },

    // Cette fonction sera appelée quand tu lâches une playlist sur le calendrier
    eventReceive: (info) => {
     const notification = document.getElementById('notification');
      if (notification) {
        notification.style.display = 'block';
        setTimeout(() => notification.style.display = 'none', 3000);
      }

      setTimeout(() => {
        this.isInteractingWithCalendar = false;
      }, 100);
    },

    eventClick: (info) => {
       const titre = info.event.title;
      // On demande confirmation à l'utilisateur
      if (confirm(`Voulez-vous supprimer la planification de ${titre} ?`)) {
        // info.event est l'objet interne de FullCalendar
        info.event.remove(); 
        
        console.log("Événement supprimé du calendrier");
        // Ici, tu pourras ajouter plus tard un appel à ton service 
        // pour supprimer l'entrée en base de données ou sur le serveur.
      }
    },
    // Si on annule le drag sans déposer
    eventDragStop: () => {
      // Petit délai de sécurité pour laisser le temps au cycle de se finir
      setTimeout(() => {
        this.isInteractingWithCalendar = false;
      }, 200);
    }
  };

  loadInternalPlaylists(ip: string) {
    this.volumioService.naviguerFichier(ip, 'music-library/INTERNAL').subscribe({
      next: (data: any) => {
        // 1. On vide la liste avant de la remplir pour éviter les doublons
        this.availablePlaylists = [];

        // 2. On vérifie que Volumio a bien renvoyé une structure de navigation
        if (data?.navigation?.lists) {
          
          // 3. On boucle sur chaque "liste" renvoyée (Dossiers, Fichiers, etc.)
          data.navigation.lists.forEach((liste: any) => {
            if (liste.items) {
              // 4. On ajoute tous les éléments (items) à notre tableau global
              // L'opérateur "..." (spread) permet d'ajouter les éléments un par un
              this.availablePlaylists.push(...liste.items);
            }
          });

          console.log(`${this.availablePlaylists.length} éléments trouvés.`);
          this.initDraggable();
        }
        this.cdr.detectChanges(); // Force la mise à jour de l'affichage
      },
      error: (err) => {
        console.error("Erreur de lecture du stockage interne", err);
      }
    });
  }

  // Une fois que availablePlaylists est chargé
  initDraggable() {
    setTimeout(() => { // Petit délai pour laisser le DOM se mettre à jour
      const containerEl = document.querySelector('.playlist-list') as HTMLElement;
      if (containerEl) {
        if (this.draggableInstance) { this.draggableInstance.destroy(); }
        
        this.draggableInstance = new Draggable(containerEl, {
          itemSelector: '.playlist-item',
          eventData: (eventEl) => {
            return { title: eventEl.innerText.trim(), duration: '01:00' };
          }
        });
      }
    }, 0);
  }
}
