import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ResultsService } from '../../services/resuls';
import { Tournament } from '../../../../shared/models/tournament';

@Component({
  selector: 'app-categories',
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private resultService = inject(ResultsService);
  selectedSport = this.resultService.selectedSport;

  sports = [
    { name: 'Football', icon: 'fa-futbol', value: 'soccer' },
    { name: 'Basketball', icon: 'fa-basketball', value: 'basketball' },
    { name: 'Volleyball', icon: 'fa-solid fa-volleyball', value: 'volleyball' },
  ];
  // basketball is default sport that is loaded

  selectSport(sport: string) {
    this.resultService.toggleSport(sport);
  }
}
