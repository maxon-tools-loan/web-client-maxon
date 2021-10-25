import {routes} from "./routes";

export class Sidebar {

  routelist: typeof routes

  constructor() {
    this.routelist = routes;
  }
}
