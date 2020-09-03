import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../models/user.model';
import {ProductCategory} from '../models/ProductCategory.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Subject, throwError} from 'rxjs';
import {Unit} from '../models/unit.model';
import {PurchaseMaster} from '../models/purchaseMaster.model';
import {PurchaseDetail} from '../models/purchaseDetail.model';
import {TransactionMaster} from '../models/transactionMaster.model';
import {TransactionDetail} from '../models/transactionDetail.model';
import {catchError, tap} from 'rxjs/operators';
import {Vendor} from '../models/vendor.model';
import {GlobalVariable} from '../shared/global';
import {formatDate} from '@angular/common';
import {Product} from '../models/product.model';
import {PurchaseVoucher} from '../models/purchaseVoucher.model';
import {PurchaseTransactionDetail} from '../models/purchaseTransactionDetail';


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
  purchaseVouchers: PurchaseVoucher[] = [];
  purchaseVoucherSubject = new Subject<PurchaseVoucher[]>();

  purchaseTransactionDetail: PurchaseTransactionDetail = null;
  purchaseTransactionDetailObjectSubject = new Subject<any>();

  constructor(private http: HttpClient) {
    this.http.get(GlobalVariable.BASE_API_URL + '/productCategories')
      .subscribe((response: {success: number, data: ProductCategory[]}) => {
        const {data} = response;
        this.productCategoryList = data;
        this.productCategorySubject.next([...this.productCategoryList]);
      });
    this.http.get(GlobalVariable.BASE_API_URL + '/purchases')
      .subscribe((response: {success: number, data: PurchaseVoucher[]}) => {
        const {data} = response;
        this.purchaseVouchers = data;
        this.purchaseVoucherSubject.next([...this.purchaseVouchers]);
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
    const val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.transactionMasterForm = new FormGroup({
      id: new FormControl(null),
      // transaction_pickup_date: new FormControl(now, [Validators.required]),
      // this is original date
      transaction_date: new FormControl(val, [Validators.required]),
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



  getPurchaseVoucherUpdateListener(){
    return this.purchaseVoucherSubject.asObservable();
  }

  getPurchaseVoucherList(){
    return [...this.purchaseVouchers];
  }


  getPurchaseTransactionDetailObject(){
    return this.purchaseTransactionDetail;
  }
  getPurchaseTransactionDetailObjectListener(){
    return this.purchaseTransactionDetailObjectSubject.asObservable();
  }




  // tslint:disable-next-line:max-line-length
  savePurchase(purchaseMaster: PurchaseMaster, purchaseDetails: PurchaseDetail[], transactionMaster: TransactionMaster, transactionDetails: TransactionDetail[]) {
    // tslint:disable-next-line:max-line-length
    return this.http.post<{ success: number, data: PurchaseVoucher }>('http://127.0.0.1:8000/api/purchases',
      {
        purchase_master: purchaseMaster,
        purchase_details: purchaseDetails,
        transaction_master: transactionMaster,
        transaction_details: transactionDetails
      })
      .pipe(catchError(this.handleError), tap((response: {success: number, data: PurchaseVoucher}) => {
        console.log(response.data);
        this.purchaseVouchers.unshift(response.data);
        // this.vendorList.unshift(response.data);
        this.purchaseVoucherSubject.next([...this.purchaseVouchers]);
      }));
  }

  getPurchaseDetailsByTransactionID(id: number){
    return this.http.get<{success: number; data: PurchaseTransactionDetail}>('http://127.0.0.1:8000/api/purchaseDetails/' + id)
      .pipe(catchError(this.handleError), tap((response: {success: number, data: PurchaseTransactionDetail}) => {
        this.purchaseTransactionDetail = response.data;
        this.purchaseTransactionDetailObjectSubject.next({...this.purchaseTransactionDetail});
      }));
  }


  fillFormByUpdatebaleData(formData){
    console.log('te4sting onke');
    this.purchaseMasterForm.setValue({
      id: null,
      discount: 340,
      round_off: 0,
      loading_n_unloading_expenditure: 0,
      comment: 0
    });
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
