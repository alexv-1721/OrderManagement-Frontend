import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5142/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/User/login`, data);
  }
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/User`, data);
  }
  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Product`, { headers: this.getHeaders() });
  }
  getCart(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Cart`, { headers: this.getHeaders() });
  }
  addToCart(cartData: { productId: string, quantity: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/Cart`, cartData, { headers: this.getHeaders() });
  }
  getOrders():Observable<any> {
    return this.http.get(`${this.baseUrl}/Order`, { headers: this.getHeaders() });
  }

  createOrder(orderData: { productId: string, quantity: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/Order`, orderData, { headers: this.getHeaders() });
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/Order/cancel/${orderId}`, {}, { headers: this.getHeaders() });
  }
}
