import { Component, inject } from '@angular/core';
import { ResultsService } from '../../../results/services/resuls';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { createTeam } from '../../../../shared/models/tournament';

@Component({
  selector: 'app-create-football-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-football-team.html',
  styleUrls: ['./create-football-team.css'],
})
export class CreateFootballTeam {
  private resultService = inject(ResultsService);
  private fb = inject(FormBuilder);

  tournaments = this.resultService.tournaments;

  createTeamForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    tournamentId: ['', [Validators.required]],
    startingPlayers: this.fb.array(this.createPlayerArray(11)), // 11 fixed
    substitutes: this.fb.array([]),
  });

  ngOnInit() {
    this.resultService.getTournaments({ sport: 'soccer' }).subscribe({
      next: (res) => this.resultService.setTournaments(res),
      error: (err) => console.error(err),
    });
  }

  get startingPlayers(): FormArray {
    return this.createTeamForm.get('startingPlayers') as FormArray;
  }

  get substitutes(): FormArray {
    return this.createTeamForm.get('substitutes') as FormArray;
  }

  createPlayerArray(count: number): FormGroup[] {
    return Array.from({ length: count }, () =>
      this.fb.group({
        email: ['', [Validators.required, Validators.email]],
      }),
    );
  }

  addSubstitute() {
    if (this.substitutes.length < 7) {
      // ✅ limit to 7 substitutes
      this.substitutes.push(this.fb.group({ email: ['', [Validators.email]] }));
    }
  }

  removeSubstitute(index: number) {
    this.substitutes.removeAt(index);
  }

  onSubmit() {
    if (this.createTeamForm.valid) {
      const startingEmails = this.startingPlayers.controls
        .map((c) => c.value.email)
        .filter(Boolean);
      const substituteEmails = this.substitutes.controls.map((c) => c.value.email).filter(Boolean);

      const teamDTO: createTeam = {
        name: this.createTeamForm.value.name!,
        players: [...startingEmails, ...substituteEmails],
      };

      this.resultService.createTeam(this.createTeamForm.value.tournamentId!, teamDTO).subscribe({
        next: (res) => console.log('✅ Team created successfully:', res),
        error: (err) => console.error(err),
      });
    } else {
      this.createTeamForm.markAllAsTouched();
    }
  }
}
