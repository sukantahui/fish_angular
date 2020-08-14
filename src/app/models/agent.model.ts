


export class Agent{
  person_type_id: number;
  mobile1: string;
  mobile2: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  po: string;
  area: string;
  pin: string;
  constructor(public id: number, public person_name: string, public email: string, public customer_category_id: number) {
      this.person_type_id = 7;
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

