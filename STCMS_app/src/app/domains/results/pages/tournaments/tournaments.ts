import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { ResultsService } from '../../services/resuls';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tournaments',
  imports: [CommonModule],
  templateUrl: './tournaments.html',
  styleUrl: './tournaments.css',
})
export class Tournaments {
  private resultService = inject(ResultsService);
  selectedSport = this.resultService.selectedSport;
  tournaments = this.resultService.tournaments;
  selectedTournament = this.resultService.selectedTournament;
  isMobile = signal(window.innerWidth < 768);

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth < 768);
  }

  constructor() {
    // Effect to log changes in selectedTournament
    effect(() => {
      this.resultService.getTournamentsBySport(this.selectedSport()).subscribe((t) => {
        this.tournaments.set(t);
        if (t.length) {
          this.resultService.toggleTournament(t[0]); // first tournament as default
        }
      });
    });
  }

  selectTournament(tournamentName: string) {
    const tournaments = this.tournaments();
    // Find the tournament object by name
    const selected = tournaments.find((t) => t.name === tournamentName);

    if (!selected?._id) {
      console.error('Tournament not found:', tournamentName);
      return;
    }
    this.resultService.toggleTournament(selected);

    if (this.isMobile()) {
      this.resultService.toggleShowMatches();
    }
  }
}
