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

  private handleError(errorResponse: HttpErrorResponse){
    if (errorResponse.error.message.includes('1062')){
      return throwError('Record already exists');
    }else {
      return throwError(errorResponse.error.message);
    }
  }
}
