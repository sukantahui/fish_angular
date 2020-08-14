import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Agent} from '../models/agent.model';

import {Subject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Material} from '../models/material.model';
import {OrderMaster} from '../models/orderMaster.model';
import {OrderDetail} from '../models/orderDetail.model';
import {Product} from '../models/product.model';
import {catchError, tap} from 'rxjs/operators';
import {Customer} from '../models/customer.model';
// this global.ts file is created to store all global variables
import {GlobalVariable} from '../shared/global';


export interface OrderResponseData {
  success: number;
  data: object;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderMasterForm: FormGroup;
  orderDetailsForm: FormGroup;
  // storing material
  materialData: Material[] = [];
  // storing agent
  agentData: Agent[] = [];
  // orderMaster is used to store the form orderMasterForm.value
  orderMaster: OrderMaster;
  // orderMasterData used to store the orderList
  // orderMasterData: object;
  // orderDetails used to store all the details in this array
  orderDetails: OrderDetail[] = [];
  // orderDetailUpdate is for updating a single odder details

  orderMasterData : OrderMaster[] = [];
  productData :  Product[] ;
  orderDetailUpdate: object;
  private agentSub = new Subject<Agent[]>();
  private materialSub = new Subject<Material[]>();
  private orderSub = new Subject<OrderMaster[]>();
  private orderDetailsSub = new Subject<OrderDetail[]>();

  private productDataSub = new Subject<Product[] >();

  getAgentUpdateListener(){
    return this.agentSub.asObservable();
  }

  getOrderDetailsListener(){
    return this.orderDetailsSub.asObservable();
  }
  getMaterialUpdateListener(){
    return this.materialSub.asObservable();
  }

  getOrderUpdateListener(){
    return this.orderSub.asObservable();
  }


  getProductDataUpdateListener(){
    return this.productDataSub.asObservable();
  }


  constructor(private http: HttpClient) {
    this.orderMasterForm = new FormGroup({
      id : new FormControl(null),
      customer_id : new FormControl(null, [Validators.required]),
      agent_id : new FormControl(null, [Validators.required]),
      order_date : new FormControl('', [Validators.required]),
      delivery_date : new FormControl(null, [Validators.required])
    });

    this.orderDetailsForm = new FormGroup({
      id : new FormControl(null),
      material_id : new FormControl(3, [Validators.required]),
      model_number : new FormControl(null, [Validators.required]),
      p_loss : new FormControl(null, [Validators.required]),
      price : new FormControl(null, [Validators.required]),
      price_code : new FormControl(null, [Validators.required]),
      approx_gold : new FormControl(null, [Validators.required]),
      size : new FormControl(null, [Validators.required]),
      quantity : new FormControl(null, [Validators.required]),
      amount : new FormControl({value: 0, disabled: true} , [Validators.required])
    });
    // fetching agents
    this.http.get(GlobalVariable.BASE_API_URL + '/agents')
      .subscribe((response: {success: number, data: Agent[]}) => {
        const {data} = response;
        this.agentData = data;
        this.agentSub.next([...this.agentData]);
      });

    this.http.get(GlobalVariable.BASE_API_URL + '/orderMaterials')
      .subscribe((response: {success: number, data: Material[]}) => {
        const {data} = response;
        this.materialData = data;
        // console.log(this.materialData);
        this.materialSub.next([...this.materialData]);
      });

    // fetching order List
    this.http.get(GlobalVariable.BASE_API_URL + '/orders')
      .subscribe((response: {success: number, data: OrderMaster[]}) => {
        const {data} = response;
        this.orderMasterData = data;
        // @ts-ignore
        this.orderSub.next([...this.orderMasterData]);
      });
  }
  getOrderMaster(){
    return([...this.orderMasterData]);
  }
  getMaterials(){
    return([...this.materialData]);
  }
  // this function is to save the orderMasterForm value while pressing in save
  setOrderMasterData() {
    this.orderMaster = this.orderMasterForm.value;
  }
  // this function is to unshift the details while pressing in add product
  setOrderDetails(){
    this.orderDetails.unshift(this.orderDetailsForm.value);
  }
  // this function sets the data for order details update for single product
  setOrderDetailsForUpdate(){
    this.orderDetailUpdate = this.orderDetailsForm.value;
  }


  saveOrder(){
    // tslint:disable-next-line:max-line-length
       console.log(this.orderMaster);
       return this.http.post<OrderResponseData>( GlobalVariable.BASE_API_URL + '/orders', {master: this.orderMaster, details: this.orderDetails})
         .pipe(catchError(this._serverError), tap(((response: {success: number, data: OrderMaster}) => {
          if(this.orderMaster.id===null) {
            this.orderMasterData.unshift(response.data);
          }
          // console.log(this.orderMaster);

          this.orderSub.next([...this.orderMasterData]);
        })));
    }

  fetchOrderDetails(order_master_id){
    this.http.post(GlobalVariable.BASE_API_URL + '/orderDetails', {orderMasterId: order_master_id})
      .subscribe((response: {success: number, data: OrderDetail[]}) => {
        const {data} = response;
        this.orderDetails = data;

        this.orderDetailsSub.next([...this.orderDetails]);
      });
  }

  updateOrder(){
    // this.http.patch(GlobalVariable.BASE_API_URL + '/orders', {master: this.orderMaster, details: this.orderDetailUpdate})
    //   .subscribe((response: {success: number, orderDetail: OrderDetail, orderMaster: OrderMaster}) => {

      return this.http.patch(GlobalVariable.BASE_API_URL + '/orders',{master: this.orderMaster, details: this.orderDetailUpdate})
      .pipe(catchError(this._serverError), tap((response: {success: number, orderDetail: OrderDetail, orderMaster: OrderMaster}) => {
        // instant changing the order details after update
        const {orderDetail} = response;
        // @ts-ignore
        const detailIndex = this.orderDetails.findIndex(x => x.id === this.orderDetailUpdate.id);
        if (detailIndex === -1){
          this.orderDetails.unshift(orderDetail);
        }else {
          this.orderDetails[detailIndex] = response.orderDetail;
        }
        this.orderDetailsSub.next([...this.orderDetails]);
      }));
  }

  masterUpdate(){
    // console.log(id);
    // tslint:disable-next-line:max-line-length
    return this.http.patch(GlobalVariable.BASE_API_URL + '/orderMaster', { master: this.orderMasterForm.value})
      .pipe(catchError(this._serverError), tap((response: {success: number, data: OrderMaster}) => {
        const {data} = response;
        // @ts-ignore
        const masterIndex = this.orderMasterData.findIndex(x => x.id === this.orderMasterForm.value.id);
        this.orderMasterData[masterIndex] = response.data;
        // @ts-ignore
        this.orderSub.next([...this.orderMasterData]);
      }));
  }

  deleteOrderDetails(id){
    return this.http.delete(GlobalVariable.BASE_API_URL + '/ordersDetailsDelete/' + id)
      .pipe(catchError(this._serverError), tap((response: {success: number, data: string}) => {
        const index = this.orderDetails.findIndex(x => x.id === id);
        this.orderDetails.splice(index , 1);
        this.orderDetailsSub.next([...this.orderDetails]);
      }));
  }

  deleteOrderMaster(id){
    // console.log('deleteOrderMaster')
    return this.http.delete(GlobalVariable.BASE_API_URL + '/orderMasterDelete/' + id)
      .pipe(catchError(this._serverError), tap((response: {success: number, data: string}) => {
        // @ts-ignore
        const index = this.orderMasterData.findIndex(x => x.id === id);
        // @ts-ignore
        this.orderMasterData.splice(index , 1);
        // @ts-ignore
        this.orderSub.next([...this.orderMasterData]);
      }));
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

  getProductData(model_number,customer_category_id){

    this.http.post(GlobalVariable.BASE_API_URL + '/getProductData',{'model_number' : model_number, 'customer_category_id'  :customer_category_id})
      .subscribe((response: {success: number, data: Product[]}) => {
        const {data} = response;
        this.productData = data;
        console.log(this.productData);

        this.productDataSub.next([...this.productData]);
      });

  }



}
