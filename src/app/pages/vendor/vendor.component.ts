import { Component, OnInit } from '@angular/core';
import {VendorService} from '../../services/vendor.service';
import {Vendor} from '../../models/vendor.model';
import {FormControl, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import {SncakBarComponent} from "../../common/sncak-bar/sncak-bar.component";
import {MatSnackBar} from "@angular/material/snack-bar";
@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {
  componentTitle = 'Vendor Manager';
  vendorList: Vendor[] = [];
  searchTerm: string;
  page: number;
  pageSize = 15;
  filter = new FormControl('');
  p = 1;
  vendorForm: FormGroup;
  private  snackBar: MatSnackBar;
  constructor(private vendorService: VendorService) { }

  ngOnInit(): void {
    this.vendorList = this.vendorService.getVendorList();
    this.vendorService.getVendorUpdateListener().subscribe((response: Vendor[]) => {
      this.vendorList = response;
      console.log('After getting data from service ', this.vendorList);
    });
    this.vendorForm = this.vendorService.vendorForm;
  }

  clearVendorForm() {
    this.vendorForm.reset();
  }

  onSubmit() {
    this.vendorService.saveVendor(this.vendorForm.value).subscribe(response => {
      if (response.success === 1){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Product has been saved',
          showConfirmButton: false,
          timer: 3000
        });
      }
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
          footer: '<a href>Why do I have this issue?</a>',
          timer: 0
        });
      });
  }

  populateFormByCurrentVendor(vendor: Vendor) {
    this.vendorService.fillVendorFormByUpdateAbleData(vendor);
  }
  updateVendor() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to add this product',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Create It!'
    }).then((result) => {
      // if selected yes
      if (result.value) {
        this.vendorService.updateVendor(this.vendorForm.value)
          .subscribe((response) => {
            if (response.success === 1){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Vendor has been Updated',
                showConfirmButton: false,
                timer: 3000
              });
            }
          }, (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.message,
              footer: '<a href>Why do I have this issue?</a>',
              timer: 0
            });
          });
      }
    });
  }

  deleteCurrentVendor(vendor: Vendor) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to delete ' + vendor.person_name,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete It!'
    }).then((result) => {
      // if selected yes
      if (result.value) {
        this.vendorService.deleteVendor(vendor.id)
          .subscribe((response) => {
            if (response.success === 1){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Vendor has been deleted',
                showConfirmButton: false,
                timer: 3000
              });
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.data,
                footer: '<a href>Why do I have this issue?</a>',
                timer: 0
              });
            }
          }, (error) => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.message,
              footer: '<a href>Why do I have this issue?</a>',
              timer: 0
            });
          });
      }
    });
  }

}
