import { Component, effect, inject } from '@angular/core';
import { Categories } from '../categories/categories';
import { Match } from '../match/match';
import { ResultsService } from '../../services/resuls';
import { Tournaments } from '../tournaments/tournaments';
import { TeamsList } from '../teams-list/teams-list';
import { Rankings } from '../rankings/rankings';

@Component({
  selector: 'app-result',
  imports: [Tournaments, Match, Categories, TeamsList, Rankings],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result {
  private resultService = inject(ResultsService);

  showMatches = this.resultService.showMatches;
  selectedTournament = this.resultService.selectedTournament;

  backToTournaments() {
    this.resultService.toggleShowMatches();
  }
}
