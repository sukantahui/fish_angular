import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import{JobTaskService} from '../../../services/job-task.service'
import {SncakBarComponent} from '../../../common/sncak-bar/sncak-bar.component';
import {ConfirmationDialogService} from '../../../common/confirmation-dialog/confirmation-dialog.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { OrderDetail } from 'src/app/models/orderDetail.model';
import {JobMaster} from 'src/app/models/jobMaster.model';
import { OrderService } from 'src/app/services/order.service';
import { Material } from 'src/app/models/material.model';
import {JobDetail} from 'src/app/models/jobDetail.model';
import {Observable} from 'rxjs';
import {JobService} from "../../../services/job.service";

@Component({
  selector: 'app-job-task',
  templateUrl: './job-task.component.html',
  styleUrls: ['./job-task.component.scss']
})
export class JobTaskComponent implements OnInit {

  jobTaskForm: FormGroup;
  savedJobsData: JobMaster[];
  materialList: Material[];
  jobDetailsData: JobDetail[] = [];
  totalData : JobDetail[];

  isSendToTask = false;
  jobNumber: string;
  formTaskDiv = false;


  saveBtnName: string;
  isShowJobMasterList = true;
  constructor(private jobTaskService: JobTaskService ,private _snackBar: MatSnackBar, private confirmationDialogService: ConfirmationDialogService, private orderService: OrderService ) {

    console.log('i am constructor');
  }

  ngOnInit(): void {
    console.log('i am initializer');

    this.jobTaskForm = this.jobTaskService.jobTaskForm;

    // this.savedJobsData = this.jobTaskService.getAllJobList();

    // console.log(this.jobTaskService.getAllJobList());
    this.jobTaskService.getSavedJobsUpdateListener().subscribe((jobData: JobMaster[]) => {
      this.savedJobsData = jobData;
    });
    this.savedJobsData = this.jobTaskService.getAllJobList();

    // this.savedJobsData = this.jobTaskService.getAllJobList();
    this.orderService.getMaterialUpdateListener()
      .subscribe((material: Material[]) => {
        this.materialList = material;
      });
  }



  // setTabData(task_id){
  //   this.sum = 0;
  //   this.jobTaskForm.patchValue({job_Task_id: task_id});
  //   let saveObserable = new Observable<any>();
  //   saveObserable = this.jobTaskService.jobTaskData();
  //   saveObserable.subscribe((response) => {
  //     this.jobDetailsData = response.data;
  //     for (let i = 0; i < this.jobDetailsData.length; i++) {
  //       console.log (this.jobDetailsData[i].material_quantity);
  //       this.jobDetailsData[i].material_quantity = Math.abs(this.jobDetailsData[i].material_quantity);
  //       this.sum = this.sum + this.jobDetailsData[i].material_quantity;
  //     }
    // });







  placeDetails(data){
    this.materialList = this.orderService.getMaterials();

    this.isSendToTask = true;
    this.isShowJobMasterList = false;

    const index = this.materialList.findIndex(x => x.id === data.material_id);
    this.jobTaskForm.patchValue({id : data.id, material_id : data.material_id , p_loss : data.p_loss, size: data.size, price : data.price, material_name : this.materialList[index].material_name});

    this.jobNumber = data.job_number;
    // this.jobTaskService.getTotal().subscribe((response)=>{
    //    this.totalData = response.data;
    //
    // });




  }

}
