export class PurchaseVoucher {
  'id': number;
  'transaction_date': string;
  'transaction_number': string;
  'voucher_id': number;
  'purchase_master_id': number;
  'sale_master_id': number;
  'employee_id': number;
  // tslint:disable-next-line:max-line-length
  'transaction_details': {'id': number; 'transaction_master_id': number; 'transaction_type_id': number, 'ledger_id': number, 'amount': number; 'ledger': object}[];
}
