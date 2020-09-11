


export class TransactionMaster{
  id?: number;
  purchase_master_id?: number;
  sale_master_id?: number
  // tslint:disable-next-line:max-line-length
  constructor(public transaction_date: string, public transaction_number: string, public voucher_id: number, public employee_id: number){

  }
}
