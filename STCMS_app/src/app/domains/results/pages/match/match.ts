import { Component, effect, inject, computed } from '@angular/core';
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
  private Backup: any[] = [];
  selectedTournament = this.resultService.selectedTournament;
  tabs = ['All', 'Live', 'Concluded', 'Scheduled'];
  
  // Computed that always returns an array
  matchesOfTournament = computed(() => {
    const matches = this.resultService.matchesOfTournament();
    const safeArray = Array.isArray(matches) ? matches : [];
    if (!Array.isArray(matches)) {
      console.warn('⚠️ matchesOfTournament is not an array:', matches, 'Returning empty array');
    }
    return safeArray;
  });

  constructor() {
    // Effect to log changes in matchesOfTournament
    effect(() => {
      if (!this.selectedTournament()?._id) {
        // Reset to empty array when no tournament is selected
        this.resultService.setMatchesOfTournament([]);
        this.Backup = [];
        return;
      }
      this.resultService.getAllTeamsByTournament(this.selectedTournament()._id).subscribe({
        next: (res) => {
          // Extract matches array from response (backend returns {debug: {...}, matches: [...]})
          const matches = Array.isArray(res) ? res : (res?.matches || []);
          console.log('📋 Response:', res, 'Extracted matches:', matches, 'Is array?', Array.isArray(matches));
          this.resultService.setMatchesOfTournament(matches);
          this.Backup = matches;
          // Verify signal was set correctly
          const signalValue = this.resultService.matchesOfTournament();
          console.log('✅ Signal value after set:', signalValue, 'Is array?', Array.isArray(signalValue));
        },
        error: (err) => {
          console.error('❌ Failed to load matches', err);
          this.resultService.setMatchesOfTournament([]);
          this.Backup = [];
        },
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
      const filtered = this.Backup.filter(
        (match) => match.status === 'pending'
      );
      this.resultService.setMatchesOfTournament(filtered);
    } 
    else if (tab === 'Live') {
      // filter with in_progress status
      const filtered = this.Backup.filter(
        (match) => match.status === 'in_progress'
      );
      this.resultService.setMatchesOfTournament(filtered);
    }
    else if (tab === 'Concluded') {
      // filter with completed status
      const filtered = this.Backup.filter(
        (match) => match.status === 'completed'
      );
      this.resultService.setMatchesOfTournament(filtered);
    }
    else {
      // show all matches
      this.resultService.getAllTeamsByTournament(this.selectedTournament()._id).subscribe({
        next: (res) => {
          // Extract matches array from response
          const matches = Array.isArray(res) ? res : (res?.matches || []);
          this.Backup = matches;
          this.resultService.setMatchesOfTournament(matches);
        },
        error: (err) => console.error('Failed to load teams', err),
      });
    }
  }
}
