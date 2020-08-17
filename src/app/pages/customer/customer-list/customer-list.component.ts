import {Component, ElementRef, EventEmitter, OnInit, PipeTransform, ViewChild} from '@angular/core';
import {Customer} from '../../../models/customer.model';
import {CustomerService} from '../../../services/customer.service';
import {FormControl, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import {ExcelService} from '../../../services/excel.service';

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import {Observable} from 'rxjs';
import {SncakBarComponent} from '../../../common/sncak-bar/sncak-bar.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmationDialogService} from '../../../common/confirmation-dialog/confirmation-dialog.service';




@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  // tslint:disable-next-line:no-output-rename

  public searchTerm: string;
  public currentError: any;
  fileName = 'ExcelSheet.xlsx';
  customerData: Customer[];
  page: number;
  pageSize: number;
  filter = new FormControl('');
  p = 1;

  @ViewChild('htmlData') htmlData: ElementRef;
  constructor(public customerService: CustomerService,
              private excelService: ExcelService,
              private _snackBar: MatSnackBar,
              private confirmationDialogService: ConfirmationDialogService
  ) {
    this.page = 1;
    this.pageSize = 15;
  }
  printDivStyle = {
      table: {'border-collapse': 'collapse'},
      h1 : {color: 'red'},
      h2 : {border: 'solid 1px'},
      td: {border: '1px solid red', margin: '0px', padding: '3px'}
  };

  clickExport(): void {
    // this.excelService.exportAsExcelFile(this.data, 'sample');
  }

  ngOnInit(): void {

    this.customerData = this.customerService.getCustomers();
    this.customerService.getCustomerUpdateListener()
      .subscribe((customers: Customer[]) => {
        this.customerData = customers;
      });
  }
  customerDataToExcel(){
    this.excelService.simpleExportToExcel(this.customerData, 'Customers.xlsx');
  }

  public captureScreen() {
    // tslint:disable-next-line:prefer-const
    let data = document.getElementById('my-table');
    html2canvas(data).then(canvas => {
    // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }

  convert(){
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('My PDF Table', 20, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const headers = ['person_name', 'email', 'mobile1'];
    // you can use this following code instead of alasql, customerData has morefield but you can select some of them
    const selectedCustomer = this.customerData.map(({ person_name, email, mobile1 }) => ({ person_name, email, mobile1 }));
    // we can filter the array
    // selectedCustomer = selectedCustomer.filter((pilot) => pilot.email === 'feeney.anastasia@konopelski.com');

    console.log(selectedCustomer);
    (doc as any).autoTable({
    //  head: headers,
      body: selectedCustomer,
      theme: 'grid',
      didDrawCell: data => {
        console.log(data.column.index);
      }
    });

    // Open PDF document in new tab
    doc.output('dataurlnewwindow');

    // Download PDF document
    doc.save('table.pdf');
  }

  exportToExcelSpecial(){
    // tslint:disable-next-line:prefer-const
    let head = [
      {header: 'Customer', key: 'person_name', width: 80},
      {header: 'Email', key: 'email', width: 32},
      {header: 'Contact', key: 'mobile1', width: 15}
    ];
    this.excelService.exportToExcelSpecial(this.customerData, 'Customers', head);
  }

  exporttoExcel(){
    // tslint:disable-next-line:prefer-const
    let headers = {person_name : 'Customer Name', email: 'Email', mobile1: 'contact'};
    // const selectedCustomer = alasql('select person_name as Customer, email, mobile1 as Contact from ?', [this.customerData]);
    // tslint:disable-next-line:max-line-length
    // const selectedCustomer = this.customerData.map(({person_name as Customer, email, mobile1}) = > ({person_name as Customer, email, mobile1}));


    const selectedCustomer = this.customerData.map(({ person_name, email, mobile1 }) => ({ person_name, email, mobile1 }));
    this.excelService.exportAsExcelFile(selectedCustomer, 'testing');
  }
  // this function will fill the form using current customer record, update will be done from customerComponent's Update function
  populateFormByCurrentCustomer(customer: Customer) {
    this.customerService.fillFormByUpdatebaleData(customer);
  }

  public deleteCurrentCustomer(customer: Customer) {
      this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete customer ?')
      .then((confirmed) => {
        // deleting record if confirmed
        if (confirmed){
          this.customerService.deleteCustomer(customer.id).subscribe((response) => {
            if (response.success === 1){
              this._snackBar.openFromComponent(SncakBarComponent, {
                duration: 4000, data: {message: 'Customer Deleted'}
              });
            }
            this.currentError = null;
          }, (error) => {
            console.log('error occured ');
            console.log(error);
            this.currentError = error;
            this._snackBar.openFromComponent(SncakBarComponent, {
              duration: 4000, data: {message: error.message}
            });
          });
        }

      })
      .catch(() => {
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)');
      });
  }


}
