import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  messages: Message[] = [];
  addedToCart: Set<string> = new Set<string>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
      return;
    }
    this.fetchProducts();
  }

  fetchProducts() {
    this.apiService.getProducts().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.products = res.data;
        }
      },
      error: (err) => this.showError('Failed to fetch products')
    });
  }

  addToCart(productId: string) {
    this.apiService.addToCart({ productId: productId, quantity: 1 }).subscribe({
      next: () => {
        this.addedToCart.add(productId);
        this.showSuccess('Added to cart');
      },
      error: () => this.showError('Failed to add to cart')
    });
  }

  showError(msg: string) {
    this.messages = [{ severity: 'error', summary: 'Error', detail: msg }];
  }
  showSuccess(msg: string) {
    this.messages = [{ severity: 'success', summary: 'Success', detail: msg }];
  }
}
