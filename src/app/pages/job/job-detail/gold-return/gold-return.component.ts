import { Component, OnInit } from '@angular/core';
import {JobService} from "../../../../services/job.service";
import {FormGroup} from "@angular/forms";
import {JobTaskService} from "../../../../services/job-task.service";
import {ActivatedRoute} from "@angular/router";
import {JobMaster} from "../../../../models/jobMaster.model";
import {OrderService} from "../../../../services/order.service";
import {Material} from "../../../../models/material.model";
import { MatSnackBar } from '@angular/material/snack-bar';
import {SncakBarComponent} from "../../../../common/sncak-bar/sncak-bar.component";
import {JobDetail} from "../../../../models/jobDetail.model";



@Component({
  selector: 'app-gold-return',
  templateUrl: './gold-return.component.html',
  styleUrls: ['./gold-return.component.scss']
})
export class GoldReturnComponent implements OnInit {

  jobMasterId : number;
  jobTaskForm: FormGroup;
  savedJobsData : JobMaster[];
  oneJobData : JobMaster;
  materialData : Material[];
  jobTaskData : JobDetail[];
  total : number;
  showJobTaskData = false;
  public currentError: any;

  constructor(private jobTaskService: JobTaskService,private router: ActivatedRoute,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.jobTaskForm = this.jobTaskService.jobTaskForm;
    this.savedJobsData = this.jobTaskService.getAllJobList();
    this.router.parent.params.subscribe(params =>{
      this.jobMasterId=params.id;
    });
    const index = this.savedJobsData.findIndex(x => x.id == this.jobMasterId);
    this.oneJobData = this.savedJobsData[index];
    this.materialData=this.jobTaskService.getMaterials();
    const matIndex=this.materialData.findIndex(x =>x.main_material_id == this.oneJobData.material_id);
    this.jobTaskForm.patchValue({material_name: this.materialData[matIndex].material_name});

    this.jobTaskService.getJobTaskDataUpdateListener().subscribe((response) => {
      this.jobTaskData = response;
    });
  }


  onSubmit(){
    if(this.jobTaskForm.value.return_quantity === null){
      this._snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: 'Please enter quantity before submit'}
      });
    }else {
      this.router.parent.params.subscribe(params => {
        this.jobMasterId = params.id;
      });
      this.savedJobsData = this.jobTaskService.getAllJobList();
      const index = this.savedJobsData.findIndex(x => x.id == this.jobMasterId);
      this.oneJobData = this.savedJobsData[index];
      // console.log(this.oneJobData);

      this.materialData = this.jobTaskService.getMaterials();
      const matIndex = this.materialData.findIndex(x => x.main_material_id == this.oneJobData.material_id);
      // console.log(this.materialData[matIndex]);
      const user = JSON.parse(localStorage.getItem('user'));
      // this.jobTaskForm.patchValue({ job_Task_id:2, material_name: this.materialData[matIndex].material_name, material_id: this.materialData[matIndex].id,id:this.jobMasterId, size:this.oneJobData.size,employee_id: user.id });
      this.jobTaskForm.patchValue({
        job_Task_id: 2,
        material_id: this.materialData[matIndex].id,
        id: this.jobMasterId,
        size: this.oneJobData.size,
        employee_id: user.id
      });
      this.jobTaskForm.value.return_quantity = -this.jobTaskForm.value.return_quantity;
      // console.log(this.jobTaskForm.value);
      this.jobTaskService.jobReturn().subscribe((response) => {
        if (response.success === 1) {
          this._snackBar.openFromComponent(SncakBarComponent, {
            duration: 4000, data: {message: 'Gold Returned'}
          });
          this.total = this.total + parseFloat(this.jobTaskForm.value.return_quantity);
          this.jobTaskService.getTotal().subscribe();
          this.jobTaskService.jobTaskData().subscribe();
          this.jobTaskForm.controls['return_quantity'].reset();
        }
        this.currentError = null;

      }, (error) => {
        console.log('error occured ');
        console.log(error);
        this.currentError = error;
        this._snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: error.message}
        });
      });
    }

  }

  getTotal(){
    this.total=0;
    this.showJobTaskData = true;
    this.router.parent.params.subscribe(params =>{
      this.jobMasterId=params.id;
    });
    this.savedJobsData = this.jobTaskService.getAllJobList();
    const index = this.savedJobsData.findIndex(x => x.id == this.jobMasterId);
    this.oneJobData = this.savedJobsData[index];
    const user = JSON.parse(localStorage.getItem('user'));
    // this.jobTaskForm.patchValue({ job_Task_id:1, material_name: this.oneJobData.material_name, material_id: this.oneJobData.material_id,id:this.jobMasterId, size:this.oneJobData.size,employee_id: user.id });
    this.jobTaskForm.patchValue({ job_Task_id:2, material_id: this.oneJobData.material_id,id:this.jobMasterId, size:this.oneJobData.size,employee_id: user.id });
    this.jobTaskService.jobTaskData().subscribe((response) => {
      // console.log(response.data);
      this.jobTaskData = response.data;
      for(let i=0;i<this.jobTaskData.length;i++) {
        this.total = this.total + this.jobTaskData[i].material_quantity;
      }
    });
  }

}

