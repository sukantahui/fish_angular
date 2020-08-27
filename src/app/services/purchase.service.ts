import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../models/user.model';
import {ProductCategory} from '../models/ProductCategory.model';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class PurchaseService {
  purchaseMasterForm: FormGroup;
  purchaseDetailForm: FormGroup;
  transactionMaster: FormGroup;
  transactionDetail: FormGroup;
  userData: {id: number, personName: string, _authKey: string, personTypeId: number};
  productCategorySubject = new Subject<ProductCategory[]>();
  productCategoryList: ProductCategory[] = [];

  constructor(private http: HttpClient) {
    this.http.get('http://127.0.0.1:8000/api/productCategories')
      .subscribe((response: {success: number, data: ProductCategory[]}) => {
        const {data} = response;
        this.productCategoryList = data;
        this.productCategorySubject.next([...this.productCategoryList]);
      });

    this.userData = JSON.parse(localStorage.getItem('user'));
    if (!this.userData){
      return;
    }else{
      console.log(this.userData);
    }
    this.purchaseMasterForm = new FormGroup({
      id: new FormControl(null),
      discount: new FormControl(0),
      round_off: new FormControl(0),
      loading_n_unloading_expenditure: new FormControl(0),
      comment: new FormControl(0),
    });
    this.purchaseDetailForm = new FormGroup({
      id: new FormControl(null),
      purchase_master_id: new FormControl(null),
      product_id: new FormControl(null),
      unit_id: new FormControl(null),
      quantity: new FormControl(0),
      price: new FormControl(0),
      discount: new FormControl(0),
    });
    const now = new Date();
    this.transactionMaster = new FormGroup({
      id: new FormControl(null),
      transaction_date: new FormControl(now),
      transaction_number: new FormControl(null),
      voucher_id: new FormControl(2),           // purchase
      employee_id: new FormControl(this.userData.id)
    });
    this.transactionDetail = new FormGroup({
      id: new FormControl(null),
      transaction_master_id: new FormControl(null),
      transaction_type_id: new FormControl(2),
      ledger_id: new FormControl(2),           // purchase
      amount: new FormControl(0)
    });
  }
  // End of constructor
  getProductCategoryUpdateListener(){
    return this.productCategorySubject.asObservable();
  }

  getProductCategoryList(){
    return [...this.productCategoryList];
  }
}
