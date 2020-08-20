import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class PurchaseService {
  purchaseMasterForm: FormGroup;
  constructor() {
    this.purchaseMasterForm = new FormGroup({
      id : new FormControl(null),
      invoice_number : new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.minLength(2)]),
      purchase_date : new FormControl(null, [Validators.required]),
      vendor_id : new FormControl(null, [Validators.required])
    });
  }
}
