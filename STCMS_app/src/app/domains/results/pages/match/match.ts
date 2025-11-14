import { Component, effect, inject } from '@angular/core';
import { Tournaments } from '../tournaments/tournaments';
import { ResultsService } from '../../services/resuls';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-match',
  imports: [CommonModule],
  templateUrl: './match.html',
  styleUrl: './match.css',
})
export class Match {
  private resultService = inject(ResultsService);

  matchesOfTournament = this.resultService.matchesOfTournament;
  selectedTournament = this.resultService.selectedTournament;
  tabs = ['All', 'Live', 'Concluded', 'Scheduled'];

  constructor() {
    // Effect to log changes in matchesOfTournament
    effect(() => {
      if (!this.selectedTournament()?._id) {
        return;
      }
      this.resultService.getAllTeamsByTournament(this.selectedTournament()._id).subscribe({
        next: (res) => {
          this.resultService.setMatchesOfTournament(res);
          console.log(this.matchesOfTournament());
        },
        error: (err) => console.error('Failed to load teams', err),
      });
    });
  }

  // track active tab
  activeTab: string = 'All';

  // set active tab on click
  setActive(tab: string) {
    this.activeTab = tab;
  }
}
