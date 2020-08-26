import { Component, OnInit } from '@angular/core';
import {PurchaseService} from '../../services/purchase.service';
import {FormControl, FormGroup} from '@angular/forms';
import {VendorService} from '../../services/vendor.service';
import {Vendor} from '../../models/vendor.model';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  purchaseMasterForm: FormGroup;
  transactionMaster: FormGroup;
  purchaseDetailForm: FormGroup;
  transactionDetail: FormGroup;
  vendorList: Vendor[] = [];
  constructor(private purchaseService: PurchaseService, private vendorService: VendorService) { }

  ngOnInit(): void {
    this.purchaseMasterForm = this.purchaseService.purchaseMasterForm;
    this.purchaseDetailForm = this.purchaseService.purchaseDetailForm;
    this.transactionMaster = this.purchaseService.transactionMaster;
    this.transactionDetail = this.purchaseService.transactionDetail;
    this.vendorList = this.vendorService.getVendorList();
    this.vendorService.getVendorUpdateListener().subscribe(response => {
      this.vendorList = response;
    });

  }

}
