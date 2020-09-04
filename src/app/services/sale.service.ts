import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {formatDate} from '@angular/common';
import {HttpClient} from '@angular/common/http';


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


  constructor(private http: HttpClient) {


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
}
