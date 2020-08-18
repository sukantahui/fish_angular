import {Injectable, OnDestroy} from '@angular/core';
import {Product} from '../models/product.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Subject, throwError} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {catchError, tap} from 'rxjs/operators';
import {ProductCategory} from '../models/productCategory.model';
import {User} from '../models/user.model';


export interface ProductResponseData {
  success: number;
  data: object;
}

@Injectable({
  providedIn: 'root'
})

export class ProductService implements OnDestroy {
  products: Product[] = [];
  productForm: FormGroup;
  productSubject = new Subject<Product[]>();



  constructor(private http: HttpClient) {

    this.http.get('http://127.0.0.1:8000/api/products')
      .subscribe((response: {success: number, data: Product[]}) => {
        const {data} = response;
        this.products = data;
        this.productSubject.next([...this.products]);
      });

    this.productForm = new FormGroup({
      id : new FormControl(null),
      product_code : new FormControl(null, [Validators.required, Validators.maxLength(6), Validators.minLength(2)]),
      product_name : new FormControl(null, [Validators.required, Validators.maxLength(50), Validators.minLength(4)]),
      product_category_id : new FormControl(1, [Validators.required])
    });
  }
  getProducts(){
    // when no data it will return null;
    // console.log('getting products from product service');
    return [...this.products];
  }
  getProductUpdateListener(){
    return this.productSubject.asObservable();
  }


  fillFormByUpdatebaleData(product){
    this.productForm.setValue(product);
  }


  saveProduct(product){
    return this.http.post<ProductResponseData>('http://127.0.0.1:8000/api/products', product)
      .pipe(catchError(this.handleError), tap((resData: {success: number, data: Product}) => {
        // tslint:disable-next-line:max-line-length
        this.products.unshift(resData.data);
        this.productSubject.next([...this.products]);
      }));  // this.handleError is a method created by me
  }

  updateProduct(product){

    return this.http.patch<ProductResponseData>('http://127.0.0.1:8000/api/products' , product)
      .pipe(catchError(this.serverError), tap((response: {success: number, data: Product}) => {
        const index = this.products.findIndex(x => x.id === product.id);
        this.products[index] = response.data;
        // console.log(response);
        this.productSubject.next([...this.products]);
      }));
  }


  deleteProduct(id){
    return this.http.delete<{success: number, id: number}>('http://127.0.0.1:8000/api/products/' + id)
      .pipe(catchError(this.serverError), tap((response: {success: number, id: number}) => {
        if (response.success === 1){
          const index = this.products.findIndex(x => x.id === id);
          if (index !== -1) {
            this.products.splice(index, 1);
          }
        }

        this.productSubject.next([...this.products]); // here two user is used one is user and another user is subject of rxjs
      }));  // this.handleError is a method created by me
  }


  private serverError(err: any) {
    // console.log('sever error:', err);  // debug
    if (err instanceof Response) {
      return throwError('backend server error');
      // if you're using lite-server, use the following line
      // instead of the line above:
      // return Observable.throw(err.text() || 'backend server error');
    }
    if (err.status === 0){
      // tslint:disable-next-line:label-position
      return throwError ({status: err.status, message: 'Backend Server is not Working', statusText: err.statusText});
    }
    if (err.status === 401){
      // tslint:disable-next-line:label-position
      return throwError ({status: err.status, message: 'Your are not authorised', statusText: err.statusText});
    }
    return throwError(err);
  }
  private handleError(errorResponse: HttpErrorResponse){
    return throwError(errorResponse.error.message);
  }
  ngOnDestroy(): void {
  }

}
