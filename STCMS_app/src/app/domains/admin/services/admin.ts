import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  private readonly baseUrl = `${environment.API_DEV_URL}/users`;

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${user.id}`, user);
  }
}
