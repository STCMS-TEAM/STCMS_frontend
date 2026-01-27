import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
  isAuth = this.authService.isAuth;

  isMenuOpen = signal(false); // this should be used for profile
  isAdmin = signal(false);

  scrollTop() {
    window.scrollTo({ top: 0, left: 0 });
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen.set(false);
  }
}
