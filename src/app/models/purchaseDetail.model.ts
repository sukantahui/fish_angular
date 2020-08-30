import {Product} from './product.model';
import {Unit} from './unit.model';


export class PurchaseDetail{
  id?: number;
  constructor(public purchase_master_id: number, public product_id: number, public unit_id: number, public quantity: number,
              public price: number, public discount: number, public product: Product, public unit: Unit){

  }
}
