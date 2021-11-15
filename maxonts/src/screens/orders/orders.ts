import {IInventoryItem, InventoryService} from "../../services/inventory"
import {inject} from "aurelia-framework"

@inject(InventoryService)
export class Inventory {

  inventoryService: InventoryService;
  items: IInventoryItem[] = []

  constructor(inventory: InventoryService) {
    this.inventoryService = inventory;
  }

  async search(): Promise<void> {
    this.items = await this.inventoryService.getOrderInfo();
  }



}

