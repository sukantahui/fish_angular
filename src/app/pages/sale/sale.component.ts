import { Component, OnInit } from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {formatDate} from '@angular/common';
import {FormControl, FormGroup} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {CustomerService} from '../../services/customer.service';
import {StorageMap} from '@ngx-pwa/local-storage';
import {SaleService} from '../../services/sale.service';
import {Product} from '../../models/product.model';
import {Unit} from '../../models/unit.model';
import {Customer} from '../../models/customer.model';
import {ProductCategory} from '../../models/productCategory.model';
import {ProductCategoryService} from '../../services/product-category.service';
import {SaleMaster} from '../../models/saleMaster.model';
import {SaleDetail} from '../../models/saleDetail.model';
import {TransactionMaster} from '../../models/transactionMaster.model';
import {TransactionDetail} from '../../models/transactionDetail.model';
import Swal from 'sweetalert2';
import {SaleVoucher} from '../../models/saleVoucher.model';
import {SaleTransactionDetail} from '../../models/saleTransactionDetail';
import {PurchaseDetail} from '../../models/purchaseDetail.model';

export interface SaleContainer{
  saleMaster: SaleMaster;
  saleDetails: SaleDetail[];
  transactionMaster: TransactionMaster;
  transactionDetails: TransactionDetail[];
  totalSaleAmount: number;
}


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
  public productListByCategory: Product[] = [];
  public currentTab = 1;
  // tslint:disable-next-line:max-line-length
  public saleAmount = 0;
  // tslint:disable-next-line:max-line-length
  public editableItemIndex = -1;
  // tslint:disable-next-line:max-line-length
  public saleMaster: SaleMaster;
    // tslint:disable-next-line:max-line-length
  public transactionMaster: TransactionMaster;
  // tslint:disable-next-line:max-line-length
  public transactionDetails: TransactionDetail[] = [];
  // tslint:disable-next-line:max-line-length
  public totalSaleAmount = 0;
  public addDiscount = 0;
  public saleDetails: SaleDetail[] = [];
  // tslint:disable-next-line:max-line-length
  public saleContainer: SaleContainer;
  // tslint:disable-next-line:max-line-length
  public defaultValues: any;
  private finalBillAmount = 0;
  public saleVouchers: SaleVoucher[] = [];
  public myAngularxQrCode = 'India is great';
  public showBillDiv = false;
  saleTransactionDetail: SaleTransactionDetail;
  // tslint:disable-next-line:max-line-length
  public editableSaleItemIndex: number;
  public leftDiv = 55;
  public rightDiv = 45;
  public countItem = 1;
  constructor(private saleService: SaleService, private customerService: CustomerService, private productService: ProductService, private storage: StorageMap , private productCategoryService: ProductCategoryService) { }

  ngOnInit(): void {

    this.temporaryForm = new FormGroup({
      product_category_id: new FormControl(null)
    });
    this.productCategoryList = this.productCategoryService.getProductCategories();
    this.productCategoryService.getProductCategoryUpdateListener().subscribe(response => {
      this.productCategoryList = response;
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
    // get saleMaster from storageMap
    this.storage.get('saleContainer').subscribe((saleContainer: SaleContainer) => {
      if (saleContainer){
        this.saleContainer = saleContainer;
        this.saleMaster = this.saleContainer.saleMaster;
        this.saleDetails = this.saleContainer.saleDetails;
        this.transactionMaster = this.saleContainer.transactionMaster;
        this.transactionDetails = this.saleContainer.transactionDetails;
        this.totalSaleAmount = this.saleContainer.totalSaleAmount;

        this.transactionDetailForm.reset(this.saleContainer.transactionDetails[0]);
      }else{
        this.saleDetails = [];
        this.transactionDetails = [];
      }
    }, (error) => {});
    this.defaultValues = {
      saleMasterForm : this.saleService.saleMasterForm.value,
      saleDetailsForm : this.saleService.saleDetailForm.value,
      transactionMasterForm : this.saleService.transactionMasterForm.value,
      transactionDetailsForm : this.saleService.transactionDetailForm.value,
      temporaryForm: this.temporaryForm.value
    };

    this.saleVouchers = this.saleService.getSaleVoucherList();
    this.saleService.getSaleVoucherUpdateListener().subscribe((response: SaleVoucher[]) => {
        this.saleVouchers = response;
    });
    this.saleService.getSaleDetailsByTransactionUpdateListener().subscribe((response: SaleTransactionDetail) => {
      this.saleTransactionDetail = response;
      // this.currentTab = 3;
      this.showBillDiv = true;
    });

  }// end of ngOnIt
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
    if (this.currentTab === 1){
      this.leftDiv = 45;
    }else if (this.currentTab === 2){
      this.leftDiv = 55;
    }
    this.rightDiv = 100 - this.leftDiv;
  }
  getNumberToWords(num: number){
    const converter = require('number-to-words');
    return converter.toWords(num);
  }
  getAmount() {
   // tslint:disable-next-line:max-line-length
    const qty = this.saleDetailForm.value.quantity;
    const price = this.saleDetailForm.value.price;
    const discount = this.saleDetailForm.value.discount;
    this.saleAmount = (qty * price) - discount;
   }
    addSale() {
    if (this.currentTab !== 1){
      this.currentTab = 1;
    }
    const tempItem = this.saleDetailForm.value;
    let index = this.productList.findIndex(x => x.id === tempItem.product_id);
    tempItem.product = this.productList[index];
    index = this.unitList.findIndex(x => x.id === tempItem.unit_id);
    tempItem.unit = this.unitList[index];
    if (this.editableItemIndex === -1){
      this.saleDetails.push(tempItem);
    }else{
      this.saleDetails[this.editableItemIndex] = tempItem;
      this.editableItemIndex = -1;
    }
    this.totalSaleAmount = this.saleDetails.reduce( (total, record) => {
      // @ts-ignore
      return total + ((record.price * record.quantity) - record.discount);
    }, 0);
    const round =  Math.round(this.totalSaleAmount) - this.totalSaleAmount;
    this.saleMasterForm.patchValue({round_off: parseFloat(round.toFixed(2))});
    this.saleMaster = this.saleMasterForm.value;
    this.transactionMaster = this.transactionMasterForm.value;
    this.finalBillAmount = parseFloat((this.totalSaleAmount - this.saleMaster.discount + this.saleMaster.round_off).toFixed(2));
    this.transactionDetailForm.patchValue({amount: this.finalBillAmount});
    this.transactionDetails = [];
    this.transactionDetails.push(this.transactionDetailForm.value);
    this.transactionDetails.push(
      {
        id: null,
        transaction_master_id: null,
        transaction_type_id: 2,
        ledger_id: 4,
        amount: this.finalBillAmount
      });
    // tslint:disable-next-line:max-line-length
    this.saleContainer = {saleMaster: this.saleMaster, saleDetails: this.saleDetails, transactionMaster: this.transactionMaster,
      transactionDetails: this.transactionDetails, totalSaleAmount: this.totalSaleAmount};
    this.storage.set('saleContainer', this.saleContainer).subscribe(() => {});
    this.clearForm();
    this.editableItemIndex = -1;
  }

  isValidSaleForm() {
    if (this.saleMasterForm.valid && this.saleDetailForm.valid && this.transactionMasterForm && this.transactionDetailForm){
      return true;
    }
    return false;
  }

  clearForm() {
    // this.storage.delete('saleContainer').subscribe(() => {});
    this.saleDetailForm.reset(this.defaultValues.saleDetailsForm);
    this.temporaryForm.reset(this.defaultValues.temporaryForm);
    this.saleAmount = 0;
  }

  getBackgroundColor(indexOfElement: number) {

  }

  cancelEditCurrentItem(item: SaleDetail) {

  }
  editCurrentItem(item: SaleDetail) {
    console.log('Items', item);
    this.editableSaleItemIndex = this.saleDetails.findIndex(x => x === item);
    console.log('Index', this.editableSaleItemIndex);
    this.editableItemIndex = this.editableSaleItemIndex;
    this.saleDetailForm.setValue({id: item.id, sale_master_id: item. sale_master_id,
    product_id: item.product_id , unit_id: item.unit_id, quantity: item.quantity, price: item.price, discount: item.discount});
    this.temporaryForm.setValue({product_category_id: item.product.product_category_id});
    this.productListByCategory = this.productList.filter(x => x.product_category_id === item.product.product_category_id);
    this.getAmount();
  }

  deleteCurrentItem(item: SaleDetail) {
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
        // tslint:disable-next-line:triple-equals
        let index = this.saleDetails.findIndex(x => x === item);
        this.saleDetails.splice(index, 1);
        this.storage.get('saleContainer').subscribe((saleContainer: SaleContainer) => {
          if (saleContainer){
            this.saleContainer = saleContainer;
            this.saleMaster = this.saleContainer.saleMaster;
            index = this.saleContainer.saleDetails.findIndex(x => x.product_id === item.product_id && x.quantity === item.quantity);
            this.totalSaleAmount = this.saleDetails.reduce( (total, record) => {
              return total + (record.price * record.quantity - record.discount);
            }, 0);
            const round =  Math.round(this.totalSaleAmount) - this.totalSaleAmount;
            this.saleMasterForm.patchValue({round_off : parseFloat(round.toFixed(2))});
            this.saleMaster.discount = this.saleMasterForm.value.discount;
            this.finalBillAmount = (this.totalSaleAmount - this.saleMaster.discount + this.saleMaster.round_off);
            this.transactionDetails[1].amount = this.finalBillAmount;
            this.transactionDetails[0].amount = this.finalBillAmount;
            this.transactionDetailForm.reset(this.transactionDetails[0]);
            this.saleContainer.transactionDetails = this.transactionDetails;
            this.storage.set('saleContainer', this.saleContainer).subscribe(() => {});
            this.transactionDetailForm.patchValue({amount: this.finalBillAmount});
            this.saleMaster = this.saleMasterForm.value;
            this.saleContainer.saleMaster = this.saleMaster;
            this.saleContainer.totalSaleAmount = this.totalSaleAmount;
            this.saleContainer.saleDetails.splice(index, 1);
            this.storage.set('saleContainer', this.saleContainer).subscribe(() => {});
          }
        }, (error) => {});
      }else{
        console.log('Item will not be deleted');
      }
    });
  }

  saveSale() {
    // sale will be saved from here
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
        this.saleMaster = this.saleMasterForm.value;
        // tslint:disable-next-line:max-line-length
        this.saleService.saveSale(this.saleMaster, this.saleDetails, this.transactionMaster, this.transactionDetails).subscribe(response => {
          if (response.success === 1){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Sale saved',
              showConfirmButton: false,
              timer: 3000
            });
            this.currentTab = 2;
            this.storage.delete('saleContainer').subscribe(() => {});
            this.saleDetails = [];
            this.transactionDetails = [];
            this.totalSaleAmount = 0;
            this.saleAmount = 0;
            this.saleMaster.round_off = 0;
            this.saleMasterForm.reset(this.defaultValues.saleMasterForm);
            this.saleDetailForm.reset(this.defaultValues.saleDetailsForm);
            this.transactionMasterForm.reset(this.defaultValues.transactionMasterForm);
            this.transactionDetailForm.reset(this.defaultValues.transactionDetailsForm);
            this.temporaryForm.reset();
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

  addDiscountInStorage() {
    this.saleMaster.discount = this.saleMasterForm.value.discount;
    this.finalBillAmount = parseFloat((this.totalSaleAmount - this.saleMaster.discount + this.saleMaster.round_off).toFixed(2));
    this.transactionDetails[1].amount = this.finalBillAmount;
    this.transactionDetails[0].amount = this.finalBillAmount;
    this.storage.get('saleContainer').subscribe((saleContainer: SaleContainer) => {
      if (saleContainer){
         this.saleContainer.saleMaster.discount = this.saleMaster.discount;
      }
    }, (error) => {});

  }

    cancelSaleDetails() {
      Swal.fire({
        title: 'Confirmation',
        text: 'Do you sure to delete all entry?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete all!'
      }).then((result) => {
        if (result.value) {
          this.storage.delete('saleContainer').subscribe(() => {
          });
          this.transactionMaster = null;
          this.transactionDetails = [];
          this.saleMaster = null;
          this.saleDetails = [];
          this.saleContainer = null;
          this.transactionMasterForm.reset(this.defaultValues.transactionMasterForm);
          this.transactionDetailForm.reset(this.defaultValues.transactionMasterForm);
          this.saleContainer = null;
          this.totalSaleAmount = 0;
        }
      });
    }



  numSequence(n: number): Array<number> {
    return Array(n);
  }

  addItemIntoContainer(){
    const tempItem = this.saleDetailForm.value;
    let index = this.productList.findIndex(x => x.id === tempItem.product_id);
    tempItem.product = this.productList[index];
    index = this.unitList.findIndex(x => x.id === tempItem.unit_id);
    tempItem.unit = this.unitList[index];
    if (this.editableItemIndex === -1){
      this.saleDetails.push(tempItem);
    }else{
      this.saleDetails[this.editableItemIndex] = tempItem;
      this.editableItemIndex = -1;
    }
    this.totalSaleAmount = this.saleDetails.reduce( (total, record) => {
      // @ts-ignore
      return total + ((record.price * record.quantity) - record.discount);
    }, 0);
    const round =  Math.round(this.totalSaleAmount) - this.totalSaleAmount;
    this.saleMasterForm.patchValue({round_off: parseFloat(round.toFixed(2))});
    this.saleMaster = this.saleMasterForm.value;
    this.transactionMaster = this.transactionMasterForm.value;
    this.finalBillAmount = parseFloat((this.totalSaleAmount - this.saleMaster.discount + this.saleMaster.round_off).toFixed(2));
    this.transactionDetailForm.patchValue({amount: this.finalBillAmount});
    this.transactionDetails = [];
    this.transactionDetails.push(this.transactionDetailForm.value);
    this.transactionDetails.push(
      {
        id: null,
        transaction_master_id: null,
        transaction_type_id: 2,
        ledger_id: 4,
        amount: this.finalBillAmount
      });
    // tslint:disable-next-line:max-line-length
    this.saleContainer = {saleMaster: this.saleMaster, saleDetails: this.saleDetails, transactionMaster: this.transactionMaster,
      transactionDetails: this.transactionDetails, totalSaleAmount: this.totalSaleAmount};
    this.storage.set('saleContainer', this.saleContainer).subscribe(() => {});
    this.clearForm();
    this.editableItemIndex = -1;
  }
}
