import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { ResultsService } from '../../services/resuls';
import { AuthService } from '../../../../core/auth/services/auth';
import { Tournament } from '../../../../shared/models/tournament';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tournaments',
  imports: [CommonModule],
  templateUrl: './tournaments.html',
  styleUrl: './tournaments.css',
})
export class Tournaments {
  private resultService = inject(ResultsService);
  private authService = inject(AuthService);
  selectedSport = this.resultService.selectedSport;
  tournaments = this.resultService.tournaments;
  selectedTournament = this.resultService.selectedTournament;
  isMobile = signal(window.innerWidth < 768);

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth < 768);
  }

  constructor() {
    effect(() => {
      const sport = this.selectedSport();
      this.resultService.getTournamentsBySport(sport).subscribe({
        next: (res: any) => {
          const raw = Array.isArray(res) ? res : (res?.data ?? res?.items ?? []);
          const list = Array.isArray(raw) ? raw.map((t: any) => ({ ...t, matches: [] })) : [];
          this.resultService.setTournaments(list);
          if (list.length) {
            this.resultService.toggleTournament(list[0]);
          } else {
            this.resultService.toggleTournament(null as any);
          }
        },
        error: () => {
          this.resultService.setTournaments([]);
          this.resultService.toggleTournament(null as any);
        },
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

  isTournamentCreatedByCurrentUser(tournament: Tournament): boolean {
    const currentUserId = this.authService.userId();
    if (!currentUserId || !tournament.createdBy) return false;
    const creatorId =
      typeof tournament.createdBy === 'object' && tournament.createdBy !== null
        ? (tournament.createdBy as { _id?: string })._id
        : String(tournament.createdBy);
    return creatorId === currentUserId;
  }

  deleteTournament(event: Event, tournament: Tournament) {
    event.stopPropagation();
    const id = tournament._id || tournament.id;
    if (!id) return;
    if (!confirm(`Are you sure you want to delete the tournament "${tournament.name}"?`)) return;
    this.resultService.deleteTournament(id).subscribe({
      next: () => {
        const updated = this.tournaments().filter((t) => (t._id || t.id) !== id);
        this.resultService.setTournaments(updated);
        if (this.selectedTournament() && (this.selectedTournament()._id || this.selectedTournament().id) === id) {
          this.resultService.toggleTournament(updated[0] ?? (null as any));
        }
      },
      error: (err) => {
        console.error('Error deleting tournament', err);
        alert('Failed to delete tournament. You may not have permission.');
      },
    });
  }
}
