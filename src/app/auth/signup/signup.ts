import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  signup() {
    this.error = '';
    this.http.post<any>('http://13.203.151.69:8080/auth/register', {
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify({ email: res.email, name: res.name }));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Signup failed';
      }
    });
  }
}