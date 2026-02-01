import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsService } from '../../services/resuls';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teams-list.html',
  styleUrl: './teams-list.css',
})
export class TeamsList {
  private resultService = inject(ResultsService);

  teams = signal<any[]>([]);
  expandedTeamId = signal<string | null>(null);
  teamPlayers = signal<{ _id: string; name: string; email?: string }[]>([]);
  loadingPlayers = signal(false);

  selectedTournament = this.resultService.selectedTournament;

  constructor() {
    effect(() => {
      const tournament = this.selectedTournament();
      if (!tournament?._id) {
        this.teams.set([]);
        this.expandedTeamId.set(null);
        return;
      }
      this.resultService.getTeamsByTournament(tournament._id).subscribe({
        next: (teamsList) => this.teams.set(teamsList),
        error: (err) => {
          console.error('Failed to load teams', err);
          this.teams.set([]);
        },
      });
    });
  }

  toggleTeamPlayers(teamId: string) {
    const current = this.expandedTeamId();
    if (current === teamId) {
      this.expandedTeamId.set(null);
      this.teamPlayers.set([]);
      return;
    }
    this.expandedTeamId.set(teamId);
    this.loadingPlayers.set(true);
    this.resultService.getTeamById(teamId).subscribe({
      next: (team) => {
        this.teamPlayers.set(team.players || []);
        this.loadingPlayers.set(false);
      },
      error: (err) => {
        console.error('Failed to load team players', err);
        this.teamPlayers.set([]);
        this.loadingPlayers.set(false);
      },
    });
  }
}
