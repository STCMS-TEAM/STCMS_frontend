import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResultsService } from '../../services/resuls';
import { AuthService } from '../../../../core/auth/services/auth';
import { TournamentForm } from '../../models/tournament';

@Component({
  selector: 'app-create-tournament',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './create-tournament.html',
  styleUrl: './create-tournament.css',
})
export class CreateTournament {
  private router = inject(Router);
  private resultService = inject(ResultsService);
  private authService = inject(AuthService);

  tournamentForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    startDate: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    endDate: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl<string>('single_elimination', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    sport: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.tournamentForm.valid) {
      const formValue = this.tournamentForm.getRawValue();

      const tournament: TournamentForm = {
        name: formValue.name,
        description: formValue.description,
        startDate: new Date(formValue.startDate), // convert string → Date
        endDate: new Date(formValue.endDate), // convert string → Date
        type: formValue.type,
        sport: formValue.sport,
      };

      this.resultService.createTournament(tournament).subscribe({
        next: (res) => {
          console.log('✅ Tournament created successfully:', res);
          this.router.navigate(['/tournaments']);
        },
        error: (err) => {
          console.error('❌ Error creating tournament:', err);
        },
      });
    } else {
      console.warn('Form is invalid, please fill all required fields');
    }
  }
}
