


export class Vendor{
  ledger_group_id: number;
  billing_name: string;
  email: string;
  mobile1: string;
  mobile2: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  po: string;
  area: string;
  pin: string;
  opening_balance: number;
  transaction_type_id: number;
  constructor(public id: number, public ledger_name: string) {
   this.ledger_group_id = 15;
  }
}
