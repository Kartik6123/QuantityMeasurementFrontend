import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

const UNITS: any = {
  LENGTH:      ['FEET', 'INCH', 'YARDS', 'CENTIMETERS'],
  WEIGHT:      ['KILOGRAM', 'GRAM', 'POUND'],
  TEMPERATURE: ['CELSIUS', 'FAHRENHEIT', 'KELVIN'],
  VOLUME:      ['LITRE', 'MILLILITRE', 'GALLON']
};

const BASE = 'http://13.203.151.69:8080';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  type = 'LENGTH';
  mode = 'convert';
  value1 = 1;
  value2 = 1;
  unit1 = 'FEET';
  unit2 = 'INCH';
  unitList: string[] = UNITS['LENGTH'];

  result: string | null = null;
  error = '';
  history: any[] = [];
  historyLoaded = false;
  userName = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name || user.email || 'User';
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  setType(t: string) {
    this.type = t;
    this.unitList = UNITS[t] || [];
    this.unit1 = this.unitList[0];
    this.unit2 = this.unitList[1];
    this.result = null;
    this.error = '';
    this.history = [];
    this.historyLoaded = false;
  }

  setMode(m: string) {
    this.mode = m;
    this.result = null;
    this.error = '';
    this.history = [];
    this.historyLoaded = false;
  }

  getEndpoint(): string {
    switch (this.mode) {
      case 'convert':  return 'convert';
      case 'add':      return 'add';
      case 'subtract': return 'subtract';
      case 'divide':   return 'divide';
      case 'compare':  return 'compare';
      default:         return 'convert';
    }
  }

  perform() {
    this.result = null;
    this.error = '';

    const body = {
      thisQuantityDTO: {
        value: this.value1,
        unit: this.unit1,
        measurementType: this.type
      },
      thatQuantityDTO: {
        value: this.value2,
        unit: this.unit2,
        measurementType: this.type
      }
    };

    this.http.post<any>(
      `${BASE}/api/v1/quantities/${this.getEndpoint()}`,
      body,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (res) => {
        if (res.error) {
          this.error = res.errorMessage;
        } else if (res.resultValue !== null && res.resultValue !== undefined) {
          this.result = `${res.resultValue} ${res.resultUnit ?? ''}`.trim();
        } else if (res.resultString !== null && res.resultString !== undefined) {
          this.result = `Equal: ${res.resultString}`;
        } else {
          this.result = 'Done';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 401) {
          this.error = 'Session expired. Please login again.';
          this.router.navigate(['/login']);
        } else {
          this.error = 'Request failed. Try again.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  loadHistory() {
    this.history = [];
    this.historyLoaded = false;

    this.http.get<any[]>(
      `${BASE}/api/v1/quantities/history/operation/${this.getEndpoint()}`,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (res) => {
        this.history = res.slice(-5).reverse();
        this.historyLoaded = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.historyLoaded = true;
        this.history = [];
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}