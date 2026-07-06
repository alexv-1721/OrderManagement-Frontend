import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  messages: Message[] = [];
  totalBill: number = 0;
  displayDialog: boolean = false;
  selectedOrder: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.apiService.getOrders().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.orders = res.data;
          this.calculateTotal();
        }
      },
      error: () => this.showError('Failed to fetch orders')
    });
  }
  calculateTotal() {
    this.totalBill = this.orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, current) => sum + current.totalPrice, 0);
  }
  cancelOrder(orderId: number) {
    this.apiService.cancelOrder(orderId).subscribe({
      next: () => {
        this.showSuccess('Order cancelled successfully');
        this.orders = this.orders.filter(o => o.id !== orderId);
        this.calculateTotal();
      },
      error: () => this.showError('Failed to cancel order')
    });
  }

  showDetails(order: any) {
    this.selectedOrder = order;
    this.displayDialog = true;
  }

  showError(msg: string) {
    this.messages = [{ severity: 'error', summary: 'Error', detail: msg }];
  }
  showSuccess(msg: string) {
    this.messages = [{ severity: 'success', summary: 'Success', detail: msg }];
  }
}
