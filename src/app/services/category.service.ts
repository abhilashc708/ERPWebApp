import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Category {
    id: number;
    category: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiBaseUrl}/api/user`;
  private http = inject(HttpClient); // Angular 19 inject method

  constructor() { }


// ✅ Get shop
getCategory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category`);
  }


// ✅ Save new category
  saveCategory(categoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/category/create`, categoryData);
  }

// ✅ Update shop function
  updateCategory(id: number, categoryData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/category/${id}`, categoryData);
  }
// ✅ Delete shop function
 deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/category/${id}`);
  }
}
