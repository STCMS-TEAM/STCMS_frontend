import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ResultsService } from '../../services/resuls';
import { Tournament } from '../../models/tournament';

@Component({
  selector: 'app-categories',
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private resultService = inject(ResultsService);
  selectedSport = signal<string>('basketball');

  sports = [
    { name: 'Football', icon: 'fa-futbol', value: 'soccer' },
    { name: 'Basketball', icon: 'fa-basketball', value: 'basketball' },
    { name: 'Volleyball', icon: 'fa-solid fa-volleyball', value: 'volleyball' },
  ];
  // basketball is default sport that is loaded
  ngOnInit() {
    this.resultService.getTournamentsById('basketball').subscribe({
      next: (res) => {
        this.resultService.setTournaments(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  selectSport(sport: string) {
    this.selectedSport.set(sport);
    // Fetch tournaments for the selected sport
    this.resultService.getTournamentsById(sport).subscribe({
      next: (tournaments: Tournament[]) => {
        // Share data with TournamentsComponent
        this.resultService.setTournaments(tournaments);
      },
      error: (err) => console.error('Failed to load tournaments', err),
    });
  }
}
