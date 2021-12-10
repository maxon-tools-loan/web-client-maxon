import {LoansService, Returns as IReturns} from "../../services/loans"
import {inject} from "aurelia-framework"
import * as moment from "moment";

@inject(LoansService)
export class History {
  private moment = moment

  private read = 0;
  private param: string;
  private query= {}
  private currentQuery={}
  private loans = [];
  private rawLoans: []
  private rawUsers: []
  private page :number = 0
  private maxPage=null

  private loanService: LoansService;

  constructor(loans: LoansService) {
    this.loanService = loans
    this.setup()
  }
  async setup() {
    const {loans, users,maxPages} = await this.loanService.getAllLoans(this.param);
    console.log("Active Loans: ", loans)
    this.rawUsers = users
    this.loans = loans
    
    this.maxPage = maxPages
  }

  async search(): Promise<void> {
    const {loans, users,maxPages} = await this.loanService.getAllLoans(this.param,0,this.query);
    this.currentQuery=this.query
    console.log("Active Loans: ", loans)
    this.rawUsers = users
    this.loans = loans
    
    this.maxPage = maxPages
  }

  async next(){
    console.log("NEXT")
    console.log(this.page,this.maxPage)
    if(this.page<this.maxPage-1){
      
    this.page +=1
    const {loans, users,maxPages} = await this.loanService.getAllLoans(this.param,this.page,this.currentQuery);
  
    this.loans = loans
    
    this.maxPage = maxPages
    
    }
  }
  async previous(){
    console.log("PREV")
    console.log(this.page,this.maxPage)
    if(this.page>0)
    this.page -=1
    const {loans, users,maxPages} = await this.loanService.getAllLoans(this.param,this.page,this.currentQuery);
  

    this.loans = loans
    
    this.maxPage = maxPages
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
