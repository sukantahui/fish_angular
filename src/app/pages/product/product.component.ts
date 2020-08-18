import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product.model';
import {FormControl, FormGroup} from '@angular/forms';
import {ProductCategoryService} from '../../services/product-category.service';
import {ProductCategory} from '../../models/productCategory.model';

import {Observable} from 'rxjs';
import {SncakBarComponent} from '../../common/sncak-bar/sncak-bar.component';
import {MatSnackBar} from '@angular/material/snack-bar';

import {ConfirmationDialogService} from '../../common/confirmation-dialog/confirmation-dialog.service';
import Swal from 'sweetalert2';
// https://sweetalert2.github.io/
// https://www.npmjs.com/package/sweetalert2


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  public searchTerm: string;
  public currentError: any;
  products: Product[] = [];
  productCategories: ProductCategory[] = [];
  productForm: FormGroup;
  isProductUpdateAble = false;
  // isProductSaveable = false;
  page: number;
  pageSize = 15;
  filter = new FormControl('');
  p = 1;
  // testing purpose......

  // tslint:disable-next-line:max-line-length
  constructor(private productService: ProductService,  private productCategoryService: ProductCategoryService, private  snackBar: MatSnackBar, private confirmationDialogService: ConfirmationDialogService) {

  }

  ngOnInit(): void {

    this.productForm = this.productService.productForm;
    this.products = this.productService.getProducts();
    this.productService.getProductUpdateListener().subscribe((responseProducts: Product[]) => {
      this.products = responseProducts;
    });

    this.productCategories = this.productCategoryService.getProductCategories();
    this.productCategoryService.getProductCategoryUpdateListener().subscribe((responseProductCategory: ProductCategory[]) => {
      this.productCategories = responseProductCategory;
    });
  }

  clearProductForm(){
    this.productForm.reset();
    this.isProductUpdateAble = false;
  }

  populateFormByCurrentProduct(product: Product){
    this.isProductUpdateAble = true;
    this.productService.fillFormByUpdatebaleData(product);
  }

  onSubmit(){

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to add this product',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Create It!'
    }).then((result) => {
      // if selected yes
      if (result.value) {
        this.productService.saveProduct(this.productForm.value).subscribe(response => {
          if (response.success === 1){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Product has been saved',
              showConfirmButton: false,
              timer: 1500
            });
          }
          // tslint:disable-next-line:no-unused-expression
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
            footer: '<a href>Why do I have this issue?</a>',
            timer: 0
          });
        });
      }
    });
  }

  updateProduct(){
    let updateObserable: Observable<any>;
    updateObserable = this.productService.updateProduct(this.productForm.value);
    updateObserable.subscribe((response) => {
      if (response.success === 1){
        this.snackBar.openFromComponent(SncakBarComponent, {
          duration: 4000, data: {message: 'Product Updated!'}
        });
      }
    }, (error) => {
      console.log('error occured ');
      console.log(error);
      this.snackBar.openFromComponent(SncakBarComponent, {
        duration: 4000, data: {message: error.message}
      });
    });
  }


  public deleteCurrentProduct(product: Product) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete customer ?')
      .then((confirmed) => {
        // deleting record if confirmed
        if (confirmed){
          this.productService.deleteProduct(product.id).subscribe((response) => {
            if (response.success === 1){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Product has been deleted',
                showConfirmButton: false,
                timer: 1500
              });
            }
            this.currentError = null;
          }, (error) => {

            Swal.fire({
              title: 'Are you sure?',
              text: error.message,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            });
            this.currentError = error;
          });
        }

      })
      .catch(() => {
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');
      });
  }

  testSwl() {

  }
}
