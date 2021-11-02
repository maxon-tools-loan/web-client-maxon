import { sleep } from "../utils";

export interface IInventoryItem {
  partNo: number;
  family: string;
  name: string;
  minimum: number;
  maximum: number;
  loaned?: number;
  available: boolean;
}

const dummyInventory: IInventoryItem[] = [
  {
    partNo: 123,
    family: "Hello",
    name: "eqwieqw",
    minimum: 3,
    maximum: 5,
    loaned: 12321,
    available: false,
  },
  {
    partNo: 123,
    family: "Hello",
    name: "eqwieqw",
    minimum: 3,
    maximum: 5,
    available: false,
  },
  {
    partNo: 123,
    family: "Hello",
    name: "eqwieqw",
    minimum: 3,
    maximum: 5,
    loaned: 12321,
    available: false,
  },
];

export class InventoryService {
  async getInventoryItems(param): Promise<IInventoryItem[]> {
    await sleep(1000);

    return dummyInventory;
  }
}
