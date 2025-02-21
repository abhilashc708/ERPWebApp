import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


export interface ExpenseCategory {
    id: number;
    expenseItemName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseCategoryService {
  private apiUrl = `${environment.apiBaseUrl}/api/user`;
  private http = inject(HttpClient); // Angular 19 inject method


// ✅ Get shop
getExpenseCategory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/expense/item`);
  }


// ✅ Save new category
  saveExpenseCategory(expenseCategoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/expense/item/create`, expenseCategoryData);
  }

// ✅ Update shop function
  updateExpenseCategory(id: number, expenseCategoryData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/expense/item/${id}`, expenseCategoryData);
  }
// ✅ Delete shop function
 deleteExpCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/expense/item/${id}`);
  }

  constructor() { }
}
