import { Component, OnInit } from '@angular/core';
import {SaleVoucher} from '../../../models/saleVoucher.model';
import {PurchaseVoucher} from '../../../models/purchaseVoucher.model';
import {PurchaseTransactionDetail} from '../../../models/purchaseTransactionDetail';
import {FormControl} from '@angular/forms';
import {SaleService} from '../../../services/sale.service';
import {catchError, tap} from 'rxjs/operators';
import {SaleTransactionDetail} from '../../../models/saleTransactionDetail';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent implements OnInit {
  saleVouchers: SaleVoucher[] = [];
  private saleTransactionDetail: SaleTransactionDetail;
  p = 1;
  page: number;
  pageSize = 5;
  constructor(private saleService: SaleService) { }

  ngOnInit(): void {
    this.saleVouchers = this.saleService.getSaleVoucherList();
    this.saleService.getSaleVoucherUpdateListener().subscribe((response: SaleVoucher[]) => {
      this.saleVouchers = response;
    });
  }

  getSaleInfoById(id: number) {
    // @ts-ignore
    this.saleService.getSaleDetailsByTransactionId(id).subscribe((response: SaleTransactionDetail) => {
      this.saleTransactionDetail = response;
    });
  }
}
