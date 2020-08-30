import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../models/user.model';
import {ProductCategory} from '../models/ProductCategory.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Subject, throwError} from 'rxjs';
import {Unit} from '../models/unit.model';
import {PurchaseMaster} from '../models/purchaseMaster.model';
import {PurchaseDetails} from '../pages/purchase/purchase.component';
import {TransactionMaster} from '../models/transactionMaster.model';
import {TransactionDetail} from '../models/transactionDetail.model';
import {catchError, tap} from 'rxjs/operators';
import {Vendor} from '../models/vendor.model';
import {GlobalVariable} from '../shared/global';

export class PurchaseRespose {
  success: number;
}

@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class PurchaseService {
  purchaseMasterForm: FormGroup;
  purchaseDetailForm: FormGroup;
  transactionMasterForm: FormGroup;
  transactionDetailForm: FormGroup;
  userData: {id: number, personName: string, _authKey: string, personTypeId: number};
  productCategorySubject = new Subject<ProductCategory[]>();
  productCategoryList: ProductCategory[] = [];

  constructor(private http: HttpClient) {
    this.http.get(GlobalVariable.BASE_API_URL + '/productCategories')
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
      product_id: new FormControl(null, [Validators.required]),
      unit_id: new FormControl(3, [Validators.required]),
      quantity: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      discount: new FormControl(0),
    });
    const now = new Date();
    this.transactionMasterForm = new FormGroup({
      id: new FormControl(null),
      // transaction_pickup_date: new FormControl(now, [Validators.required]),
      // this is original date
      transaction_date: new FormControl(now, [Validators.required]),
      transaction_number: new FormControl(null, [Validators.required]),
      voucher_id: new FormControl(2, [Validators.required, Validators.maxLength(20), Validators.minLength(2)]),           // purchase
      employee_id: new FormControl(this.userData.id)
    });
    this.transactionDetailForm = new FormGroup({
      id: new FormControl(null),
      transaction_master_id: new FormControl(null),
      transaction_type_id: new FormControl(2),
      ledger_id: new FormControl(null, [Validators.required]),           // purchase
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

  // tslint:disable-next-line:max-line-length
  savePurchase(purchaseMaster: PurchaseMaster, purchaseDetails: PurchaseDetails[], transactionMaster: TransactionMaster, transactionDetails: TransactionDetail[]) {
    // tslint:disable-next-line:max-line-length
    return this.http.post<{ success: number, data: object }>('http://127.0.0.1:8000/api/purchases',
      {
        purchase_master: purchaseMaster,
        purchase_details: purchaseDetails,
        transaction_master: transactionMaster,
        transaction_details: transactionDetails
      })
      .pipe(catchError(this.handleError), tap((response: {success: number, data: PurchaseRespose}) => {
        console.log(response.data);
        // this.vendorList.unshift(response.data);
        // this.vendorSubject.next([...this.vendorList]);
      }));
  }

  private handleError(errorResponse: HttpErrorResponse){
    if (errorResponse.error.message.includes('1062')){
      return throwError({success: 0, status: 'failed', message: 'Record already exists', statusText: ''});
    }else if (errorResponse.error.message.includes('1451')){
      return throwError({success: 0, status: 'failed', message: 'This record can not be deleted', statusText: ''});
    }else {
      return throwError(errorResponse.error.message);
    }
  }

  private serverError(err: any) {
    console.log('sever error:', err);  // debug
    if (err instanceof Response) {
      return throwError({success: 0, status: err.status, message: 'Backend Server is not Working', statusText: err.statusText});
      // if you're using lite-server, use the following line
      // instead of the line above:
      // return Observable.throw(err.text() || 'backend server error');
    }
    if (err.status === 0){
      // tslint:disable-next-line:label-position
      return throwError ({success: 0, status: err.status, message: 'Backend Server is not Working', statusText: err.statusText});
    }
    if (err.status === 401){
      // tslint:disable-next-line:label-position
      return throwError ({success: 0, status: err.status, message: 'Your are not authorised', statusText: err.statusText});
    }
    if (err.status === 500){
      // tslint:disable-next-line:label-position
      return throwError ({success: 0, status: err.status, message: 'Server error', statusText: err.statusText});
    }
    return throwError(err);
  }
}
