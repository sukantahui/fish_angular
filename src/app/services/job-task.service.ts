import {Injectable, OnDestroy} from '@angular/core';
import {GlobalVariable} from '../shared/global';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OrderDetail} from '../models/orderDetail.model';
import {Subject, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {JobMaster} from '../models/jobMaster.model' ;
import {JobDetail} from 'src/app/models/jobDetail.model';
import {OrderMaster} from '../models/orderMaster.model';
import {OrderResponseData} from './order.service';
import {Material} from "../models/material.model";

@Injectable({
  providedIn: 'root'
})
export class JobTaskService implements OnDestroy{

  jobTaskForm: FormGroup;
  materialData : Material[];

  savedJobsList: JobMaster[];
  jobMasterData: JobMaster;
  jobDetailData: JobDetail[];
  jobReturnData : JobDetail;
  totalData : JobDetail[];
  private savedJobsSub = new Subject<JobMaster[]>();
  private materialDataSub = new Subject<Material[]>();
  private getJobTaskDataSub = new Subject<JobDetail[]>();
  private jobReturnDataSub = new Subject<JobDetail>();
  private totalDataSub = new Subject<JobDetail[]>();

  getSavedJobsUpdateListener(){
    return this.savedJobsSub.asObservable();
  }
  getJobTaskDataUpdateListener(){
    return this.getJobTaskDataSub.asObservable();
  }

  getTotalDataUpdateListener(){
    return this.totalDataSub.asObservable();
  }
  // getJobReturnDataUpdateListener(){
  //   return this.jobReturnDataSub.asObservable();
  // }


  constructor(private http: HttpClient) {

    this.jobTaskForm = new FormGroup({
      id : new FormControl(null),
      // job_number : new FormControl(null, [Validators.required]),
      // approx_gold : new FormControl(null, [Validators.required]),
      // p_loss : new FormControl(null, [Validators.required]),
      size : new FormControl(null, [Validators.required]),
      // price : new FormControl(null, [Validators.required]),
      return_quantity : new FormControl(null, [Validators.required]),
      material_name : new FormControl({value: null, disabled: true}, [Validators.required]),
      material_id : new FormControl(null, [Validators.required]),
      job_Task_id : new FormControl(null, [Validators.required]),
      employee_id : new FormControl(null, [Validators.required])
    });

    //fetching the orders which are sent to job

    this.http.get(GlobalVariable.BASE_API_URL + '/savedJobs')
      .subscribe((response: {success: number, data: JobMaster[]}) => {
        const {data} = response;
        this.savedJobsList = data;
        console.log('service job task');
        this.savedJobsSub.next([...this.savedJobsList]);
      });

    this.http.get(GlobalVariable.BASE_API_URL + '/materials')
      .subscribe((response: {success: number, data: Material[]}) => {
        const {data} = response;
        this.materialData = data;
        console.log('service job task');
        this.materialDataSub.next([...this.materialData]);
      });
  }

  getAllJobList(){
    // console.log('from getAllJobList');
    return [...this.savedJobsList];
  }

  getMaterials(){
    return[...this.materialData];
  }

  ngOnDestroy(): void {
    this.getJobTaskDataSub.complete();
  }

  jobReturn(){
      return this.http.post(GlobalVariable.BASE_API_URL + '/saveReturn', { data: this.jobTaskForm.value})
       .pipe(catchError(this._serverError), tap(((response: {success: number, data: JobDetail}) => {
             const {data} = response;
             this.jobReturnData = data;
            //  this.jobReturnDataSub.next([...this.jobReturnData]);

      })));


    // this.http.post(GlobalVariable.BASE_API_URL + '/saveReturn', { data : this.jobTaskForm.value})
    //   .subscribe((response: {success: number, data: JobDetail}) => {
    //     // const {data} = response;
    //     // if (data){
    //     //   this.jobTaskForm.reset();
    //     // }
    //     // this.jobDetailData.unshift(response.data);
    //
    //   });
  }



  // jobTaskData(task_id) {
  //   this.http.get(GlobalVariable.BASE_API_URL + '/getJobTaskData/' + task_id)
  //     .subscribe((response: {success: number, data: JobDetail[]}) => {
  //       const {data} = response;
  //       this.jobDetailData = data;
  //       this.getJobTaskDataSub.next([...this.jobDetailData]);
  //     });
  // }
  jobTaskData() {
    return this.http.post( GlobalVariable.BASE_API_URL + '/getJobTaskData', { data : this.jobTaskForm.value})
      .pipe(catchError(this._serverError), tap(((response: {success: number, data: JobDetail[]}) => {
        const {data} = response;
        this.jobDetailData = data;
        this.getJobTaskDataSub.next([...this.jobDetailData]);
      })));
  }

  getTotal(){
    return this.http.post( GlobalVariable.BASE_API_URL + '/getTotal', { data : this.jobTaskForm.value})
      .pipe(catchError(this._serverError), tap(((response: {success: number, data: JobDetail[]}) => {
        const {data} = response;
        this.totalData = data;
        this.totalDataSub.next([...this.totalData]);
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
