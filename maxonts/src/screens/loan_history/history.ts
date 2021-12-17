import {LoansService, Returns as IReturns} from "../../services/loans"
import {inject} from "aurelia-framework"
import * as moment from "moment";
import { ReportService } from "services/reportService";
const xslx = require('xlsx')

@inject(LoansService,ReportService)
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
  area:[]

  private loanService: LoansService;
  report:ReportService
  constructor(loans: LoansService,reports:ReportService) {
    this.loanService = loans
    this.report=reports
    this.setup()
  }


  async setup() {
    const {loans, users,maxPages,areas} = await this.loanService.getAllLoans(this.param);
    this.area =areas
    //console.log("Active Loans: ", loans)
    this.rawUsers = users
    this.loans = loans
    
    this.maxPage = maxPages
  }

  async search(): Promise<void> {
    this.page=0
    const {loans, users,maxPages} = await this.loanService.getAllLoans(this.param,this.page,this.query);
    this.currentQuery=this.query
    //console.log("Active Loans: ", loans)
    this.rawUsers = users
    this.loans = loans
    
    this.maxPage = maxPages
  }

  async next(){
    //console.log("NEXT")
    //console.log(this.page,this.maxPage)
    if(this.page<this.maxPage-1){
      
    this.page +=1
    const {loans, users,maxPages} = await this.loanService.getAllLoans(this.param,this.page,this.currentQuery);
    //console.log(loans)
    this.loans = loans
    
    this.maxPage = maxPages
    
    }
  }
  async previous(){
    //console.log("PREV")
    //console.log(this.page,this.maxPage)
    if(this.page>0){
    this.page -=1
    const {loans, users,maxPages} = await this.loanService.getAllLoans(this.param,this.page,this.currentQuery);
    console.log(loans)

    this.loans = loans
    
    this.maxPage = maxPages
    }
  }
  private idToUser(id: string) {
    // @ts-ignore
    return this.rawUsers.filter(v => v.idUsuario == id)[0].nombre ?? "No Encontrado"
  }
  async downloadReport(){
    let data = await this.report.getReport(this.currentQuery)
    await xslx.writeFile(data, `${new Date().toDateString()} Report.xlsx`)
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
