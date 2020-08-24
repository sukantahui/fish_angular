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
      discount : new FormControl(0),
      round_off : new FormControl(0),
      loading_expenditure : new FormControl(0),
      comment : new FormControl(null)
    });
  }
}
