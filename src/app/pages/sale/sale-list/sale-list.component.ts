import { Component, OnInit } from '@angular/core';
import {SaleVoucher} from '../../../models/saleVoucher.model';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent implements OnInit {
  searchTerm: any;
  pageSize: any;
  p: string | number;
  saleVouchers: SaleVoucher;

  constructor() { }

  ngOnInit(): void {
  }

  getSaleInfoById(id: any) {
    
  }
}
