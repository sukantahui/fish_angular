import { Component, OnInit } from '@angular/core';
import {PurchaseService} from '../../services/purchase.service';
import {FormControl, FormGroup} from '@angular/forms';
import {VendorService} from '../../services/vendor.service';
import {Vendor} from '../../models/vendor.model';
import {ProductCategory} from '../../models/productCategory.model';
import {Product} from '../../models/product.model';
import {Unit} from '../../models/unit.model';
import {ProductService} from '../../services/product.service';
import {PurchaseMaster} from '../../models/purchaseMaster.model';
import {PurchaseDetail} from '../../models/purchaseDetail.model';
import {TransactionMaster} from '../../models/transactionMaster.model';
import {TransactionDetail} from '../../models/transactionDetail.model';
import {StorageMap} from '@ngx-pwa/local-storage';
import Swal from 'sweetalert2';
import {formatDate} from '@angular/common';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';



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
  purchaseDetails: PurchaseDetail[] = [];
  transactionMaster: TransactionMaster;
  transactionDetails: TransactionDetail[] = [];
  color = 'accent';

  currentTab = 1;
  public totalPurchaseAmount = 0;

  // tslint:disable-next-line:max-line-length
  public temporaryForm: FormGroup;
  isDiscountEnabled = false;
  // tslint:disable-next-line:max-line-length
  constructor(private purchaseService: PurchaseService, private vendorService: VendorService, private productService: ProductService, private storage: StorageMap) { }

  ngOnInit(): void {
    this.temporaryForm = new FormGroup({
      product_category_id: new FormControl(null)
    });
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
    // get purchaseMaster from localstorage
    this.storage.get('purchaseMaster').subscribe((purchaseMaster: PurchaseMaster) => {
      if (purchaseMaster){
        this.purchaseMaster = purchaseMaster;
      }
    }, (error) => {this.purchaseDetails = [];});
    // get purchaseDetails from localstorage
    this.storage.get('purchaseDetails').subscribe((purchaseDetails: PurchaseDetail[]) => {
      if (purchaseDetails){
        this.purchaseDetails = purchaseDetails;
      }else{
        this.purchaseDetails = [];
      }
    }, (error) => {this.purchaseDetails = []; });
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
    // get  totalPurchaseAmount
    this.storage.get('totalPurchaseAmount').subscribe((totalPurchaseAmount: number) => {
      if (totalPurchaseAmount){
        this.totalPurchaseAmount = totalPurchaseAmount;
      }else{
        this.totalPurchaseAmount = 0;
      }
    }, (error) => {
      this.totalPurchaseAmount = 0;
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
    this.purchaseDetails.push(tempItem);
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
    this.storage.set('purchaseMaster', this.purchaseMaster).subscribe(() => {});
    this.storage.set('purchaseDetails', this.purchaseDetails).subscribe(() => {});
    this.storage.set('transactionMaster', this.transactionMaster).subscribe(() => {});
    this.storage.set('transactionDetails', this.transactionDetails).subscribe(() => {});
    this.purchaseDetailForm.reset();
    this.purchaseDetailForm.patchValue({unit_id: 3, discount: 0});
    this.temporaryForm.reset();
    this.productListByCategory = [];
    this.purchaseAmount = 0;


    this.totalPurchaseAmount = this.purchaseDetails.reduce( (total, record) => {
      return total + (record.price * record.quantity - record.discount);
    }, 0);
    this.storage.set('totalPurchaseAmount', this.totalPurchaseAmount).subscribe(() => {});

    // Changing current tab
    this.currentTab = 1;
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

  changePurchaseSlide() {
    // tslint:disable-next-line:triple-equals
    if (this.currentTab == 1){
      this.currentTab = 2;
    }else{
      this.currentTab = 1;
    }
  }


  deleteCurrentItem(item: PurchaseDetail) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to delete ' + item.product.product_name,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete It!'
    }).then((result) => {
      // if selected yes
      if (result.value) {
        console.log('Item will be deleted');
        // tslint:disable-next-line:triple-equals
        const index = this.purchaseDetails.findIndex(x => x === item);
        this.purchaseDetails.splice(index, 1);
        this.storage.set('purchaseDetails', this.purchaseDetails).subscribe(() => {});
        this.totalPurchaseAmount = this.purchaseDetails.reduce( (total, record) => {
          return total + (record.price * record.quantity - record.discount);
        }, 0);
        this.storage.set('totalPurchaseAmount', this.totalPurchaseAmount).subscribe(() => {});
      }else{
        console.log('Item will not be deleted');
      }
    });
  }

  savePurchase() {
    // purchase will be saved from here
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to Save',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save It!'
    }).then((result) => {
      // if selected yes
      if (result.value) {
        // will be saved from here
        // tslint:disable-next-line:max-line-length
        this.purchaseService.savePurchase(this.purchaseMaster, this.purchaseDetails, this.transactionMaster, this.transactionDetails).subscribe(response => {
          if (response.success === 1){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Purchase saved',
              showConfirmButton: false,
              timer: 3000
            });
            this.storage.clear().subscribe(() => {});
            this.purchaseDetails = [];
            this.totalPurchaseAmount = 0;
            this.currentTab = 2;
          }
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
            footer: '<a href>Why do I have this issue?</a>',
            timer: 0
          });
        });
      }else{
        // will not be saved
      }
    });
  }

  getSQLDate(myDate: Date){
    return myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate();
  }

  handleTransactionMasterDateChange($event: MatDatepickerInputEvent<unknown>) {
    let val = this.transactionMasterForm.value.transaction_date;
    val = formatDate(val, 'yyyy-MM-dd', 'en');
    this.transactionMasterForm.patchValue({transaction_date: val});
  }

  editCurrentItem(item: PurchaseDetail) {
    console.log(item);
    this.purchaseDetailForm.setValue({id: item.id, purchase_master_id: item.purchase_master_id,
      product_id: item.product_id , unit_id: item.unit_id, quantity: item.quantity, price: item.price, discount: item.discount});
    this.temporaryForm.setValue({product_category_id: item.product.product_category_id});
    this.productListByCategory = this.productList.filter(x => x.product_category_id === item.product.product_category_id);
  }
}
