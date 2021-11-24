import {LoansService, Returns as IReturns} from "../../services/loans"
import {inject} from "aurelia-framework"
import * as moment from "moment";

@inject(LoansService)
export class History {
  private moment = moment

  private read = 0;
  private param: string;
  private query: {}
  private loans: IReturns[] = [];
  private rawLoans: []
  private rawUsers: []

  private loanService: LoansService;

  constructor(loans: LoansService) {
    this.loanService = loans
    this.setup()
  }
  async setup() {
    const {loans, users} = await this.loanService.getAllLoans(this.param);
    console.log("Active Loans: ", loans)
    this.rawLoans = loans
    this.rawUsers = users
    this.loans = this.rawLoans
  }

  async search(): Promise<void> {
    this.loans = await this.loanService.searchReturns(this.query, this.rawLoans)
  }

  private idToUser(id: string) {
    // @ts-ignore
    return this.rawUsers.filter(v => v.idUsuario == id)[0].nombre ?? "No Encontrado"
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
