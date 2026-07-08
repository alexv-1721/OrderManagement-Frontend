import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  messages: Message[] = [];
  addedToCart: Set<string> = new Set<string>();
  displayDialog: boolean = false;
  selectedProduct: any;
  searchItem: string = '';
  totalProducts: number = 0;
  constructor(private apiService: ApiService, private router: Router) {}
  loading: boolean = true;
  loadingMore: boolean = false;
  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
      return;
    }
    if(this.apiService.TotalProducts>=100){
      this.apiService.TotalProducts = 0;
      this.apiService.page = 1;
    }
    this.fetchProducts();
    
  fromEvent(window, 'scroll')
    .pipe(
      debounceTime(100)
    )
    .subscribe(() => {

      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 &&
        !this.loading && !this.loadingMore
      ) {
        this.apiService.page++;
        this.loadProducts();
      }

    });
  }


handleSearch() {
  console.log(this.searchItem);

  this.apiService.page = 1;
  this.loading = true;
  
  if (this.searchItem.trim() === '') {
    this.fetchProducts();
  } else {
    this.apiService.searchProducts(this.searchItem).subscribe({
      next: (res) => {
        if (res) {
          this.products = res.value;
          this.apiService.TotalProducts = res['@odata.count'];
          console.log(res, "searchresponse");
        }
        this.loading = false;
      },
      error: (err) => {
        this.showError('Failed to fetch products');
        console.log(err);
        this.loading = false;
      }
    });
  }
}

loadProducts() {

  if (this.loadingMore) return;

  this.loadingMore = true;
 if(this.apiService.page*this.apiService.productsPerPage > this.apiService.TotalProducts + this.apiService.productsPerPage){
    this.loadingMore = false;
    return;
  }
  
  if (this.searchItem.trim() !== '') {
    this.apiService.searchProducts(this.searchItem).subscribe({
      next: (res) => {
        this.products = [...this.products, ...res.value];
        this.apiService.TotalProducts = res['@odata.count'];
        this.loadingMore = false;
      },
      error: () => {
        this.loadingMore = false;
      }
    });
  } else {
    this.apiService.getProducts().subscribe({
      next: (res) => {
        this.products = [...this.products, ...res.value];
        this.apiService.TotalProducts = res['@odata.count'];
        this.loadingMore = false;
      },
      error: () => {
        this.loadingMore = false;
      }
    });
  }
}

  fetchProducts() {
    this.loading = false;
    this.apiService.getProducts().subscribe({
      next: (res) => {
        if (res) {
          this.apiService.TotalProducts = res['@odata.count'];
          this.products = res.value;
          console.log(res,"page redirect");
          
          console.log(this.products);
        }
        else{
           console.log(res.success,"error");
        }
      },
      error: (err) =>{ this.showError('Failed to fetch products'); console.log(err); }
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

  showDetails(product: any) {
    this.router.navigate(['/products', product.id]);
  }

  showError(msg: string) {
    this.messages = [{ severity: 'error', summary: 'Error', detail: msg }];
  }
  showSuccess(msg: string) {
    this.messages = [{ severity: 'success', summary: 'Success', detail: msg }];
  }
}
