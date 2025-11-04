import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user';
import { AuthService } from '../../../core/auth/services/auth';
import { createTeam, Tournament, TournamentForm } from '../models/tournament';

@Injectable({ providedIn: 'root' })
export class ResultsService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private authService = inject(AuthService);

  private readonly baseUrl = `${environment.API_DEV_URL}/tournaments`;

  // Signal holds the tournaments array reactively
  tournaments = signal<Tournament[]>([]);

  // Setter method to update the signal
  setTournaments(tournaments: Tournament[]) {
    this.tournaments.set(tournaments);
  }

  // Optional helper to clear it
  clearTournaments() {
    this.tournaments.set([]);
  }
  // TOURNAMENT API
  public createTournament(tournament: TournamentForm): Observable<TournamentForm> {
    return this.http.post<TournamentForm>(`${this.baseUrl}`, tournament);
  }

  public getTournamentsById(id: string): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${this.baseUrl}?sport=${id}`);
  }

  public getTournaments(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${this.baseUrl}`);
  }

  // TEAM API

  public createTeam(id: string, team: createTeam): Observable<createTeam> {
    return this.http.post<createTeam>(`${this.baseUrl}/${id}/teams`, team);
  }
}
