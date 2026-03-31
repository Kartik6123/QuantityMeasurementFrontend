import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

// Change localhost:8082 to EC2 gateway
const BASE = 'http://13.203.151.69:8080';
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  register(name: string, email: string, password: string) {
    return this.http.post<{ token: string; email: string; name: string }>(
      `${BASE}/auth/register`, { name, email, password }
    ).pipe(tap(res => this.saveSession(res)));
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string; email: string; name: string }>(
      `${BASE}/auth/login`, { email, password }
    ).pipe(tap(res => this.saveSession(res)));
  }

  loginWithGoogle() {
    window.location.href = `${BASE}/oauth2/authorization/google`;
  }

  handleOAuthCallback(token: string) {
    localStorage.setItem('token', token);
  }

  saveSession(res: { token: string; email: string; name: string }) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('userEmail', res.email);
    localStorage.setItem('userName', res.name);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}