import { Component, OnInit } from '@angular/core';
import {VendorService} from '../../services/vendor.service';
import {Vendor} from '../../models/vendor.model';
import {FormControl, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
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
          text: error,
          footer: '<a href>Why do I have this issue?</a>',
          timer: 0
        });
      });
  }
  updateVendor() {

  }
}
