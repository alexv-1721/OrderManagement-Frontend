import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLogin = true;
  authForm: FormGroup;
  messages: Message[] = [];

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: ['']
    });
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.messages = [];
    if (!this.isLogin) {
      this.authForm.get('name')?.setValidators([Validators.required]);
    } else {
      this.authForm.get('name')?.clearValidators();
    }
    this.authForm.get('name')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    if (this.isLogin) {
      this.apiService.login(this.authForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.data.token);
          this.router.navigate(['/products']).then(() => window.location.reload());
        },
        error: (err) => this.showError('Login Failed: ' + (err.error?.message || 'Invalid credentials'))
      });
    } else {
      this.apiService.register(this.authForm.value).subscribe({
        next: () => {
          this.isLogin = true;
          this.showSuccess('Registration Successful. Please log in.');
        },
        error: (err) => {
          console.error('Registration error:', err);
          let msg = 'Error occurred';
          if (err.error) {
            if (err.error.message) msg = err.error.message;
            else if (err.error.title) msg = err.error.title;
            else msg = JSON.stringify(err.error);
          }
          this.showError('Registration Failed: ' + msg);
        }
      });
    }
  }

  showError(msg: string) {
    this.messages = [{ severity: 'error', summary: 'Error', detail: msg }];
  }
  showSuccess(msg: string) {
    this.messages = [{ severity: 'success', summary: 'Success', detail: msg }];
  }
}
