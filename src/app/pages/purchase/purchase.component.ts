import { Component, OnInit } from '@angular/core';
import {PurchaseService} from '../../services/purchase.service';
import {FormControl, FormGroup} from '@angular/forms';
import {VendorService} from '../../services/vendor.service';
import {Vendor} from '../../models/vendor.model';
import {ProductCategory} from "../../models/productCategory.model";
import {Product} from '../../models/product.model';
import {ProductService} from '../../services/product.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  purchaseMasterForm: FormGroup;
  transactionMaster: FormGroup;
  purchaseDetailForm: FormGroup;
  transactionDetail: FormGroup;
  vendorList: Vendor[] = [];
  productCategoryList: ProductCategory[] = [];
  productList: Product[] = [];
  productListByCategory: Product[] = [];
  constructor(private purchaseService: PurchaseService, private vendorService: VendorService, private prodcutService: ProductService) { }

  ngOnInit(): void {
    this.productCategoryList = this.purchaseService.getProductCategoryList();
    this.purchaseService.getProductCategoryUpdateListener().subscribe(response => {
        // console.log(response);
        this.productCategoryList = response;
    });
    this.productList = this.prodcutService.getProducts();
    this.prodcutService.getProductUpdateListener().subscribe(response => {
      this.productList = response;
    });
    this.purchaseMasterForm = this.purchaseService.purchaseMasterForm;
    this.purchaseDetailForm = this.purchaseService.purchaseDetailForm;
    this.transactionMaster = this.purchaseService.transactionMaster;
    this.transactionDetail = this.purchaseService.transactionDetail;
    this.vendorList = this.vendorService.getVendorList();
    this.vendorService.getVendorUpdateListener().subscribe(response => {
      this.vendorList = response;
    });

  }

  selectProductsByCategory(event: any) {
    const category_id = event.value;
    this.productListByCategory = this.productList.filter(xx => xx.product_category_id === category_id);
  }
}
