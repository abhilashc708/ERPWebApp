import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Shop {
    shopId: number;
    name: string;
    email: string;
    address: string;
    location: string;
    phone: string;
}

export interface ExpenseItem {
    expenseCategoryId: number;
    expenseItemName: string;
}

export interface Expense {
    expenseId: number;
    paymentMethod: string;
    rate: string;
    shopId: number;
    shop: Shop;
    expenseCategoryId: number;
    expenseItem: ExpenseItem;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

   private apiUrl = `${environment.apiBaseUrl}/api/user`;
          private http = inject(HttpClient); // Angular 19 inject method

          // ✅ Get Expense
          getExpenses(): Observable<any> {
              return this.http.get<any>(`${this.apiUrl}/expense`);
            }

          // ✅ Save new Expense
            saveExpense(expenseData: any): Observable<any> {
              return this.http.post(`${this.apiUrl}/expense/create`, expenseData);
            }

          // ✅ Update Expense function
            updateExpense(id: number, expenseData: any): Observable<any> {
              return this.http.put(`${this.apiUrl}/expense/${id}`, expenseData);
            }

          // ✅ Delete Expense function
           deleteExpense(id: number): Observable<void> {
              return this.http.delete<void>(`${this.apiUrl}/expense/${id}`);
            }

  constructor() { }
}
