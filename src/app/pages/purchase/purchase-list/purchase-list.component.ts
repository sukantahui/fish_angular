import { Component, OnInit } from '@angular/core';
import {PurchaseVoucher} from '../../../models/purchaseVoucher.model';
import {PurchaseService} from '../../../services/purchase.service';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit {
  purchaseVouchers: PurchaseVoucher[] = [];

  constructor(private purchaseService: PurchaseService) { }

  ngOnInit(): void {
    this.purchaseVouchers = this.purchaseService.getPurchaseVoucherList();
    this.purchaseService.getPurchaseVoucherUpdateListener().subscribe((response: PurchaseVoucher[]) => {
      this.purchaseVouchers = response;
    });
  }

}
