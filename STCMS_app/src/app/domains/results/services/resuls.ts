import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user';

@Injectable({ providedIn: 'root' })
export class ResultsService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  private readonly baseUrl = `${environment.API_DEV_URL}/tournaments`;

  public createTournament(tournament: Tournament): Observable<Tournament> {
    return this.http.post<Tournament>(`${this.baseUrl}`, tournament);
  }
}
