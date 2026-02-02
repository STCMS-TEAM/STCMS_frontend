import { Component, effect, inject } from '@angular/core';
import { ResultsService } from '../../services/resuls';
import { AuthService } from '../../../../core/auth/services/auth';
import { CommonModule } from '@angular/common';
import { MatchDTO } from '../../../../shared/models/matches';

@Component({
  selector: 'app-match',
  imports: [CommonModule],
  templateUrl: './match.html',
  styleUrl: './match.css',
})
export class Match {
  private resultService = inject(ResultsService);
  private authService = inject(AuthService);
  private Backup: any[] = [];
  matchesOfTournament = this.resultService.matchesOfTournament;
  selectedTournament = this.resultService.selectedTournament;
  tabs = ['All', 'Live', 'Concluded', 'Scheduled'];
  editingMatchId: string | null = null;
  editScores: Record<string, number> = {};
  saving = false;

  constructor() {
    // Effect to log changes in matchesOfTournament
    effect(() => {
      if (!this.selectedTournament()?._id) {
         return;
      }
      this.resultService.getAllTeamsByTournament(this.selectedTournament()._id).subscribe({
        next: (res: any) => {
          const matches = res?.matches ?? (Array.isArray(res) ? res : []);
          this.resultService.setMatchesOfTournament(matches);
          this.Backup = matches;
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
      const filtered = this.Backup.filter((match) => match.status === 'live' || match.status === 'in_progress');
      this.resultService.setMatchesOfTournament(filtered);
    } else if (tab === 'Concluded') {
      // filter with completed status
      const filtered = this.Backup.filter((match) => match.status === 'completed');
      this.resultService.setMatchesOfTournament(filtered);
    } else {
      // show all matches
      this.resultService.getAllTeamsByTournament(this.selectedTournament()._id).subscribe({
        next: (res: any) => {
          const matches = res?.matches ?? (Array.isArray(res) ? res : []);
          this.Backup = matches;
          this.resultService.setMatchesOfTournament(matches);
        },
        error: (err) => console.error('Failed to load teams', err),
      });
    }
  }

  isTournamentCreatedByCurrentUser(): boolean {
    const tournament = this.selectedTournament();
    if (!tournament?.createdBy) return false;
    const currentUserId = this.authService.userId();
    if (!currentUserId) return false;
    const creatorId =
      typeof tournament.createdBy === 'object' && tournament.createdBy !== null
        ? (tournament.createdBy as { _id?: string })._id
        : String(tournament.createdBy);
    return creatorId === currentUserId;
  }

  startEdit(match: MatchDTO) {
    if (!match._id || !match.teams?.length) return;
    this.editingMatchId = match._id;
    const teamIds = match.teams.map((t) => (t._id || (t as any).id || '').toString()).filter(Boolean);
    this.editScores = {};
    teamIds.forEach((id) => {
      this.editScores[id] = match.result?.score?.[id] ?? 0;
    });
  }

  cancelEdit() {
    this.editingMatchId = null;
    this.editScores = {};
  }

  saveScores(match: MatchDTO) {
    if (!match._id || this.saving) return;
    this.saving = true;
    this.resultService.updateMatchResult(match._id, { ...this.editScores }).subscribe({
      next: () => {
        this.refreshMatches();
        this.cancelEdit();
        this.saving = false;
      },
      error: (err) => {
        console.error('Failed to save scores', err);
        alert('Failed to save scores');
        this.saving = false;
      },
    });
  }

  markAsCompleted(match: MatchDTO) {
    if (!match._id || this.saving) return;
    this.saving = true;
    this.resultService.updateMatchStatus(match._id, 'completed').subscribe({
      next: () => {
        this.refreshMatches();
        this.cancelEdit();
        this.saving = false;
      },
      error: (err) => {
        console.error('Failed to update status', err);
        alert('Failed to mark match as completed');
        this.saving = false;
      },
    });
  }

  private refreshMatches() {
    const t = this.selectedTournament();
    if (!t?._id) return;
    this.resultService.getAllTeamsByTournament(t._id).subscribe({
      next: (res: any) => {
        const matches = res?.matches ?? (Array.isArray(res) ? res : []);
        this.Backup = matches;
        this.resultService.setMatchesOfTournament(matches);
      },
    });
  }

  getTeamId(team: any): string {
    return team?._id || team?.id || '';
  }

  getScore(match: MatchDTO, teamId: string): number {
    if (this.editingMatchId === match._id && teamId in this.editScores) {
      return this.editScores[teamId];
    }
    return match.result?.score?.[teamId] ?? 0;
  }

  setEditScore(teamId: string, value: number) {
    this.editScores[teamId] = Math.max(0, Math.floor(value));
  }
}