import { Component, inject } from '@angular/core';
import { ResultsService } from '../../services/resuls';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { createTeam } from '../../models/tournament';

@Component({
  selector: 'app-create-team',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-team.html',
  styleUrl: './create-team.css',
})
export class CreateTeam {
  private resultService = inject(ResultsService);

  tournaments = this.resultService.tournaments;

  createTeamForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    players: new FormControl('', [Validators.required]),
    tournamentId: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.resultService.getTournaments().subscribe({
      next: (res) => {
        this.resultService.setTournaments(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSubmit() {
    if (this.createTeamForm.valid) {
      console.log('Submitting team:', this.createTeamForm.value);
      const playersArray =
        this.createTeamForm.value.players
          ?.split(',')
          .map((p) => p.trim())
          .filter((p) => p.length > 0) || [];

      const teamDTO: createTeam = {
        name: this.createTeamForm.value.name!,
        players: playersArray,
      };
      this.resultService.createTeam(this.createTeamForm.value.tournamentId!, teamDTO).subscribe({
        next: (res) => {
          console.log('✅ Team created successfully:', res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.createTeamForm.markAllAsTouched();
    }
  }
}
