import {TransactionDetail} from './transactionDetail.model';


export class PurchaseTransactionDetail{
  id?: number;
  transaction_date: string;
  transaction_number: string;
  voucher_id: number;
  purchase_master_id: number;
  sale_master_id?: number;
  employee_id: number;
  transaction_details: any;
  purchase_master: {
    id: number;
    discount: number;
    round_off: number;
    loading_n_unloading_expenditure: number;
    comment: string;
    purchase_details: any;
  };
}
