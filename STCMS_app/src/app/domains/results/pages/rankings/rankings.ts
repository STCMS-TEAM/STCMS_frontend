import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsService } from '../../services/resuls';
import { RankingEntry } from '../../../../shared/models/tournament';

@Component({
  selector: 'app-rankings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rankings.html',
  styleUrl: './rankings.css',
})
export class Rankings {
  private resultService = inject(ResultsService);

  rankings = signal<RankingEntry[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  selectedTournament = this.resultService.selectedTournament;

  constructor() {
    effect(() => {
      const tournament = this.selectedTournament();
      if (!tournament?._id) {
        this.rankings.set([]);
        this.error.set(null);
        return;
      }
      this.loading.set(true);
      this.error.set(null);
      this.resultService.getRankings(tournament._id).subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : (data as any)?.standings ?? (data as any)?.rankings ?? [];
          this.rankings.set(list);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load rankings', err);
          this.rankings.set([]);
          this.error.set('Could not load standings');
          this.loading.set(false);
        },
      });
    });
  }

  getTeamName(entry: RankingEntry): string {
    if (entry.teamName) return entry.teamName;
    if (typeof entry.team === 'string') return entry.team;
    if (entry.team && typeof entry.team === 'object') return entry.team.name ?? '';
    return '-';
  }
}
