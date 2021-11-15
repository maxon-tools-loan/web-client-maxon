import { InventoryService } from "services/inventory"
import { inject } from "aurelia-framework"

@inject(InventoryService)

export class itemInfo {
    inventoryService: InventoryService
    constructor(inventory: InventoryService) {
        this.inventoryService = inventory;
    }
    Empleado = ""
    data = []
    activate(params) {
        this.Empleado = params.partNo
        console.log(params.partNo)
        this.get(params.partNo);
    }

    async get(param): Promise<void> {
        this.data = await this.inventoryService.getItemInfo(param);
    }

}