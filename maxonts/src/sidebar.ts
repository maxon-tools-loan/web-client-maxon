import {routes} from "./routes";

export class Sidebar {

  routelist: typeof routes
  coso = "algo";

  constructor() {
    this.routelist = routes;
  }
}
