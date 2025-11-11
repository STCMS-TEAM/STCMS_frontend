import { Component, effect, inject, signal } from '@angular/core';
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

  tournaments = this.resultService.tournaments;

  selectedTournament = signal<string>('default');

  constructor() {
    // Whenever tournaments signal changes, fetch teams for the first tournament
    effect(() => {
      const tournaments = this.tournaments(); // <- reactive read
      if (tournaments.length === 0) return;
      this.selectedTournament.set(tournaments[1].name)

      const firstTournamentId = tournaments[1]._id;

      this.resultService.getAllTeamsByTournament(firstTournamentId).subscribe({
        next: (res) => {
     

          this.resultService.setMatchesOfTournament(res);
        },
        error: (err) => console.log(err),
      });
    });
  }



  selectTournament(tournamentName: string) {
    this.selectedTournament.set(tournamentName);
    const tournaments = this.tournaments();
      // Find the tournament object by name
    const selected = tournaments.find(t => t.name === tournamentName);

    if (!selected?._id) {
      console.error('Tournament not found:', tournamentName);
      return;
    }
    
  this.resultService.getAllTeamsByTournament(selected._id).subscribe({
    next: (res) => {
      this.resultService.setMatchesOfTournament(res);
    },
    error: (err) => console.error('Failed to load teams', err),
  });
    
  }
}
