


export class Unit{
  id?: number;
  constructor(public unit_name: string, public formal_name: string, public parent_id: number, public parent_conversion: number,
              public position: number, public active: number){

  }
}

