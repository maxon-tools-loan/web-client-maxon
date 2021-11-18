import {LoansService, Returns as IReturns} from "../../services/loans"
import {inject} from "aurelia-framework"
import * as moment from "moment";


@inject(LoansService)
export class Returns {
  query: {};
  moment = moment;

  
  param: string;
  returns = [];

  loanService: LoansService;

  constructor(loans: LoansService) {
    this.loanService = loans
    this.search()
  }

  async search(): Promise<void> {
    console.log(this.query)
    this.returns = await this.loanService.searchReturns(this.query)
    // this.returns = await this.loanService.getLoans(this.param)
    console.log(this.returns);
  }


  mapStatus(statusId) {
    const existing = {
      0: "No Entregado",
      1: "Entrega Parcial",
      2: "No Entregado"
    }
    return existing[statusId] ?? statusId
  }
}
