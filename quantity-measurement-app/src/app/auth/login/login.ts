import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.error = '';
    this.http.post<any>('http://13.203.151.69:8080/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify({ email: res.email, name: res.name }));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = 'Invalid email or password';
      }
    });
  }

  loginWithGoogle() {
    window.location.href = 'http://13.203.151.69:8080/oauth2/authorization/google';
  }
}