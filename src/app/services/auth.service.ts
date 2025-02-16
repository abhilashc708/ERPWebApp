import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private apiUrl = `${environment.apiBaseUrl}/api/public/auth/signin`;
      private http = inject(HttpClient);

      login(username: string, password: string): Observable<{ token: string }> {
          return this.http.post<{ token: string }>(this.apiUrl, { username, password });
      }

      storeToken(token: string) {
          localStorage.setItem('jwtToken', token);
      }

      getToken(): string | null {
          return localStorage.getItem('jwtToken');
      }
     logout() {
          localStorage.removeItem("jwtToken"); // Remove the token
        }

  constructor() { }
}
