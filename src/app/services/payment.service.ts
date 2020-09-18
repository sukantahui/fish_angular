import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  transactionMasterForm: FormGroup;
  transactionDetailForm: FormGroup;
  public userData: {id: number, personName: string, _authKey: string, personTypeId: number};
  constructor(private http: HttpClient) {
    this.userData = JSON.parse(localStorage.getItem('user'));
    if (!this.userData){
      return;
    }
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

}
