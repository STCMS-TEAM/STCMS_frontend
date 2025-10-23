import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
  isAuth = this.authService.isAuth;

  isMenuOpen = signal(false); // this should be used for profile
  isAdmin = signal(false);

  logout() {
    this.authService.logout();
    this.isMenuOpen.set(false);
  }
}
