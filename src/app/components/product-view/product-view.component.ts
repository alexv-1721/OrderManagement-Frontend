import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Message } from 'primeng/api';


@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent {
  id: string | null = null;
  productDetails: any = null;
  error: boolean = false;
  messages: Message[] = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}
  
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.fetchProductDetails();
    }
  }

  fetchProductDetails() {
    this.apiService.getProductById(this.id!).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.productDetails = res.data;
        } else {
          this.showError('Product not found');
        }
      },
      error: () => this.showError('Failed to fetch product details')
    });
  }

  addToCart(productId: string) {
    this.apiService.addToCart({ productId: productId, quantity: 1 }).subscribe({
      next: () => {
        this.messages = [{ severity: 'success', summary: 'Success', detail: 'Added to cart' }];
      },
      error: () => this.showError('Failed to add to cart')
    });
  }

  showError(msg: string) {
    this.error = true;
    this.messages = [{ severity: 'error', summary: 'Error', detail: msg }];
  }
}