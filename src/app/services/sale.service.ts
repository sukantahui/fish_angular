import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {formatDate} from '@angular/common';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {PurchaseMaster} from '../models/purchaseMaster.model';
import {PurchaseDetail} from '../models/purchaseDetail.model';
import {TransactionMaster} from '../models/transactionMaster.model';
import {TransactionDetail} from '../models/transactionDetail.model';
import {PurchaseVoucher} from '../models/purchaseVoucher.model';
import {catchError, tap} from 'rxjs/operators';
import {SaleMaster} from '../models/saleMaster.model';
import {SaleDetail} from '../models/saleDetail.model';
import {Subject, throwError} from 'rxjs';
import {GlobalVariable} from '../shared/global';
import {SaleVoucher} from '../models/saleVoucher.model';
import {SaleTransactionDetail} from '../models/saleTransactionDetail';



@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class SaleService {
  public transactionMasterForm: FormGroup;
  public transactionDetailForm: FormGroup;
  public saleMasterForm: FormGroup;
  public saleDetailForm: FormGroup;
  public userData: {id: number, personName: string, _authKey: string, personTypeId: number};
  public saleVouchers: SaleVoucher[] = [];
  public saleTransactionDetail: SaleTransactionDetail;
  saleVoucherSubject = new Subject<SaleVoucher[]>();
  saleTransactionDetailSubject = new Subject<any>();

  constructor(private http: HttpClient) {

    this.http.get(GlobalVariable.BASE_API_URL + '/sales')
      .subscribe((response: {success: number, data: SaleVoucher[]}) => {
        const {data} = response;
        this.saleVouchers = data;
        this.saleVoucherSubject.next([...this.saleVouchers]);
      });

    this.userData = JSON.parse(localStorage.getItem('user'));
    if (!this.userData){
      return;
    }else{
      console.log(this.userData);
    }

    this.saleMasterForm = new FormGroup({
      id: new FormControl(null),
      discount: new FormControl(0),
      round_off: new FormControl(0),
      loading_n_unloading_expenditure: new FormControl(0),
      comment: new FormControl(0),
    });
    this.saleDetailForm = new FormGroup({
      id: new FormControl(null),
      sale_master_id: new FormControl(null),
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
      // this is original date
      transaction_date: new FormControl(val, [Validators.required]),
      transaction_number: new FormControl(null),
      voucher_id: new FormControl(1, [Validators.required, Validators.maxLength(20), Validators.minLength(2)]),           // purchase
      employee_id: new FormControl(this.userData.id)
    });
    this.transactionDetailForm = new FormGroup({
      id: new FormControl(null),
      transaction_master_id: new FormControl(null),
      transaction_type_id: new FormControl(1),
      ledger_id: new FormControl(null, [Validators.required]),           // purchase
      amount: new FormControl(0)
    });
  }

  // tslint:disable-next-line:max-line-length
  saveSale(saleMaster: SaleMaster, saleDetails: SaleDetail[], transactionMaster: TransactionMaster, transactionDetails: TransactionDetail[]) {
    // tslint:disable-next-line:max-line-length
    return this.http.post<{ success: number, data: SaleVoucher }>('http://127.0.0.1:8000/api/dev/sales',
      {
        sale_master: saleMaster,
        sale_details: saleDetails,
        transaction_master: transactionMaster,
        transaction_details: transactionDetails
      })
      .pipe(catchError(this.handleError), tap((response: {success: number, data: SaleVoucher}) => {
        this.saleVouchers.unshift(response.data);
        // this.vendorList.unshift(response.data);
        this.saleVoucherSubject.next([...this.saleVouchers]);
      }));
  }

  getSaleDetailsByTransactionId(id: number){
    return this.http.get<{success: number; data: SaleTransactionDetail}>('http://127.0.0.1:8000/api/sales/' + id)
      .pipe(catchError(this.handleError), tap((response: {success: number, data: SaleTransactionDetail}) => {
        this.saleTransactionDetail = response.data;
        this.saleTransactionDetailSubject.next({...this.saleTransactionDetail});
      }));
  }
  getSaleDetailsByTransactionUpdateListener(){
    return this.saleTransactionDetailSubject.asObservable();
  }

  getSaleVoucherUpdateListener(){
    return this.saleVoucherSubject.asObservable();
  }

  getSaleVoucherList(){
    return [...this.saleVouchers];
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
