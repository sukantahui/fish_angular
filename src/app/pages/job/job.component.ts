import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {JobService} from '../../services/job.service';
import {Karigarh} from '../../models/karigarh.model';
import {Product} from '../../models/product.model';
import {OrderService} from '../../services/order.service';
import {OrderMaster} from '../../models/orderMaster.model';
import {OrderDetail} from '../../models/orderDetail.model';
import {DatePipe} from '@angular/common';
import {Observable} from 'rxjs';
import {SncakBarComponent} from '../../common/sncak-bar/sncak-bar.component';
import {ConfirmationDialogService} from '../../common/confirmation-dialog/confirmation-dialog.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProductService} from '../../services/product.service';
import {Material} from '../../models/material.model';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  jobMasterForm: FormGroup;
  jobDetailsForm: FormGroup;
  karigarhData: Karigarh[] = [];
  orderMasterData: OrderMaster[];
  orderDetails: OrderDetail[];
  products: Product[];
  materialList: Material[] = [];
  showProduct = true;
  minDate = new Date(2010, 11, 2);
  maxDate = new Date(2021, 3, 2);
  pipe = new DatePipe('en-US');
  isEditEnabled = true;

  constructor(private productService: ProductService, private _snackBar: MatSnackBar, private confirmationDialogService: ConfirmationDialogService, private jobService: JobService, private orderService: OrderService) {
    this.products = this.productService.getProducts();
  }

  ngOnInit(): void {
    this.jobMasterForm = this.jobService.jobMasterForm;
    this.jobDetailsForm = this.jobService.jobDetailsForm;
    this.products = this.productService.getProducts();
    this.orderMasterData = this.orderService.getOrderMaster();
    this.jobService.getKarigarhUpdateListener().subscribe((responseProducts: Karigarh[]) => {
      this.karigarhData = responseProducts;
    });
    this.orderService.getOrderUpdateListener().subscribe((responseProducts: OrderMaster[]) => {
      this.orderMasterData = responseProducts;
      console.log (this.orderMasterData);
    });
    this.productService.getProductUpdateListener()
      .subscribe((responseProducts: Product[]) => {
        this.products = responseProducts;
      });
    this.orderService.getMaterialUpdateListener()
      .subscribe((material: Material[]) => {
        this.materialList = material;
        console.log(this.materialList);
      });
  }

  viewDetails(data) {
    this.orderService.fetchOrderDetails(data.id);
    this.orderService.getOrderDetailsListener()
      .subscribe((orderDetails: []) => {
        this.showProduct = false;
        this.orderDetails = orderDetails;
      });
  }

  productShow() {
    this.showProduct = !this.showProduct;
  }

  placeJob(details) {
    console.log(details);
    const index = this.materialList.findIndex(x => x.id === details.material_id);
    this.jobMasterForm.patchValue({
      model_number: details.model_number,
      order_details_id: details.id,
      material_name: this.materialList[index].material_name
    });
    this.jobDetailsForm.patchValue({material_id: details.material_id, id: details.id});
  }

  onSubmit() {

    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to send order to job ?')
      .then((confirmed) => {

        if (confirmed) {

          this.jobMasterForm.value.date = this.pipe.transform(this.jobMasterForm.value.date, 'yyyy-MM-dd');
          const user = JSON.parse(localStorage.getItem('user'));
          this.jobDetailsForm.value.employee_id = user.id;
          // console.log(this.jobDetailsForm.value);
          let saveObserable = new Observable<any>();
          saveObserable = this.jobService.saveJob();
          saveObserable.subscribe((response) => {
            if (response.success === 1) {
              const index = this.orderDetails.findIndex(x => x.id === this.jobDetailsForm.value.id);
              this.orderDetails[index].job_status = 1;
              // this.isEditEnabled = false;
              this.jobMasterForm.reset();
              this.jobDetailsForm.reset();
              this._snackBar.openFromComponent(SncakBarComponent, {
                duration: 4000, data: {message: 'Job Saved'}
              });
            }
          }, (error) => {
            console.log('error occured ');
            console.log(error);
            this._snackBar.openFromComponent(SncakBarComponent, {
              duration: 4000, data: {message: error.message}
            });
          });
        }


      })

      .catch(() => {
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');
      });
  }


}
