import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResultsService } from '../../services/resuls';
import { TournamentForm } from '../../../../shared/models/tournament';

@Component({
  selector: 'app-create-tournament',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './create-tournament.html',
  styleUrl: './create-tournament.css',
})
export class CreateTournament {
  private router = inject(Router);
  private resultService = inject(ResultsService);

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

  get name() {
    return this.tournamentForm.get('name');
  }
  
  get description() {
    return this.tournamentForm.get('description');
  }
  get startDate() {
    return this.tournamentForm.get('startDate');
  }

  get endDate() {
    return this.tournamentForm.get('endDate');
  }
  
  get type() {
    return this.tournamentForm.get('type');
  }
  
  get sport() {
    return this.tournamentForm.get('sport');
  }
  get typeTournament() {
    return this.tournamentForm.get('type');
  }

  onSubmit() {
    if (this.tournamentForm.valid) {
      const formValue = this.tournamentForm.getRawValue();

      const tournament: TournamentForm = {
        name: formValue.name,
        description: formValue.description,
        startDate: formValue.startDate, // convert string → Date
        endDate: formValue.endDate, // convert string → Date
        type: formValue.type,
        sport: formValue.sport,
      };

      this.resultService.createTournament(tournament).subscribe({
        next: (res) => {
          console.log('✅ Tournament created successfully:', res);
          this.router.navigate(['/result']);
        },
        error: (err) => {
          console.error('❌ Error creating tournament:', err);
          alert('Error creating tournament, please try again.');
        },
      });
    } else {
      console.warn('Form is invalid, please fill all required fields');
    }
  }
}
