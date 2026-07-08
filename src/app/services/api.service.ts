import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5142/api';
  cartLength: number = 0;
  OrderLength: number = 0;
  page: number = 1;
  productsPerPage: number = 12;
  TotalProducts: number = 0;
  constructor(private http: HttpClient) { 

    this.getCart().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.cartLength = res.data.length;
        }
      },
      error: () => console.error('Failed to fetch cart items')
    });
     this.getOrders().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          console.log(res,"orderresponse");
          
          this.OrderLength = res.data.length;
        }
      },
      error: () => console.error('Failed to fetch orders')
    });
  }
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
  return this.http.get<any>(
    `http://localhost:5142/odata/Product?$skip=${(this.page - 1) * this.productsPerPage}&$top=${this.productsPerPage}&$count=true`,
    { headers: this.getHeaders() }
  );
}
  getProductById(id: string): Observable<any> {
    return this.http.get(`http://localhost:5142/odata/Product/${id}`, { headers: this.getHeaders() });
  }
  getCart(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Cart`, { headers: this.getHeaders() });
  }
  addToCart(cartData: { productId: string, quantity: number }): Observable<any> {
    this.cartLength++;
    return this.http.post(`${this.baseUrl}/Cart`, cartData, { headers: this.getHeaders() });
  }
  getOrders():Observable<any> {
    return this.http.get(`${this.baseUrl}/Order`, { headers: this.getHeaders() });
  }

  createOrder(orderData: { productId: string, quantity: number }): Observable<any> {
     this.OrderLength++;
    return this.http.post(`${this.baseUrl}/Order`, orderData, { headers: this.getHeaders() });
  }

  cancelOrder(orderId: number): Observable<any> {
      this.OrderLength--;
    return this.http.post(`${this.baseUrl}/Order/cancel/${orderId}`, {}, { headers: this.getHeaders() });

  }

   removeCart(productId: string): Observable<any> {
      this.cartLength--;
    return this.http.post(`${this.baseUrl}/Cart/CancelCart`, { ProductId: productId }, { headers: this.getHeaders() });
  }

  checkoutCart(): Observable<any> {
    this.OrderLength += 1;
    this.cartLength = 0;
    return this.http.post(`${this.baseUrl}/Order/checkout`, {}, { headers: this.getHeaders() });
  }
  searchProducts(searchTerm: string): Observable<any> {
    return this.http.get(`http://localhost:5142/odata/Product?$filter=contains(ProductName,'${searchTerm}') or contains(Description,'${searchTerm}')&$skip=${(this.page - 1) * this.productsPerPage}&$top=${this.productsPerPage}`, { headers: this.getHeaders() });
  }
  loadProducts(): Observable<any> {
  return this.http.get<any>(
    `http://localhost:5142/odata/Product?$skip=${(this.page - 1) * this.productsPerPage}&$top=${this.productsPerPage}&$count=true`,
    { headers: this.getHeaders() }
  );
}

}
