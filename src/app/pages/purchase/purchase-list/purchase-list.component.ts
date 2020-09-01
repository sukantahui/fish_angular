import { Component, OnInit } from '@angular/core';
import {PurchaseVoucher} from '../../../models/purchaseVoucher.model';
import {PurchaseService} from '../../../services/purchase.service';
import {PurchaseTransactionDetail} from '../../../models/purchaseTransactionDetail';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit {
  purchaseVouchers: PurchaseVoucher[] = [];
  public purchaseTransactionDetailObject: PurchaseTransactionDetail = null;
  private totalPurchaseAmount: number;

  constructor(private purchaseService: PurchaseService) { }

  ngOnInit(): void {
    this.purchaseVouchers = this.purchaseService.getPurchaseVoucherList();
    this.purchaseService.getPurchaseVoucherUpdateListener().subscribe((response: PurchaseVoucher[]) => {
      this.purchaseVouchers = response;
    });
    // this.purchaseTransactionDetailObject = this.purchaseService.getPurchaseTransactionDetailObject();
    this.purchaseService.getPurchaseTransactionDetailObjectListener().subscribe(response => {
      this.purchaseTransactionDetailObject = response;
      console.log(this.purchaseTransactionDetailObject);
    });
  }

  getPurchaseInfoById(id: number) {
    this.purchaseService.getPurchaseDetailsByTransactionID(id).subscribe(response => {

    });
  }
}
