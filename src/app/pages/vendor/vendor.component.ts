import { Component, OnInit } from '@angular/core';
import {VendorService} from '../../services/vendor.service';
import {Vendor} from '../../models/vendor.model';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {
  componentTitle = 'Vendor Manager';
  vendorList: Vendor[] = [];
  constructor(private vendorService: VendorService) { }

  ngOnInit(): void {
    this.vendorList = this.vendorService.getVendorList();
    this.vendorService.getVendorUpdateListener().subscribe((response: Vendor[]) => {
      this.vendorList = response;
      console.log('After getting data from service ', this.vendorList);
    });
  }

}
