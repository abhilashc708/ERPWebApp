import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Bill {
  billId: number;
  billCode: string;
  phone: string;
  paymentMethod: string;
  billingDate: Date;
  shopId: number;
  shop: {
    shopId: number;
    name: string;
    phone: string;
    location: string;
    address: string;
    email: string;
  };
  items: BillItem[];  // ✅ Ensure this is defined
}

export interface BillItem {
  id: number;
  product: {
    productId: number;
    productName: string;
  };
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private apiUrl = `${environment.apiBaseUrl}/api/user`;
          private http = inject(HttpClient); // Angular 19 inject method

          // ✅ Get shop
          getBills(): Observable<any> {
           return this.http.get<any>(`${this.apiUrl}/bill`);
          }

          // ✅ Save new Bill
            saveBill(itemData: any): Observable<any> {
              return this.http.post(`${this.apiUrl}/bill/create`, itemData);
            }

  constructor() { }
}
