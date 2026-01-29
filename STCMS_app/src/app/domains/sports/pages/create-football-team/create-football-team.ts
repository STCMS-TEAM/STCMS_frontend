import { Component, inject, OnInit } from '@angular/core';
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
export class CreateFootballTeam implements OnInit {
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
      next: (res) => {
        console.log('📋 Tournaments loaded:', res);
        this.resultService.setTournaments(res);
      },
      error: (err) => {
        console.error('❌ Error loading tournaments:', err);
        alert('Error loading tournaments. Please refresh the page.');
      },
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

  get name() {
    return this.createTeamForm.get('name');
  }
  
  get tournamentId() {
    return this.createTeamForm.get('tournamentId');
  } 
  get emailsControls() {
    return this.startingPlayers.controls;
  }
  get substituteEmailsControls() {
    return this.substitutes.controls;
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
      const tournamentId = this.createTeamForm.value.tournamentId;
      
      if (!tournamentId) {
        console.error('❌ Tournament ID is required');
        alert('Please select a tournament');
        return;
      }

      const startingEmails = this.startingPlayers.controls
        .map((c) => c.value.email?.trim().toLowerCase())
        .filter(Boolean);
      const substituteEmails = this.substitutes.controls
        .map((c) => c.value.email?.trim().toLowerCase())
        .filter(Boolean);

      // Validar que haya al menos algunos jugadores
      if (startingEmails.length === 0) {
        alert('Please add at least one starting player');
        return;
      }

      // Validar emails duplicados
      const allEmails = [...startingEmails, ...substituteEmails];
      const uniqueEmails = new Set(allEmails);
      if (allEmails.length !== uniqueEmails.size) {
        alert('Duplicate emails detected. Each player must have a unique email address.');
        return;
      }

      const teamDTO: createTeam = {
        name: this.createTeamForm.value.name!,
        players: [...startingEmails, ...substituteEmails],
      };

      console.log('📤 Sending team creation request:', { tournamentId, teamDTO });

      this.resultService.createTeam(tournamentId, teamDTO).subscribe({
        next: (res) => {
          console.log('✅ Team created successfully:', res);
          alert('Team created successfully!');
          // Reset form
          this.createTeamForm.reset();
          this.substitutes.clear();
          // Reinitialize starting players
          while (this.startingPlayers.length !== 0) {
            this.startingPlayers.removeAt(0);
          }
          this.createPlayerArray(11).forEach(player => {
            this.startingPlayers.push(player);
          });
        },
        error: (err) => {
          console.error('❌ Error creating team:', err);
          let errorMessage = 'Error creating team. ';
          
          if (err.error?.message) {
            // El backend devuelve mensajes en italiano o inglés
            const backendMessage = err.error.message;
            
            // Traducir mensajes comunes del backend
            if (backendMessage.includes('User not found') || backendMessage.includes('user not found')) {
              errorMessage = 'One or more player emails do not exist in the system. Please ensure all player emails are registered users.';
            } else if (backendMessage.includes('non esiste') || backendMessage.includes('non existe')) {
              errorMessage = 'One or more player emails do not exist in the system. Please ensure all player emails are registered users.';
            } else if (backendMessage.includes('già iscritti') || backendMessage.includes('already registered')) {
              errorMessage = 'Some players are already registered in another team for this tournament.';
            } else if (backendMessage.includes('stesso giocatore') || backendMessage.includes('same player')) {
              errorMessage = 'Duplicate players detected. Each player must be unique.';
            } else if (backendMessage.includes('esiste già') || backendMessage.includes('already exists')) {
              errorMessage = 'A team with this name already exists in this tournament. Please choose a different name.';
            } else {
              errorMessage = backendMessage;
            }
          } else if (err.status === 401 || err.status === 403) {
            errorMessage = 'You must be logged in to create a team. Please log in and try again.';
          } else if (err.status === 400) {
            errorMessage = 'Invalid data. Please check all fields and ensure all player emails are valid and unique.';
          } else if (err.status === 404) {
            // El 404 puede ser por torneo no encontrado o usuario no encontrado
            if (err.error?.message?.includes('User not found')) {
              errorMessage = 'One or more player emails do not exist in the system. Please ensure all player emails are registered users.';
            } else {
              errorMessage = 'Tournament not found. Please select a valid tournament.';
            }
          } else if (err.status === 0) {
            errorMessage = 'Network error. Please check your connection and try again.';
          } else {
            errorMessage += 'Please try again.';
          }
          
          alert(errorMessage);
        },
      });
    } else {
      this.createTeamForm.markAllAsTouched();
      console.warn('Form validation errors:', this.getFormValidationErrors());
    }
  }

  private getFormValidationErrors(): any {
    const errors: any = {};
    Object.keys(this.createTeamForm.controls).forEach(key => {
      const control = this.createTeamForm.get(key);
      if (control && control.invalid) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
