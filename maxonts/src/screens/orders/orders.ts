import { InventoryService} from "../../services/inventory"
import {inject} from "aurelia-framework"
import { SearchService } from "services/search";

const searchTemplate = {
  idParte: {
    evaluator: (expected) => (current: string) => current.includes(expected)
  }
}

@inject(InventoryService, SearchService)
export class Inventory {

  inventoryService: InventoryService;
  searchService: SearchService;
  items = []
  rawItems = []
  filter: Function
  query: {}
  constructor(inventory: InventoryService, search: SearchService) {
    this.inventoryService = inventory;
    this.searchService = search;
    const rawFilter = this.searchService.createFilter(searchTemplate)
    this.filter = () => this.items = rawFilter(this.query, this.rawItems as [])

    this.setup()
  }
  async setup() {
    this.rawItems = await this.inventoryService.getOrderInfo();
    this.items = this.rawItems
  }

  async update(item):Promise<void>{
    console.log(item)
    item.estado ==1? item.estado=0:item.estado=1
    await this.inventoryService.updateStatus(item);
  }

}

