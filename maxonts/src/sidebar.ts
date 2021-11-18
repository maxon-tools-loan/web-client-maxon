import { SessionService } from 'services/session';
import { inject } from 'aurelia-framework';
@inject(SessionService)
export class Sidebar {
  sessionService: SessionService

  constructor(session: SessionService) {
    this.sessionService = session
    console.log("INSTANTIATING")
  }
}
