import { Injectable } from '@angular/core';
import {ProductCategory} from '../models/productCategory.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

export interface ProductCategoryResponse{
  success: number;
  data: ProductCategory[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  productCategories: ProductCategory[] = [];
  productCategorySubject = new Subject<ProductCategory[]>();
  constructor(private http: HttpClient) {
    this.http.get('http://127.0.0.1:8000/api/productCategories')
      .subscribe((response: ProductCategoryResponse) => {
        const {data} = response;
        this.productCategories = data;
        this.productCategorySubject.next([...this.productCategories]);
      });
  }

  getProductCategories(){
    return [...this.productCategories];
  }
  getProductCategoryUpdateListener(){
    return this.productCategorySubject.asObservable();
  }
}
