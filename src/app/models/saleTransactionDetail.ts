export class SaleTransactionDetail{
  sale_master: {
    transaction_date: string,
    transaction_number: string,
    bill_total: number,
    ledger_name: string,
    billing_name: string,
    email: string,
    mobile1: string,
    mobile2: string,
    address1: string,
    address2: string,
    po: string,
    area: string,
    city: string,
    state: string,
    pin: string                                      ,
    discount: number,
    round_off: number,
    loading_n_unloading_expenditure: number
  };
  sale_details: {
    product_code: string,
    product_name: string,
    unit_name: string,
    formal_name: string
    quantity: number,
    price: number,
    discount: number,
    total: number
  }[];
}
