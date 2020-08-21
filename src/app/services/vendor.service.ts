import { Injectable } from '@angular/core';
import {Vendor} from '../models/vendor.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Subject, throwError} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {catchError, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class VendorService {
  vendorList: Vendor[] = [];
  vendorSubject = new Subject<Vendor[]>();
  vendorForm: FormGroup;
  constructor(private http: HttpClient) {
    this.http.get('http://127.0.0.1:8000/api/vendors')
      .subscribe((response: {success: number, data: Vendor[]}) => {
        const {data} = response;
        this.vendorList = data;
        this.vendorSubject.next([...this.vendorList]);
      });

    this.vendorForm = new FormGroup({
      id : new FormControl(null),
      person_name : new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.minLength(4)]),
      billing_name : new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.minLength(4)]),
      email : new FormControl(null, [Validators.required, Validators.email]),
      mobile1 : new FormControl('+91', [Validators.maxLength(10)]),
      mobile2 : new FormControl('+91', [Validators.maxLength(10)]),
      person_type_id : new FormControl(11),
      customer_category_id : new FormControl(1),
      address1 : new FormControl(null),
      address2 : new FormControl(null),
      state : new FormControl('West Bengal'),
      po : new FormControl(null),
      area : new FormControl(null),
      city : new FormControl(null),
      pin : new FormControl(null, [Validators.pattern('^[0-9]*$'), Validators.maxLength(6)])
    });

  } // end of constructor
  getVendorUpdateListener(){
    return this.vendorSubject.asObservable();
  }

  getVendorList(){
    return [...this.vendorList];
  }

  saveVendor(vendor) {
    return this.http.post<{ success: number, data: object }>('http://127.0.0.1:8000/api/vendors', vendor)
      .pipe(catchError(this.handleError), tap((response: {success: number, data: Vendor}) => {
        this.vendorList.unshift(response.data);
        this.vendorSubject.next([...this.vendorList]);
      }));
  }



  fillVendorFormByUpdateAbleData(vendor){
    this.vendorForm.setValue(vendor);
  }

  updateVendor(vendor: Vendor) {
    return this.http.patch<{ success: number, data: object }>('http://127.0.0.1:8000/api/vendors', vendor)
      .pipe(catchError(this.handleError), tap((response: {success: number, data: Vendor}) => {
        const index = this.vendorList.findIndex(x => x.id === vendor.id);
        this.vendorList[index] = response.data;
        this.vendorSubject.next([...this.vendorList]);
      }));
  }

  deleteVendor(id: number) {
    return this.http.delete<{success: number, id: number}>('http://127.0.0.1:8000/api/vendors/' + id)
      .pipe(catchError(this.serverError), tap((response: {success: number, id: number, data: string}) => {
        if (response.success === 1){
          const index = this.vendorList.findIndex(x => x.id === id);
          if (index !== -1) {
            this.vendorList.splice(index, 1);
          }
        }

        this.vendorSubject.next([...this.vendorList]); // here two user is used one is user and another user is subject of rxjs
      }));
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
