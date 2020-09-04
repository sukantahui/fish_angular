import { Component, OnInit } from '@angular/core';
import {CustomerService} from '../../services/customer.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Customer} from '../../models/customer.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SncakBarComponent} from '../../common/sncak-bar/sncak-bar.component';
import {Observable} from 'rxjs';
import {AuthResponseData} from '../../services/auth.service';
import {CustomerCategory} from '../../models/customerCategory.model';
import Swal from 'sweetalert2';


export class Profile {
  constructor(public prId: number, public prName: string) {
  }
}


// @ts-ignore
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customers: Customer[];
  customer: Customer;
  currentEerror: {status: number, message: string, statusText: string};
  customerCategoryData: CustomerCategory[];
  private defaultFormValue: any;

  constructor(public customerService: CustomerService, private http: HttpClient, private _snackBar: MatSnackBar) {
    console.log('Customer Component calls');
  }

  onCustomerInsert(){
    // this.customerService.setData({id: 1061, name: 'Sujata Barai Station Para', address: 'Station Para', phone: '9232458905'});
    // tslint:disable-next-line:max-line-length
    this.http.post('https://angular-test-db-67686.firebaseio.com/customers.json',
      {name: 'Sandip Dhara', address: 'Barrackpore Shibtala', phone: '5236458905'})
      .subscribe((response) => {
      });
  }

  ngOnInit(): void {

    this.defaultFormValue = this.customerService.customerForm.value;
    this.customerCategoryData = this.customerService.getCustomerCategories();
    console.log('Category', this.customerCategoryData);
    this.customerService.getCustomerCategoryUpdateListener()
      .subscribe((customersCategories: CustomerCategory[]) => {
        console.log('observable returned, now CustomerCategoryData will not be blank');
        this.customerCategoryData = customersCategories;
      });
    this.customerForm = this.customerService.customerForm;
  }

  onGetCustomers() {
    // tslint:disable-next-line:no-unused-expression
  }

  onSubmit() {
    console.log(this.customerForm.value);
    this.customerService.saveCustomer(this.customerForm.value);
    this.customerForm.reset(this.defaultFormValue);

  }

  myCustomValidation(control: FormControl): {[s: string]: boolean } {
      return {customError: true};
  }

  fillFormForUpdate($event){
    this.customerForm.setValue($event);
  }

  clearCustomerForm() {
    this.customerForm.reset();
  }

  // this function will update the customer

  updateCustomer() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to update this Customer',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update It!'
    }).then((result) => {
      // if selected yes
      if (result.value) {
        this.customerService.updateCustomer(this.customerForm.value)
          .subscribe((response) => {
            if (response.success === 1){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Customer has been Updated',
                showConfirmButton: false,
                timer: 3000
              });
            }
          }, (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.message,
              footer: '<a href>Why do I have this issue?</a>',
              timer: 0
            });
          });
      }
    });
  }

}
