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
export interface Category {
    categoryId: number;
    category: string;
}
export interface Item {
     id: number;
        productName: string;
        categoryId: number;
        quantity: string;
        units: string;
        actualPrice: string;
        rate: string;
        mfdDate: Date;
        expDate: Date;
        shopId: number;
        category: Category;
        shop: Shop;

}

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiUrl = `${environment.apiBaseUrl}/api/user`;
        private http = inject(HttpClient); // Angular 19 inject method

        // ✅ Get shop
        getItems(): Observable<any> {
            return this.http.get<any>(`${this.apiUrl}/product`);
          }

        // ✅ Save new item
          saveItem(itemData: any): Observable<any> {
            return this.http.post(`${this.apiUrl}/product/create`, itemData);
          }

        // ✅ Update item function
          updateItem(id: number, itemData: any): Observable<any> {
            return this.http.put(`${this.apiUrl}/product/${id}`, itemData);
          }

        // ✅ Delete shop function
         deleteItem(id: number): Observable<void> {
            return this.http.delete<void>(`${this.apiUrl}/product/${id}`);
          }

  constructor() { }
}
