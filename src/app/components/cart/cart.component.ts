import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  messages: Message[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchCart();
  }
 fetchCart() {
    this.apiService.getCart().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.cartItems = res.data;
        }
      },
      error: () => this.showError('Failed to fetch cart items')
    });
  }

  addToOrder(item: any) {
    this.apiService.createOrder({ productId: item.productId || item.id, quantity: 1 }).subscribe({
      next: () => {
        this.showSuccess('Added to order successfully');
      },
      error: () => this.showError('Failed to add to order')
    });
  }

  showError(msg: string) {
    this.messages = [{ severity: 'error', summary: 'Error', detail: msg }];
  }
  showSuccess(msg: string) {
    this.messages = [{ severity: 'success', summary: 'Success', detail: msg }];
  }
}
