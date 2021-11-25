import {LoansService, Returns as IReturns} from "../../services/loans"
import {inject} from "aurelia-framework"
import * as moment from "moment";


@inject(LoansService)
export class Returns {
  private query: {};
  private moment = moment;

  
  param: string;
  returns = [];
  rawLoans = [];
  rawUsers = [];
  areas = [];

  private loanService: LoansService;

  constructor(loans: LoansService) {
    this.loanService = loans
    this.setupReturns()
  }

  async setupReturns() {
    const {loans, users} = await this.loanService.getLoans()
    this.rawLoans = loans
    this.rawUsers = users
    this.search()
    this.rawLoans.forEach(element => {
      if(!this.areas.includes(element.area)){
        this.areas.push(element.area)
      }
    });
  }

  async search(): Promise<void> {
    this.returns = await this.loanService.searchReturns(this.query, this.rawLoans)
  }

  private idToUser(id) {
    return this.rawUsers.filter(v=>v.idUsuario == id)[0].nombre ?? "No Encontrado"
  }

  private mapStatus(statusId) {
    const existing = {
      0: "No Entregado",
      1: "Entrega Parcial",
      2: "Entregado"
    }
    return existing[statusId] ?? statusId
  }
}
