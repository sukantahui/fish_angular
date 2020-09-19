import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {formatDate} from '@angular/common';
import {PurchaseMaster} from '../models/purchaseMaster.model';
import {PurchaseDetail} from '../models/purchaseDetail.model';
import {TransactionMaster} from '../models/transactionMaster.model';
import {TransactionDetail} from '../models/transactionDetail.model';
import {PurchaseVoucher} from '../models/purchaseVoucher.model';
import {catchError, tap} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {Ledger} from '../models/ledger.model';
import {ProductCategory} from '../models/productCategory.model';



@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  transactionMasterForm: FormGroup;
  transactionDetailForm: FormGroup;
  public userData: {id: number, personName: string, _authKey: string, personTypeId: number};
  public ledgerList: Ledger[] = [];
  public ledgerListSubject = new Subject<Ledger[]>();
  constructor(private http: HttpClient, private router: Router) {
    this.userData = JSON.parse(localStorage.getItem('user'));
    if (!this.userData){
      return;
    }
    this.http.get('http://127.0.0.1:8000/api/cashLedgers')
      .subscribe((response: {success: number, data: Ledger[]}) => {
        const {data} = response;
        this.ledgerList = data;
        this.ledgerListSubject.next([...this.ledgerList]);
        console.log(this.ledgerList);
      });
    const now = new Date();
    const val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.transactionMasterForm = new FormGroup({
      id: new FormControl(null),
      // this is original date
      transaction_date: new FormControl(val, [Validators.required]),
      transaction_number: new FormControl(null),
      voucher_id: new FormControl(3, [Validators.required, Validators.maxLength(20), Validators.minLength(2)]),           // purchase
      employee_id: new FormControl(this.userData.id)
    });

    this.transactionDetailForm = new FormGroup({
      id: new FormControl(null),
      transaction_master_id: new FormControl(null),
      transaction_type_id: new FormControl(2),
      ledger_id: new FormControl(null, [Validators.required]),           // purchase
      amount: new FormControl(0)
    });
  } // end of constructor
  private handleError(errorResponse: HttpErrorResponse){
    // when your api server is not working
    if (errorResponse.status === 0){
      alert('your API is not working');
    }
    if (errorResponse.status === 401){
      alert(errorResponse.error.message);
      // this.router.navigate(['/auth']).then();
      this.router.navigate(['/owner']).then(r => {console.log(r); });
      location.reload();
    }

    if (errorResponse.error.message.includes('1062')){
      return throwError({success: 0, status: 'failed', message: 'Record already exists', statusText: ''});
    }else if (errorResponse.error.message.includes('1451')){
      return throwError({success: 0, status: 'failed', message: 'This record can not be deleted', statusText: ''});
    }else {
      return throwError(errorResponse.error.message);
    }
  }
  getLedgerUpdateListener(){
    return this.ledgerListSubject.asObservable();
  }
  getLedgerList(){
    return [...this.ledgerList];
  }
  savePayment(transactionMaster: TransactionMaster, transactionDetails: TransactionDetail[]) {
    // tslint:disable-next-line:max-line-length
    return this.http.post<{ success: number, data: PurchaseVoucher }>('http://127.0.0.1:8000/api/payment',
      {
        transaction_master: transactionMaster,
        transaction_details: transactionDetails
      })
      .pipe(catchError(this.handleError), tap((response: {success: number}) => {
      }));
  }

}
