import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {JobTaskService} from "../../../services/job-task.service";
import {AuthService} from "../../../services/auth.service";
import {JobService} from "../../../services/job.service";
import {JobMaster} from "../../../models/jobMaster.model";
import {FormGroup} from "@angular/forms";
import {OrderService} from "../../../services/order.service";
import {Material} from "../../../models/material.model";
import {Karigarh} from "../../../models/karigarh.model";
import {User} from "../../../models/user.model";
import {JobDetail} from "../../../models/jobDetail.model";

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  sub : object;
  id : number;
  job_number : string;
  jobTaskForm: FormGroup;
  savedJobsData : JobMaster[];
  oneJobData : JobMaster;
  materialList: Material[];
  karigarhData : Karigarh[];
  userData : User;
  karigarhName : string;
  totalData : JobDetail[];

  constructor(private route: ActivatedRoute, private jobTaskService: JobTaskService, private orderService: OrderService, private authService: AuthService,private jobService: JobService) {
  }

  ngOnInit(): void {
    this.jobTaskForm = this.jobTaskService.jobTaskForm;
    this.route.params.subscribe(params => {
      // this.jobTaskForm = this.jobTaskService.jobTaskForm;
      this.id = params['id'];
      this.jobTaskForm.patchValue({id :params['id'] });
      this.savedJobsData = this.jobTaskService.getAllJobList();
      const index = this.savedJobsData.findIndex(x => x.id == this.id);
      this.oneJobData = this.savedJobsData[index];

      this.karigarhData=this.jobService.getAllKarigarhs();
      const karigarhIndex = this.karigarhData.findIndex(x => x.id === this.oneJobData.karigarh_id);
      // this.karigarhName = this.karigarhData[karigarhIndex].person_name;
      if(this.karigarhData[karigarhIndex].person_name){
        this.karigarhName = this.karigarhData[karigarhIndex].person_name;
      }

    });

    this.jobTaskForm = this.jobTaskService.jobTaskForm;

    this.jobTaskService.getSavedJobsUpdateListener().subscribe((jobData: JobMaster[]) => {
      this.savedJobsData = jobData;
      const index = this.savedJobsData.findIndex(x => x.id == this.id);
      this.oneJobData = this.savedJobsData[index];

      this.jobTaskForm.patchValue({id : this.id});
      this.jobTaskForm.value.id = this.oneJobData.id;
      console.log(this.jobTaskForm.value);
      this.job_number = this.oneJobData.job_number;
    });

    this.orderService.getMaterialUpdateListener()
      .subscribe((material: Material[]) => {
        this.materialList = material;
        // const index = this.materialList.findIndex(x => x.id === this.oneJobData.material_id);
        const index = this.materialList.findIndex(x => x.id === this.oneJobData.material_id);
        const f = this.materialList[index];
        this.jobTaskForm.patchValue({material_name : f.material_name, size: this.oneJobData.size});
      });

    this.jobService.getKarigarhUpdateListener().subscribe((karigarhData: Karigarh[]) => {
      this.karigarhData = karigarhData;
      const karigarhIndex = this.karigarhData.findIndex(x => x.id === this.oneJobData.karigarh_id);
      if(this.karigarhData[karigarhIndex].person_name){
        this.karigarhName = this.karigarhData[karigarhIndex].person_name;
      }
    });


   console.log('user1');
   this.userData = JSON.parse(localStorage.getItem('user'));
   // console.log( this.userData.personName);
    this.jobTaskService.getTotal().subscribe((response)=>{
      this.totalData = response.data;
    });
    this.jobTaskService.getTotalDataUpdateListener().subscribe((response) => {
      this.totalData = response;
    });
  }
  testing(){
    // this.karigarhData=this.jobService.getAllKarigarhs();
    // console.log("karigarh data");
    // console.log(this.karigarhData);
    alert("abcd");
  }
}
