import { Component, OnInit } from '@angular/core';
import {PurchaseService} from '../../services/purchase.service';
import {FormControl, FormGroup} from '@angular/forms';
import {VendorService} from '../../services/vendor.service';
import {Vendor} from '../../models/vendor.model';
import {ProductCategory} from '../../models/productCategory.model';
import {Product} from '../../models/product.model';
import {Unit} from '../../models/unit.model';
import {ProductService} from '../../services/product.service';


export interface PurchaseMaster{
  id?: number;
  discount: number;
  round_off: number;
  loading_n_unloading_expenditure: number;
  comment: string;
}
export interface PurchaseDetails{
  id?: number;
  purchase_master_id: number;
  product_id: number;
  unit_id: number;
  quantity: number;
  price: number;
  discount: number;
  product: Product;
  unit: Unit;
}
export interface TransactionMaster{
  id?: number;
  transaction_date: string;
  transaction_number: string;
  voucher_id: number;
  purchase_master_id: number;
  sale_master_id: number;
  employee_id: number;
}

export interface TransactionDetails{
  id?: number;
  transaction_master_id: number;
  transaction_type_id: number;
  ledger_id: number;
  amount: number;
}

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  purchaseMasterForm: FormGroup;
  transactionMasterForm: FormGroup;
  purchaseDetailForm: FormGroup;
  transactionDetailForm: FormGroup;
  vendorList: Vendor[] = [];
  productCategoryList: ProductCategory[] = [];
  productList: Product[] = [];
  productListByCategory: Product[] = [];
  unitList: Unit[] = [];
  purchaseAmount = 0;
  purchaseMaster: PurchaseMaster;
  purchaseDetails: PurchaseDetails[] = [];
  transactionMaster: TransactionMaster;
  transactionDetails: TransactionDetails;

  currentTab = 1;
  constructor(private purchaseService: PurchaseService, private vendorService: VendorService, private productService: ProductService) { }

  ngOnInit(): void {
    this.productCategoryList = this.purchaseService.getProductCategoryList();
    this.purchaseService.getProductCategoryUpdateListener().subscribe(response => {
        // console.log(response);
        this.productCategoryList = response;
    });
    this.productList = this.productService.getProducts();
    this.productService.getProductUpdateListener().subscribe(response => {
      this.productList = response;
    });
    this.unitList = this.productService.getUnits();
    this.productService.getUnitUpdateListener().subscribe((responseUnit: Unit[]) => {
      this.unitList = responseUnit;
    });
    this.purchaseMasterForm = this.purchaseService.purchaseMasterForm;
    this.purchaseDetailForm = this.purchaseService.purchaseDetailForm;
    this.transactionMasterForm = this.purchaseService.transactionMasterForm;
    this.transactionDetailForm = this.purchaseService.transactionDetailForm;
    this.vendorList = this.vendorService.getVendorList();
    this.vendorService.getVendorUpdateListener().subscribe(response => {
      this.vendorList = response;
    });
  }

  selectProductsByCategory(event: any) {
    const category_id = event.value;
    this.productListByCategory = this.productList.filter(x => x.product_category_id === category_id);
  }

  getAmount() {
    // tslint:disable-next-line:max-line-length
    const qty = this.purchaseDetailForm.value.quantity;
    const price = this.purchaseDetailForm.value.price;
    const discount = this.purchaseDetailForm.value.discount;
    this.purchaseAmount = (qty * price) - discount;

  }

  addPurchase() {
    console.log(this.purchaseDetailForm.value);
    const tempItem = this.purchaseDetailForm.value;
    let index = this.productList.findIndex(x => x.id === tempItem.product_id);
    tempItem.product = this.productList[index];
    index = this.unitList.findIndex(x => x.id === tempItem.unit_id);
    tempItem.unit = this.unitList[index];
    this.purchaseDetails.unshift(tempItem);
    this.transactionMaster = this.transactionMasterForm.value;
    this.transactionDetails = this.transactionDetailForm.value;

  }

  isCurrentTab(tab: number){
    return (tab === this.currentTab);
  }
  setCurrentTab(tab: number){
    this.currentTab =  tab;
  }
}
