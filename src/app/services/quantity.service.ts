import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

// Change localhost:8082 to EC2 gateway
const BASE = 'http://13.203.151.69:8080/api/v1/quantities';
export interface QuantityDTO {
  value: number;
  unit: string;
  measurementType: string;  // "LENGTH" | "WEIGHT" | "VOLUME" | "TEMPERATURE"
}

export interface QuantityInputDTO {
  thisQuantityDTO: QuantityDTO;
  thatQuantityDTO: QuantityDTO;
}

@Injectable({ providedIn: 'root' })
export class QuantityService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  compare(body: QuantityInputDTO) {
    return this.http.post(`${BASE}/compare`, body, { headers: this.headers() });
  }

  convert(body: QuantityInputDTO) {
    return this.http.post(`${BASE}/convert`, body, { headers: this.headers() });
  }

  add(body: QuantityInputDTO) {
    return this.http.post(`${BASE}/add`, body, { headers: this.headers() });
  }

  subtract(body: QuantityInputDTO) {
    return this.http.post(`${BASE}/subtract`, body, { headers: this.headers() });
  }

  divide(body: QuantityInputDTO) {
    return this.http.post(`${BASE}/divide`, body, { headers: this.headers() });
  }

  getHistory(operation: string) {
    return this.http.get(`${BASE}/history/operation/${operation}`, { headers: this.headers() });
  }
}