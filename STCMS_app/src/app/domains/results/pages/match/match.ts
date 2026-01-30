import { Component, effect, inject, computed, signal } from '@angular/core';
import { Tournaments } from '../tournaments/tournaments';
import { ResultsService } from '../../services/resuls';
import { AuthService } from '../../../../core/auth/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-match',
  imports: [CommonModule],
  templateUrl: './match.html',
  styleUrl: './match.css',
})
export class Match {
  private resultService = inject(ResultsService);
  private authService = inject(AuthService);
  selectedTournament = this.resultService.selectedTournament;
  tabs = ['All', 'Live', 'Concluded', 'Scheduled'];

  isCreator = computed(() => {
    const user = this.authService.user() as { _id?: string; id?: string } | null;
    const tour = this.selectedTournament();
    if (!tour?.createdBy || !user) return false;
    const creatorId = (tour.createdBy as any)._id ?? (tour.createdBy as any).id;
    const userId = user._id ?? user.id;
    return !!creatorId && !!userId && String(creatorId) === String(userId);
  });

  canShowCreateMatch = computed(() => false);

  teamsOfTournament = signal<any[]>([]);
  deleteTournamentLoading = signal(false);

  canShowManagement = computed(() => {
    const tour = this.selectedTournament();
    const hasTournament = !!(tour?._id ?? tour?.id);
    return this.authService.isAuth() && hasTournament;
  });
  createTeam1Id = signal<string>('');
  createTeam2Id = signal<string>('');
  createStartDate = signal<string>('');
  createMatchLoading = signal(false);
  createMatchError = signal<string | null>(null);

  matchesOfTournament = computed(() => {
    const list = this.resultService.matchesOfTournament() ?? [];
    const tab = this.activeTab;
    if (tab === 'All') return list;
    if (tab === 'Scheduled') return list.filter((m: any) => m?.status === 'pending');
    if (tab === 'Live') return list.filter((m: any) => m?.status === 'in_progress');
    if (tab === 'Concluded') return list.filter((m: any) => m?.status === 'completed');
    return list;
  });

  constructor() {
    effect(() => {
      const tour = this.selectedTournament();
      const tournamentId = tour?._id ?? tour?.id;
      const creator = this.isCreator();
      if (!tournamentId) {
        this.resultService.setMatchesOfTournament([]);
        this.teamsOfTournament.set([]);
        return;
      }
      this.resultService.getAllTeamsByTournament(tournamentId).subscribe({
        next: (res: any) => {
          const raw = Array.isArray(res) ? res : (res?.data ?? res?.matches ?? res?.items ?? []);
          this.resultService.setMatchesOfTournament(Array.isArray(raw) ? raw : []);
        },
        error: () => this.resultService.setMatchesOfTournament([]),
      });
      if (creator) {
        this.resultService.getTeamsByTournament(tournamentId).subscribe({
          next: (teams: any) => {
            const list = Array.isArray(teams) ? teams : (teams?.data ?? teams?.teams ?? []);
            this.teamsOfTournament.set(list);
          },
          error: () => this.teamsOfTournament.set([]),
        });
      } else {
        this.teamsOfTournament.set([]);
      }
    });
  }

  activeTab: string = 'All';

  getScore(match: any, teamIndex: number): string {
    if (!match?.result?.score || !match?.teams?.length || match.teams.length <= teamIndex) return '-';
    const team = match.teams[teamIndex];
    const id = team?._id ?? team?.id;
    if (id == null) return '-';
    const val = match.result.score[id] ?? match.result.score[String(id)];
    return val != null ? String(val) : '-';
  }

  setActive(tab: string) {
    this.activeTab = tab;
  }

  onTeam1Change(value: string) {
    this.createTeam1Id.set(value);
    this.createMatchError.set(null);
  }

  onTeam2Change(value: string) {
    this.createTeam2Id.set(value);
    this.createMatchError.set(null);
  }

  onStartDateChange(value: string) {
    this.createStartDate.set(value);
    this.createMatchError.set(null);
  }

  deleteTournamentConfirm() {
    const tour = this.selectedTournament();
    const id = tour?._id ?? tour?.id;
    if (!id) return;
    if (!confirm('Delete this tournament? This cannot be undone.')) return;
    this.deleteTournamentLoading.set(true);
    this.resultService.deleteTournament(id).subscribe({
      next: () => {
        this.deleteTournamentLoading.set(false);
        this.refreshTournamentsAndClearSelection();
      },
      error: (err: any) => {
        this.deleteTournamentLoading.set(false);
        alert(err?.error?.message ?? 'Failed to delete tournament.');
      },
    });
  }

  refreshTournamentsAndClearSelection() {
    const sport = this.resultService.selectedSport();
    this.resultService.getTournamentsBySport(sport).subscribe({
      next: (res: any) => {
        const raw = Array.isArray(res) ? res : (res?.data ?? res?.items ?? []);
        const list = Array.isArray(raw) ? raw.map((t: any) => ({ ...t, matches: [] })) : [];
        this.resultService.setTournaments(list);
        this.resultService.toggleTournament(null as any);
      },
      error: () => this.resultService.toggleTournament(null as any),
    });
  }

  createMatchSubmit() {
    const tour = this.selectedTournament();
    const tournamentId = tour?._id ?? tour?.id;
    const team1 = this.createTeam1Id();
    const team2 = this.createTeam2Id();
    const startDate = this.createStartDate();
    if (!tournamentId || !team1 || !team2 || !startDate) {
      this.createMatchError.set('Please select both teams and a date.');
      return;
    }
    if (team1 === team2) {
      this.createMatchError.set('Please select two different teams.');
      return;
    }
    this.createMatchError.set(null);
    this.createMatchLoading.set(true);
    this.resultService.createMatch(tournamentId, [team1, team2], startDate).subscribe({
      next: () => {
        this.createMatchLoading.set(false);
        this.createTeam1Id.set('');
        this.createTeam2Id.set('');
        this.createStartDate.set('');
        this.resultService.getAllTeamsByTournament(tournamentId).subscribe({
          next: (res: any) => {
            const raw = Array.isArray(res) ? res : (res?.data ?? res?.matches ?? res?.items ?? []);
            this.resultService.setMatchesOfTournament(Array.isArray(raw) ? raw : []);
          },
        });
      },
      error: (err: any) => {
        this.createMatchLoading.set(false);
        this.createMatchError.set(err?.error?.message ?? 'Failed to create match.');
      },
    });
  }
}
