


export class OrderMaster{
  id?: number;
  person_id?: number;
  customer_id: number;
  customer_name?: string;
  agent_name?: string;
  order_number?: string;
  agent_id: number;
  order_date: string;
  delivery_date: string;
  constructor() {
  }
}

// export class CustomerModel {
//   mobile1: string;
//   mobile2: string;
//   address1: string;
//   address2: string;
//   city: string;
//   state: string;
//   po: string;
//   area: string;
//   pin: string;
//   constructor(public id: number,
//               public person_name: string,
//               public email: string,
//               public customer_category_id: number
//   ) {}
// }

