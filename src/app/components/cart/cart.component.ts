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
  totalPrice: number = 0;
  displayDialog: boolean = false;
  selectedItem: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchCart();
  }

  fetchCart() {
    this.apiService.getCart().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.cartItems = res.data;
          this.cartItems.forEach(item => {
            if (!item.productImage) {
              item.productImage = 'default-image.jpg'; 
            }
          });
          this.apiService.cartLength = this.cartItems.length;
          this.calculateTotal();
        }
      },
      error: () => this.showError('Failed to fetch cart items')
    });
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  checkout() {
    this.apiService.checkoutCart().subscribe({
      next: (res) => {
        this.showSuccess('Checkout successful! Orders created.');
        this.cartItems = [];
        this.apiService.cartLength = 0;
        this.calculateTotal();
      },
      error: () => this.showError('Checkout failed')
    });
  }

  removeFromCart(item: any) {
    this.apiService.removeCart(item.id).subscribe({
      next: () => {
        this.showSuccess('Removed from cart successfully');
        this.cartItems = this.cartItems.filter(c => c.id !== item.id);
        this.calculateTotal();
      },
      error: () => this.showError('Failed to remove from cart')
    });
  }

  showDetails(item: any) {
    this.selectedItem = item;
    this.displayDialog = true;
  }

  showError(msg: string) {
    this.messages = [{ severity: 'error', summary: 'Error', detail: msg }];
  }
  showSuccess(msg: string) {
    this.messages = [{ severity: 'success', summary: 'Success', detail: msg }];
  }
}
