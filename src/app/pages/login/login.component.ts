import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username = '';
  password = '';

  http= inject(HttpClient);

constructor(private authService: AuthService, private router:Router){
  }

  onLogin() {
this.authService.login(this.username, this.password).subscribe({
            next: (response) => {
                this.authService.storeToken(response.token);
                this.router.navigateByUrl("dashboard"); // Redirect after login
            },
            error: (err) => {
                console.error('Login failed', err);
            }
        });
    }
}
