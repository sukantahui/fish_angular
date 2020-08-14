import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Karigarh} from '../models/karigarh.model';
import {GlobalVariable} from '../shared/global';
import {Agent} from '../models/agent.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Subject, throwError} from 'rxjs';
import {OrderMaster} from '../models/orderMaster.model';
import {catchError, tap} from 'rxjs/operators';
import {OrderResponseData} from './order.service';
import {JobMaster} from '../models/jobMaster.model';

export interface JobResponseData {
  success: number;
  data: object;
}


@Injectable({
  providedIn: 'root'
})
export class JobService {
  // variable declaration
  jobMasterForm: FormGroup;
  jobDetailsForm: FormGroup;
  karigarhData: Karigarh[] = [];
  orderMaster: OrderMaster[];
  // jobMasterData: JobMaster;

  // subject declaration
  private karigarhSub = new Subject<Karigarh[]>();

  getKarigarhUpdateListener(){
    return this.karigarhSub.asObservable();
  }

  constructor(private http: HttpClient) {

    this.jobMasterForm = new FormGroup({
      id : new FormControl(null),
      date : new FormControl(null, [Validators.required]),
      karigarh_id : new FormControl(null, [Validators.required]),
      gross_weight : new FormControl(null, [Validators.required]),
      order_details_id : new FormControl(null, [Validators.required]),
      model_number : new FormControl({value: null, disabled: true}, [Validators.required]),
      material_name : new FormControl({value: null, disabled: true}, [Validators.required])
    });
    this.jobDetailsForm = new FormGroup({
      id : new FormControl(null),
      employee_id : new FormControl(null, [Validators.required]),
      material_id : new FormControl(null, [Validators.required]),
      material_quantity : new FormControl(null, [Validators.required])
    });

    //fetching karigarhs
    this.http.get(GlobalVariable.BASE_API_URL + '/karigarhs')
      .subscribe((response: {success: number, data: Karigarh[]}) => {
        const {data} = response;
        this.karigarhData = data;
        // console.log(this.karigarhData);
        this.karigarhSub.next([...this.karigarhData]);
      });

  }

  getAllKarigarhs(){
    // console.log('getAllKarigarhs');
    // console.log(this.karigarhData);
    return [...this.karigarhData];
  }
  saveJob(){
    // tslint:disable-next-line:max-line-length
    return this.http.post<JobResponseData>( GlobalVariable.BASE_API_URL + '/jobs', {master: this.jobMasterForm.value, details: this.jobDetailsForm.value})
      .pipe(catchError(this._serverError), tap(((response: {success: number, data: JobMaster}) => {
      })));
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
      return throwError ({status: err.status, message: 'You are not authorised', statusText: err.statusText});
    }
    return throwError(err);
  }
}
