import { InventoryService} from "../../services/inventory"
import {inject} from "aurelia-framework"

@inject(InventoryService)
export class Inventory {

  inventoryService: InventoryService;
  items = []

  constructor(inventory: InventoryService) {
    this.inventoryService = inventory;
  }

  async search(): Promise<void> {
    this.items = await this.inventoryService.getOrderInfo();
  }

  update(item){
    console.log(item)
    let val = true
    if(item.estado==1){
      item.estado ==0;
    }
    else{
      item.estado =1;
      val=false;
    }
     this.inventoryService.updateStatus(item);
    return val;
  }

}

