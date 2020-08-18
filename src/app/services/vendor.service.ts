import { Injectable } from '@angular/core';
import {Vendor} from '../models/vendor.model';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class VendorService {
  vendorList: Vendor[] = [];
  vendorSubject = new Subject<Vendor[]>();
  constructor(private http: HttpClient) {
    this.http.get('http://127.0.0.1:8000/api/vendors')
      .subscribe((response: {success: number, data: Vendor[]}) => {
        const {data} = response;
        this.vendorList = data;
        this.vendorSubject.next([...this.vendorList]);
      });
  } // end of constructor
  getVendorUpdateListener(){
    return this.vendorSubject.asObservable();
  }

  getVendorList(){
    return [...this.vendorList];
  }
}
