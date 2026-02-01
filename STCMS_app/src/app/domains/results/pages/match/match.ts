import { Component, effect, inject } from '@angular/core';
import { Tournaments } from '../tournaments/tournaments';
import { ResultsService } from '../../services/resuls';
import { CommonModule } from '@angular/common';
import { MatchDTO } from '../../../../shared/models/matches';
import { Tournament } from '../../../../shared/models/tournament';
@Component({
  selector: 'app-match',
  imports: [CommonModule],
  templateUrl: './match.html',
  styleUrl: './match.css',
})
export class Match {
  private resultService = inject(ResultsService);
  private Backup: any[] = [];
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
        next: (res: Tournament) => {
          this.resultService.setMatchesOfTournament(res.matches);
          this.Backup = res.matches;
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
    if (tab === 'Scheduled') {
      // filter with pending status
      const filtered = this.Backup.filter((match) => match.status === 'pending');
      this.resultService.setMatchesOfTournament(filtered);
    } else if (tab === 'Live') {
      // filter with in_progress status
      const filtered = this.Backup.filter((match) => match.status === 'in_progress');
      this.resultService.setMatchesOfTournament(filtered);
    } else if (tab === 'Concluded') {
      // filter with completed status
      const filtered = this.Backup.filter((match) => match.status === 'completed');
      this.resultService.setMatchesOfTournament(filtered);
    } else {
      // show all matches
      this.resultService.getAllTeamsByTournament(this.selectedTournament()._id).subscribe({
        next: (res) => {
          this.Backup = res.matches;
          this.resultService.setMatchesOfTournament(res.matches);
        },
        error: (err) => console.error('Failed to load teams', err),
      });
    }
  }
}