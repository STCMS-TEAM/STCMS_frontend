import { Component, inject } from '@angular/core';
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

  tournaments = this.resultService.tournaments;

  ngOnInit() {
    console.log('Tournament', this.tournaments);
  }
}
