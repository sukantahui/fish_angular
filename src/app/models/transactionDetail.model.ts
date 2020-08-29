


export class TransactionDetail{
  id?: number;
  constructor(public transaction_master_id: number, public transaction_type_id: number, public ledger_id: number, public amount: number){

  }
}
