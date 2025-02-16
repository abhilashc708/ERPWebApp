import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Role {
    id: number;
    name: string;
}
export interface User {
    id: number;
    name: string;
    email: string;
    address: string;
    location: string;
    phone: string;
    roles: string[];
     roleNames?: string[]; // ✅ Add this to hold formatted role names
}
@Injectable({
  providedIn: 'root'
})
export class UserService {

   private apiUrl = `${environment.apiBaseUrl}/api/admin`;
      private http = inject(HttpClient); // Angular 19 inject method

getUsers(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
    map(users => users.map(user => ({
      ...user,
      roleNames: user.roles.map((role: any) => // Ensure role is treated as an object
        role.name === 'ROLE_USER' ? 'User' :
        role.name === 'ROLE_ADMIN' ? 'Admin' :
        role.name // Fallback for unknown roles
      )
    })))
  );
}

// ✅ Save new user
  saveUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, userData);
  }

// ✅ Update user function
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/userid/${id}`, userData);
  }
// ✅ Delete user function
 deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/userid/${userId}`);
  }
  constructor() { }

}
