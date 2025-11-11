import { Component, effect, inject } from '@angular/core';
import { Tournaments } from '../tournaments/tournaments';
import { ResultsService } from '../../services/resuls';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-match',
  imports: [Tournaments, CommonModule],
  templateUrl: './match.html',
  styleUrl: './match.css',
})
export class Match {
  private resultService = inject(ResultsService);

  matchesOfTournament = this.resultService.matchesOfTournament;

  // track active tab
  activeTab: string = 'All';

  constructor() {
    // reactive effect to log whenever matches change
    effect(() => {
      const matches = this.matchesOfTournament(); // <- reactive read
      // you could also update local state here if needed
    });
  }

  // set active tab on click
  setActive(tab: string) {
    this.activeTab = tab;
  }
}
