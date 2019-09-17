import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { RootObj } from '../models/root-obj';
import { ApiService } from './api.service';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient, private apiService: ApiService) { }

  // get all
  list(page: Page): Observable<RootObj<[Customer]>> {
    const queryString = `p=${page.pageNumber}&s=${page.pageSize}`;
    return this.apiService.get<RootObj<[Customer]>>(`${this.apiService.apiUrl.customers.home}?${queryString}`);
  }
  getByType(id, page: Page): Observable<RootObj<[Customer]>> {
    const queryString = `p=${page.pageNumber}&s=${page.pageSize}`;
    return this.apiService.get<RootObj<[Customer]>>(`${this.apiService.apiUrl.customers.getByType}/${id}?${queryString}`);
  }
  get(id): Observable<RootObj<Customer>> {
    return this.apiService.get<RootObj<Customer>>(`${this.apiService.apiUrl.customers.home}/${id}`);
  }
  delete(id): Observable<RootObj<Customer>> {
    return this.apiService.delete<RootObj<Customer>>(`${this.apiService.apiUrl.customers.home}/${id}`);
  }
  save(data: Customer): Observable<RootObj<Customer>> {
    if (data.id === 0) {
      return this.apiService.post<RootObj<Customer>>(this.apiService.apiUrl.customers.home, data);
    } else {
      return this.apiService.put<RootObj<Customer>>(`${this.apiService.apiUrl.customers.home}/${data.id}`, data);
    }
  }
}
