import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Station } from '../models/station.model';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-tables-stations-component',
  standalone: true,
  imports: [
    CommonModule,
    NgClass
  ],
  templateUrl: './tables-stations-component.html',
  styleUrls: ['./tables-stations-component.scss']
})
export class TablesStationsComponent {
  @Input() stations: Station[] = []; // Reçoit les données de l'Admin
  @Output() actionTriggered = new EventEmitter<{station: Station, action: 'play' | 'pause' | 'stop'}>();  

  onControlAction(station : Station, action: "play" | "pause" | "stop"){
    this.actionTriggered.emit({station, action});
  }

  clickToggle(station: Station) {
    // On utilise 'toggle' au lieu de 'pause' pour éviter le blocage
    this.onControlAction(station, 'toggle' as any); 
  }
}