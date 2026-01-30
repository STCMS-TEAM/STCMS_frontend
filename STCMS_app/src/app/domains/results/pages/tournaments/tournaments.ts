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
    effect(() => {
      const sport = this.selectedSport();
      this.resultService.getTournamentsBySport(sport).subscribe({
        next: (res: any) => {
          const raw = Array.isArray(res) ? res : (res?.data ?? res?.items ?? []);
          const list = Array.isArray(raw) ? raw.map((t: any) => ({ ...t, matches: [] })) : [];
          this.tournaments.set(list);
          if (list.length) {
            this.resultService.toggleTournament(list[0]);
          } else {
            this.resultService.toggleTournament(null as any);
          }
        },
        error: () => {
          this.tournaments.set([]);
          this.resultService.toggleTournament(null as any);
        },
      });
    });
  }

  selectTournament(tournamentName: string) {
    const list = this.tournaments();
    const selected = list.find((t) => t.name === tournamentName);
    if (!selected?._id) return;
    this.resultService.toggleTournament(selected);
    if (this.isMobile()) {
      this.resultService.toggleShowMatches();
    }
  }
}
