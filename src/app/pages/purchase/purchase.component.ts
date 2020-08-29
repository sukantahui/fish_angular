import { Component, OnInit } from '@angular/core';
import {PurchaseService} from '../../services/purchase.service';
import {FormGroup} from '@angular/forms';
import {VendorService} from '../../services/vendor.service';
import {Vendor} from '../../models/vendor.model';
import {ProductCategory} from '../../models/productCategory.model';
import {Product} from '../../models/product.model';
import {Unit} from '../../models/unit.model';
import {ProductService} from '../../services/product.service';
import {PurchaseMaster} from '../../models/purchaseMaster.model';
import {TransactionMaster} from '../../models/transactionMaster.model';
import {TransactionDetail} from '../../models/transactionDetail.model';
import {StorageMap} from '@ngx-pwa/local-storage';



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
  transactionDetails: TransactionDetail[] = [];

  currentTab = 1;
  // tslint:disable-next-line:max-line-length
  constructor(private purchaseService: PurchaseService, private vendorService: VendorService, private productService: ProductService, private storage: StorageMap) { }

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
    // get purchaseDetails from localstorage
    this.storage.get('purchaseDetails').subscribe((purchaseDetails: PurchaseDetails[]) => {
      if (purchaseDetails){
        this.purchaseDetails = purchaseDetails;
      }else{
        this.purchaseDetails = [];
      }
    }, (error) => {
      this.purchaseDetails = [];
    });
    // get transactionMaster from localstorage
    this.storage.get('transactionMaster').subscribe((transactionMaster: TransactionMaster) => {
      if (transactionMaster){
        this.transactionMaster = transactionMaster;
        this.transactionMasterForm.setValue(this.transactionMaster);
      }else{
        // this.transactionMaster = [];
      }
    }, (error) => {
      // this.transactionMaster = [];
    });


// get transactionDetails from localstorage
    this.storage.get('transactionDetails').subscribe((transactionDetails: TransactionDetail[]) => {
      if (transactionDetails){
        this.transactionDetails = transactionDetails;
        this.transactionDetailForm.setValue(this.transactionDetails[0]);
      }else{
        this.transactionDetails = [];
      }
    }, (error) => {
      this.transactionDetails = [];
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
    const tempItem = this.purchaseDetailForm.value;
    let index = this.productList.findIndex(x => x.id === tempItem.product_id);
    tempItem.product = this.productList[index];
    index = this.unitList.findIndex(x => x.id === tempItem.unit_id);
    tempItem.unit = this.unitList[index];
    console.log(tempItem);
    this.purchaseDetails.unshift(tempItem);
    this.transactionMaster = this.transactionMasterForm.value;
    this.transactionDetails = this.transactionDetailForm.value;
    this.purchaseMaster = this.purchaseMasterForm.value;
    this.transactionDetails = [];
    this.transactionDetails.push(this.transactionDetailForm.value);
    this.transactionDetails.push(
      {
        id: null,
        transaction_master_id: null,
        transaction_type_id: 1,
        ledger_id: 3,
        amount: 0
      }
    );
    this.storage.set('purchaseDetails', this.purchaseDetails).subscribe(() => {});
    this.storage.set('transactionMaster', this.transactionMaster).subscribe(() => {});
    this.storage.set('transactionDetails', this.transactionDetails).subscribe(() => {});
    this.purchaseDetailForm.reset();
    this.purchaseDetailForm.patchValue({unit_id: 3});
  }
  isCurrentTab(tab: number){
    return (tab === this.currentTab);
  }
  setCurrentTab(tab: number){
    this.currentTab =  tab;
  }

  clearAll() {
    this.storage.clear().subscribe(() => {});
  }

  isValidPurchasedForm(){
    // tslint:disable-next-line:max-line-length
    if (this.purchaseMasterForm.valid && this.purchaseDetailForm.valid && this.transactionMasterForm.valid && this.purchaseDetailForm.valid){
      return true;
    }
    else{
      return false;
    }
  }
}
