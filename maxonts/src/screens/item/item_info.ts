import { InventoryService } from "services/inventory"
import { inject } from "aurelia-framework"

@inject(InventoryService)

export class itemInfo {
    private inventoryService: InventoryService
    constructor(inventory: InventoryService) {
        this.inventoryService = inventory;
    }
    private Empleado = ""
    private data = []
    private activate(params) {
        this.Empleado = params.partNo
        console.log(params.partNo)
        this.get(params.partNo);
    }

    async get(param): Promise<void> {
        this.data = await this.inventoryService.getItemInfo(param);
    }

}