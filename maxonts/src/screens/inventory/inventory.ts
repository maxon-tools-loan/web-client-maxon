import { Router, Redirect } from 'aurelia-router';
import {  InventoryService } from "../../services/inventory"
import { inject } from "aurelia-framework"
import { createCipheriv } from "crypto";
import { SessionService } from "services/session";

const sorters = {
  ascending: (prop) => (a, b) => a[prop] - b[prop],
  descending: (prop) => (a, b) => b[prop] - a[prop]
}

@inject(InventoryService, SessionService, Router) 
export class Inventory {

  private inventoryService: InventoryService;
  private sessionService: SessionService;
  private items = []
  private rawItems = []
  private query = {}
  private sorts = {}
  private families = []
  private types = []

  private getSHA = function (input) {
    const algorithm = "aes-256-cbc";

    // generate 16 bytes of random data
    const initVector = "0123456789012345"
    // secret key generate 32 bytes of random data
    const Securitykey = "01234567890123456789012345678901";

    // the cipher function
    const cipher = createCipheriv(algorithm, Securitykey, initVector);


    let encryptedData = cipher.update(input, "utf-8", "hex");

    encryptedData += cipher.final("hex");
    return encryptedData;
  }
  constructor(inventory: InventoryService, sessionService: SessionService,rt:Router){
    if (!sessionService.hasPermission('dashboard.read.inventory'))
      new Redirect('/auth/login').navigate(rt)
    this.sessionService = sessionService;

    this.inventoryService = inventory;
    this.setup()
  }

  async setup() {
    this.rawItems = await this.inventoryService.getInventoryItems("");
    this.families = Array.from(new Set(this.rawItems.map(v => v.Familia.toLowerCase())))
    this.types = Array.from(new Set(this.rawItems.map(v => v.Tipo.toLowerCase())))
    this.search()
  }

  async search(): Promise<void> {
    this.items = await this.inventoryService.searchInventoryItems(this.query, this.rawItems);
    this.items.forEach(element => {
      element["hash"] = this.getSHA(element['idParte'])
    });
    this.update()
  }

  async sort() {
    for (const [key, value] of Object.entries(this.sorts)) {
      this.items.sort(sorters[value as string](key))
    }
  }

  async update() {
  }

  private capitalize(v) {
    return v[0].toUpperCase() + v.slice(1).toLowerCase()
  }

  private amount(v) {
    return v ?? 0
  }

}

