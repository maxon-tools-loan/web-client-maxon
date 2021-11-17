import {  InventoryService } from "../../services/inventory"
import { inject } from "aurelia-framework"
import { createCipheriv } from "crypto";
@inject(InventoryService)
export class Inventory {

  inventoryService: InventoryService;
  items = []

  getSHA = function (input) {
    const algorithm = "aes-256-cbc";

    // generate 16 bytes of random data
    const initVector = "0123456789012345"
    // secret key generate 32 bytes of random data
    const Securitykey = "01234567890123456789012345678901";

    // the cipher function
    const cipher = createCipheriv(algorithm, Securitykey, initVector);


    let encryptedData = cipher.update(input, "utf-8", "hex");

    encryptedData += cipher.final("hex");
    console.log(encryptedData);
    return encryptedData;
  }
  constructor(inventory: InventoryService) {
    this.inventoryService = inventory;
  }

  async search(): Promise<void> {
    this.items = await this.inventoryService.getInventoryItems("");
    this.items.forEach(element => {
      element["hash"] = this.getSHA(element['idParte'])
    });
  }



}

