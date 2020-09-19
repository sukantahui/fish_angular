import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {formatDate} from '@angular/common';
import {VendorService} from '../../services/vendor.service';
import {Vendor} from '../../models/vendor.model';
import {PaymentService} from '../../services/payment.service';
import Swal from 'sweetalert2';
import {TransactionMaster} from '../../models/transactionMaster.model';
import {TransactionDetail} from '../../models/transactionDetail.model';
import {Ledger} from '../../models/ledger.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  transactionMasterForm: FormGroup;
  transactionDetailForm: FormGroup;
  vendorList: Vendor[] = [];
  ledgerList: Ledger[] = [];
  transactionMaster: TransactionMaster;
  transactionDetails: TransactionDetail[] = [];
  paymentContainer: {tm: TransactionMaster, td: TransactionDetail[]};
  constructor(private vendorService: VendorService, private paymentService: PaymentService){ }

  ngOnInit(): void {
    this.vendorList = this.vendorService.getVendorList();
    this.vendorService.getVendorUpdateListener().subscribe(response => {
      this.vendorList = response;
    });
    this.ledgerList = this.paymentService.getLedgerList();
    console.log(this.ledgerList);
    this.paymentService.getLedgerUpdateListener().subscribe( response => {
      this.ledgerList = response;
    });
  }

  handleTransactionMasterDateChange($event: MatDatepickerInputEvent<unknown>) {
    let val = this.transactionMasterForm.value.transaction_date;
    val = formatDate(val, 'yyyy-MM-dd', 'en');
    this.transactionMasterForm.patchValue({transaction_date: val});
  }

  clearForm() {

  }

  savePayment() {
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
        this.paymentService.savePayment(this.transactionMaster, this.transactionDetails).subscribe(response => {
          if (response.success === 1){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Purchase saved',
              showConfirmButton: false,
              timer: 3000
            });
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
}
