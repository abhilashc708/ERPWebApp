import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
 private authService = inject(AuthService);
  private router = inject(Router);
  constructor() {
    this.authService.logout();
    this.router.navigateByUrl('/login'); // Redirect to login after logout
  }
}
