import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Order Management Frontend';

  constructor(private router: Router,private apiService: ApiService) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCartLength(): number {
    return this.apiService.cartLength;
  }
  getOrderLength(): number {
    return this.apiService.OrderLength;
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
