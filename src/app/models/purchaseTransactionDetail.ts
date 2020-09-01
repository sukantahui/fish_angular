


export class PurchaseTransactionDetail{
  id?: number;
  transaction_date: string;
  transaction_number: string;
  voucher_id: number;
  purchase_master_id: number;
  sale_master_id?: number;
  employee_id: number;
  credit_transaction_details: {
    id?: number;
    transaction_master_id: number;
    transaction_type_id: number;
    ledger_id: number;
    amount: number;
    ledger: {id?: number; ledger_name: string; billing_name: string; ledger_group_id: number; customer_category_id: number;
      email: string; mobile1?: string; mobile2?: string; branch?: string; account_number?: string; ifsc?: string;
      address1?: string; address2?: string; state?: string; po?: string; area?: string; city?: string; pin?: string;
      opening_balance: number; transaction_type_id: number;
      ledger_group: {id: number; group_name: string; }
    };
    transaction_type: {id: number; transaction_name: string; formal_name: string; transaction_type_value: number};
  }[];
  purchase_master: {
    id: number;
    discount: number;
    round_off: number;
    loading_n_unloading_expenditure: number;
    comment: string;
    purchase_details: {id: number; purchase_master_id: number; product_id: number; unit_id: number;
                  quantity: number; price: number; discount: number}[];
  };
}
