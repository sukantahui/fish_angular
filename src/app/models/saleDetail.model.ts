import {Product} from './product.model';
import {Unit} from './unit.model';


export class SaleDetail{
  id?: number;
  constructor(public sale_master_id: number, public product_id: number, public unit_id: number, public quantity: number,
              public price: number, public discount: number, public product: Product, public unit: Unit){

  }
}
