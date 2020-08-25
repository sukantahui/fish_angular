import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class PurchaseService {
  purchaseMasterForm: FormGroup;
  purchaseDetailForm: FormGroup;
  transactionMaster: FormGroup;
  constructor() {
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
    this.transactionMaster = new FormGroup({
      id: new FormControl(null),
      transaction_date: new FormControl(null),
      transaction_number: new FormControl(null),
      voucher_id: new FormControl(2),           // purchase
      employee_id: new FormControl(null)
    });
  }
}
