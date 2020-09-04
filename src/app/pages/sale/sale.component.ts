import { Component, OnInit } from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {formatDate} from '@angular/common';
import {FormControl, FormGroup} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {StorageMap} from '@ngx-pwa/local-storage';
import {SaleService} from '../../services/sale.service';
import {CustomerService} from '../../services/customer.service';
import {Product} from '../../models/product.model';
import {Unit} from '../../models/unit.model';
import {Customer} from '../../models/customer.model';
import {ProductCategory} from '../../models/productCategory.model';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
  public transactionMasterForm: FormGroup;
  public transactionDetailForm: FormGroup;
  public saleMasterForm: FormGroup;
  public saleDetailForm: FormGroup;
  public productList: Product[];
  productCategoryList: ProductCategory[] = [];
  public unitList: Unit[];
  public customerList: Customer[];
  public temporaryForm: FormGroup;
  public productListByCategory: Product[];
  public currentTab: number;
  // tslint:disable-next-line:max-line-length
  constructor(private saleService: SaleService, private customerService: CustomerService, private productService: ProductService, private storage: StorageMap) { }

  ngOnInit(): void {


    this.temporaryForm = new FormGroup({
      product_category_id: new FormControl(null)
    });
    this.saleMasterForm = this.saleService.saleMasterForm;
    this.saleDetailForm = this.saleService.saleDetailForm;
    this.transactionMasterForm = this.saleService.transactionMasterForm;
    this.transactionDetailForm = this.saleService.transactionDetailForm;

    this.productList = this.productService.getProducts();
    this.productService.getProductUpdateListener().subscribe(response => {
      this.productList = response;
    });
    this.unitList = this.productService.getUnits();
    this.productService.getUnitUpdateListener().subscribe((responseUnit: Unit[]) => {
      this.unitList = responseUnit;
    });

    this.customerList = this.customerService.getCustomers();
    this.customerService.getCustomerUpdateListener().subscribe(response => {
      this.customerList = response;
    });
  }

  selectProductsByCategory(event: any) {
    const category_id = event.value;
    this.productListByCategory = this.productList.filter(x => x.product_category_id === category_id);
  }

  handleTransactionMasterDateChange($event: MatDatepickerInputEvent<unknown>) {
    let val = this.transactionMasterForm.value.transaction_date;
    val = formatDate(val, 'yyyy-MM-dd', 'en');
    this.transactionMasterForm.patchValue({transaction_date: val});
  }

  isCurrentTab(tab: number){
    return (tab === this.currentTab);
  }
  setCurrentTab(tab: number){
    this.currentTab =  tab;
  }
}
