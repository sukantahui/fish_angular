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
import {PurchaseTransactionDetail} from '../../models/purchaseTransactionDetail';




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
  purchaseTransactionDetail: PurchaseTransactionDetail;
  // tslint:disable-next-line:max-line-length
  purchaseContainer: {tm: TransactionMaster, td: TransactionDetail[], pm: PurchaseMaster, pd: PurchaseDetail[], currentPurchaseTotal: number, roundOffValue: number};
  color = 'accent';


  currentTab = 1;
  public totalPurchaseAmount = 0;

  // tslint:disable-next-line:max-line-length
  public temporaryForm: FormGroup;
  isDiscountEnabled = false;
  // tslint:disable-next-line:max-line-length
  public editableItemIndex = -1;
  // tslint:disable-next-line:max-line-length
  // private defaultValues: {transactionMasterForm: any, transactionDetailsForm: any, purchaseMasterForm: any, purchaseDetailsForm: any};
  private defaultValues: any;
  public myAngularxQrCode = 'India is great';

  printDivStyle = {
    table: {'border-collapse': 'collapse'},
    h1 : {color: 'red'},
    h2 : {border: 'solid 1px'},
    td: {border: '1px solid red', margin: '0px', padding: '3px'}
  };

  // tslint:disable-next-line:max-line-length
  constructor(private purchaseService: PurchaseService, private vendorService: VendorService, private productService: ProductService, private storage: StorageMap) { }

  ngOnInit(): void {
    // tslint:disable-next-line:prefer-const
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
    // getting purchase transaction details as object
    this.purchaseService.getPurchaseTransactionDetailObjectListener().subscribe(response => {
      this.purchaseTransactionDetail = response;
      this.currentTab = 3;
    });
    this.purchaseMasterForm = this.purchaseService.purchaseMasterForm;
    this.purchaseDetailForm = this.purchaseService.purchaseDetailForm;
    this.transactionMasterForm = this.purchaseService.transactionMasterForm;
    this.transactionDetailForm = this.purchaseService.transactionDetailForm;

    this.defaultValues = {
      transactionMasterForm: this.purchaseService.transactionMasterForm.value,
      transactionDetailsForm: this.purchaseService.transactionDetailForm.value,
      purchaseMasterForm: this.purchaseService.purchaseMasterForm.value,
      purchaseDetailsForm: this.purchaseService.purchaseDetailForm.value,
    };

    this.vendorList = this.vendorService.getVendorList();
    this.vendorService.getVendorUpdateListener().subscribe(response => {
      this.vendorList = response;
    });
    // get purchaseMaster from localstorage
    this.storage.get('purchaseContainer').subscribe((purchaseContainer: any) => {
      if (purchaseContainer){
        this.purchaseContainer = purchaseContainer;
        this.purchaseMaster = purchaseContainer.pm;
        this.purchaseDetails = purchaseContainer.pd;
        this.transactionMaster = purchaseContainer.tm;
        this.transactionDetails = purchaseContainer.td;

        this.transactionMasterForm.setValue(purchaseContainer.tm);
        this.transactionDetailForm.setValue(purchaseContainer.td[0]);
        this.purchaseMasterForm.setValue(purchaseContainer.pm);
        this.purchaseDetailForm.setValue(purchaseContainer.pd);
      }
    }, (error) => {});
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

    if (this.editableItemIndex === -1){
      this.purchaseDetails.push(tempItem);
    }else{
      this.purchaseDetails[this.editableItemIndex] = tempItem;
      this.editableItemIndex = -1;
    }

    this.transactionMaster = this.transactionMasterForm.value;
    this.transactionDetails = this.transactionDetailForm.value;

    let currentPurchaseTotal = this.purchaseDetails.reduce( (total, record) => {
      // @ts-ignore
      return total + ((record.price * record.quantity) - record.discount);
    }, 0);
    currentPurchaseTotal = parseFloat(currentPurchaseTotal.toFixed(2));

    const round =  Math.round(currentPurchaseTotal) - currentPurchaseTotal;
    const roundOffValue = parseFloat(round.toFixed(2));
    this.purchaseMasterForm.patchValue({round_off: roundOffValue});
    this.purchaseMaster = this.purchaseMasterForm.value;
    this.transactionDetails = [];
    this.transactionDetailForm.patchValue({amount: currentPurchaseTotal - roundOffValue});
    this.transactionDetails.push(this.transactionDetailForm.value);
    this.transactionDetails.push(
      {
        id: null,
        transaction_master_id: null,
        transaction_type_id: 1,
        ledger_id: 3,
        amount: currentPurchaseTotal - roundOffValue
      }
    );


    this.purchaseContainer = {
      tm: this.transactionMaster,
      td: this.transactionDetails,
      pm: this.purchaseMaster,
      pd: this.purchaseDetails,
      currentPurchaseTotal,
      roundOffValue,
    };


    // this.storage.set('purchaseMaster', this.purchaseMaster).subscribe(() => {});
    // this.storage.set('purchaseDetails', this.purchaseDetails).subscribe(() => {});
    // this.storage.set('transactionMaster', this.transactionMaster).subscribe(() => {});
    // this.storage.set('transactionDetails', this.transactionDetails).subscribe(() => {});

    this.storage.set('purchaseContainer', this.purchaseContainer).subscribe(() => {});

    this.purchaseDetailForm.reset();
    this.purchaseDetailForm.patchValue({unit_id: 3, discount: 0});
    this.temporaryForm.reset();
    this.productListByCategory = [];
    this.purchaseAmount = 0;



    this.storage.set('totalPurchaseAmount', this.totalPurchaseAmount).subscribe(() => {});

    // Changing current tab
    this.currentTab = 1;
    this.editableItemIndex = -1;
  }
  isCurrentTab(tab: number){
    return (tab === this.currentTab);
  }
  setCurrentTab(tab: number){
    this.currentTab =  tab;
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
        this.purchaseMaster = this.purchaseMasterForm.value;
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
            this.purchaseMasterForm.reset(this.defaultValues.purchaseMasterForm);
            this.purchaseDetailForm.reset(this.defaultValues.purchaseDetailsForm);
            this.transactionMasterForm.reset(this.defaultValues.transactionMasterForm);
            this.transactionDetailForm.reset(this.defaultValues.transactionDetailsForm);
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
    this.editableItemIndex = this.purchaseDetails.findIndex(x => x === item);
    this.purchaseDetailForm.setValue({id: item.id, purchase_master_id: item.purchase_master_id,
      product_id: item.product_id , unit_id: item.unit_id, quantity: item.quantity, price: item.price, discount: item.discount});
    this.temporaryForm.setValue({product_category_id: item.product.product_category_id});
    this.productListByCategory = this.productList.filter(x => x.product_category_id === item.product.product_category_id);
    this.getAmount();
  }

  getBackgroundColor(index: number) {
    // tslint:disable-next-line:triple-equals
    if (index == this.editableItemIndex){
      return {
        'background-color': 'rgba(200,200,200,.6)',
        color: 'seashell'
      };
    }
  }

  clearForm() {
    this.purchaseMasterForm.reset(this.defaultValues.purchaseMasterForm);
    this.purchaseDetailForm.reset(this.defaultValues.purchaseDetailsForm);
    // this.transactionMasterForm.reset(this.defaultValues.transactionMasterForm);
    // this.transactionDetailForm.reset(this.defaultValues.transactionDetailsForm);
    this.purchaseAmount = 0;
    this.editableItemIndex = -1;
  }

  cancelEditCurrentItem(item: PurchaseDetail) {
    this.editableItemIndex = -1;
    this.clearForm();
  }

  getNumberToWords(num: number){
    const converter = require('number-to-words');
    return converter.toWords(num);
  }

  cancelPurchaseDetails() {
    this.storage.delete('purchaseContainer').subscribe(() => {});
    this.transactionMaster = null;
    this.transactionDetails = [];
    this.purchaseMaster = null;
    this.purchaseDetails = [];
    this.purchaseContainer = null;
    this.transactionMasterForm.reset(this.defaultValues.transactionMasterForm);
    this.transactionDetailForm.reset(this.defaultValues.transactionMasterForm);
    this.purchaseContainer = null;

    this.totalPurchaseAmount = 0;
  }
  editPurchase() {
    this.currentTab = 1;
    this.purchaseMaster = {
      id: this.purchaseTransactionDetail.purchase_master_id,
      discount: this.purchaseTransactionDetail.purchase_master.discount,
      round_off: this.purchaseTransactionDetail.purchase_master.round_off,
      loading_n_unloading_expenditure: this.purchaseTransactionDetail.purchase_master.loading_n_unloading_expenditure,
      comment: this.purchaseTransactionDetail.purchase_master.comment
    };
    this.purchaseMasterForm.setValue(this.purchaseMaster);
    this.transactionMaster = {
      id: this.purchaseTransactionDetail.id,
      transaction_date: this.purchaseTransactionDetail.transaction_date,
      transaction_number: this.purchaseTransactionDetail.transaction_number,
      voucher_id: 2,
      employee_id: this.purchaseTransactionDetail.employee_id,
    };
    this.transactionMasterForm.setValue(this.transactionMaster);
    this.transactionDetails = [];
    const tempTransactionDetail = {
      id: this.purchaseTransactionDetail.credit_transaction_details[0].id,
      transaction_master_id: this.purchaseTransactionDetail.credit_transaction_details[0].transaction_master_id,
      transaction_type_id: this.purchaseTransactionDetail.credit_transaction_details[0].transaction_type_id,
      ledger_id: this.purchaseTransactionDetail.credit_transaction_details[0].ledger_id,
      amount: 0
    };
    this.transactionDetails.push(tempTransactionDetail);
    this.transactionDetailForm.setValue(tempTransactionDetail);
    this.purchaseDetails = this.purchaseTransactionDetail.purchase_master.purchase_details;

    let currentPurchaseTotal = this.purchaseDetails.reduce( (total, record) => {
      // @ts-ignore
      return total + ((record.price * record.quantity) - record.discount);
    }, 0);
    currentPurchaseTotal = parseFloat(currentPurchaseTotal.toFixed(2));

    const round =  Math.round(currentPurchaseTotal) - currentPurchaseTotal;
    const roundOffValue = parseFloat(round.toFixed(2));

    this.purchaseContainer = {
      tm: this.transactionMaster,
      td: this.transactionDetails,
      pm: this.purchaseMaster,
      pd: this.purchaseDetails,
      currentPurchaseTotal,
      roundOffValue,
    };

  }

  updatePurchase() {
    console.log('purchase will be updated');
  }
}
