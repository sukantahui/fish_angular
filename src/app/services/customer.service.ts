import {Injectable, OnDestroy} from '@angular/core';
import {Customer} from '../models/customer.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {catchError, tap} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';
import {CustomerCategory} from '../models/customerCategory.model';


export interface CustomerResponseData {
  success: number;
  data: object;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService implements OnDestroy{
  customerData: Customer[] = [];
  private customerSub = new Subject<Customer[]>();
  customerForm: FormGroup;
  customerCategoryData: CustomerCategory[] = [];
  private customerCategorySub = new Subject<CustomerCategory[]>();

  getCustomers(){
    // when no data it will return null;
    return [...this.customerData];
  }
  getCustomerCategories(){
    // when no data it will return null;
    return [...this.customerCategoryData];
  }

  getCustomerUpdateListener(){
    console.log('customer listener called');
    return this.customerSub.asObservable();
  }

  getCustomerCategoryUpdateListener(){
    console.log('customer Category listener called');
    return this.customerCategorySub.asObservable();
  }

  setData(tempCustomer: Customer){
    this.customerData.push(tempCustomer);
    this.customerSub.next([...this.customerData]);
  }
  constructor(private http: HttpClient) {
    // fetching customers
    this.http.get('http://127.0.0.1:8000/api/customers')
      .subscribe((response: {success: number, data: Customer[]}) => {
        // console.log(response);
        // @ts-ignore
        const {data} = response;
        this.customerData = data;
        this.customerSub.next([...this.customerData]);
    });

    // fetching customer categories
    this.http.get('http://127.0.0.1:8000/api/customerCategories')
      .subscribe((response: {success: number, data: CustomerCategory[]}) => {
        // console.log(response);
        // @ts-ignore
        const {data} = response;
        this.customerCategoryData = data;
        this.customerCategorySub.next([...this.customerCategoryData]);
      });

    this.customerForm = new FormGroup({
      id : new FormControl(null),
      ledger_name : new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      billing_name : new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),
      ledger_group_id : new FormControl(16),
      email : new FormControl(null, [Validators.required, Validators.email]),
      mobile1 : new FormControl('+91', [Validators.maxLength(10)]),
      mobile2 : new FormControl('+91', [Validators.maxLength(10)]),
      customer_category_id: new FormControl(null),
      address1 : new FormControl(null),
      address2 : new FormControl(null),
      state : new FormControl('West Bengal'),
      po : new FormControl(null),
      area : new FormControl(null),
      city : new FormControl(null),
      pin : new FormControl(null, [Validators.pattern('^[0-9]*$'), Validators.maxLength(6)]),
      opening_balance : new FormControl(0),
      transaction_type_id : new FormControl(1)
    });

  } // End of Controller



  saveCustomer(customer){
    return this.http.post<CustomerResponseData>('http://127.0.0.1:8000/api/customers', customer)
      .subscribe((response: {success: number, data: Customer})  => {
        this.customerData.unshift(response.data);
        this.customerSub.next([...this.customerData]);
      });
  }
  updateCustomer(customer){
    return this.http.patch<CustomerResponseData>('http://127.0.0.1:8000/api/customers', customer)
      .pipe(catchError(this._serverError), tap((response: {success: number, data: Customer}) => {
        const index = this.customerData.findIndex(x => x.id === customer.id);
        this.customerData[index] = response.data;
        this.customerSub.next([...this.customerData]); // here two user is used one is user and another user is subject of rxjs
      }));  // this.handleError is a method created by me
  }

  deleteCustomer(id){
    return this.http.delete<{success: number, data: string}>('http://127.0.0.1:8000/api/customers/' + id)
      .pipe(catchError(this._serverError), tap((response: {success: number, data: string}) => {
       if (response.success === 1){
         const index = this.customerData.findIndex(x => x.id === id);
         if (index !== -1) {
           this.customerData.splice(index, 1);
         }
       }

       this.customerSub.next([...this.customerData]); // here two user is used one is user and another user is subject of rxjs
      }));  // this.handleError is a method created by me
  }


  fillFormByUpdatebaleData(customer){
    this.customerForm.setValue(customer);
  }

  private handleError(errorResponse: HttpErrorResponse){
     console.log('Error occured');
     console.log(errorResponse);
     return throwError(errorResponse.error);
  }
  private _serverError(err: any) {
    // console.log('sever error:', err);  // debug
    if (err instanceof Response) {
      return throwError('backend server error');
      // if you're using lite-server, use the following line
      // instead of the line above:
      // return Observable.throw(err.text() || 'backend server error');
    }
    if (err.status === 0){
      // tslint:disable-next-line:label-position
      return throwError ({status: err.status, message: 'Backend Server is not Working', statusText: err.statusText});
    }
    if (err.status === 401){
      // tslint:disable-next-line:label-position
      return throwError ({status: err.status, message: 'Your are not authorised', statusText: err.statusText});
    }
    return throwError(err);
  }

  ngOnDestroy(): void {
    this.customerSub.unsubscribe();
  }

}
