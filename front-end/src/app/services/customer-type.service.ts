import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RootObj } from '../models/root-obj';
import { ApiService } from './api.service';
import { CustomerType } from '../models/customer-type';
import { Page } from '../models/page';
@Injectable({
  providedIn: 'root'
})
export class CustomerTypeService {

  constructor(private apiService: ApiService) { }

  // get all
  list(page: Page): Observable<RootObj<[CustomerType]>> {
    const queryString = `p=${page.pageNumber}&s=${page.pageSize}`;
    return this.apiService.get<RootObj<[CustomerType]>>(`${this.apiService.apiUrl.customerTypes}?${queryString}`);
  }
  getAll(): Observable<RootObj<[CustomerType]>> {
    return this.apiService.get<RootObj<[CustomerType]>>(this.apiService.apiUrl.customerTypes);
  }
  get(id): Observable<RootObj<CustomerType>> {
    return this.apiService.get<RootObj<CustomerType>>(`${this.apiService.apiUrl.customerTypes}/${id}`);
  }
  delete(id): Observable<RootObj<[CustomerType]>> {
    return this.apiService.delete<RootObj<[CustomerType]>>(`${this.apiService.apiUrl.customerTypes}/${id}`);
  }
  save(data: CustomerType): Observable<RootObj<[CustomerType]>> {
    if (data.id === 0) {
      return this.apiService.post<RootObj<[CustomerType]>>(this.apiService.apiUrl.customerTypes, data);
    } else {
      return this.apiService.put<RootObj<[CustomerType]>>(`${this.apiService.apiUrl.customerTypes}/${data.id}`, data);
    }
  }
}
