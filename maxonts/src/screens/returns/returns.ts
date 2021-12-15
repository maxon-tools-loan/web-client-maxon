import { Router, Redirect } from 'aurelia-router';
import { SessionService } from 'services/session';
import {LoansService, Returns as IReturns} from "../../services/loans"
import {inject} from "aurelia-framework"
import * as moment from "moment";


@inject(LoansService, SessionService, Router)
export class Returns {
  private query: {};
  private currentQuery:{};
  private moment = moment;

  
  param: string;
  returns = [];
  rawLoans = [];
  rawUsers = [];
  areas = [];
  private page :number = 0
  private maxPage=null

  private loanService: LoansService;

  constructor(loans: LoansService, session: SessionService,rt:Router){
    if (!session.hasPermission('dashboard.read.returns'))
      new Redirect('/auth/login').navigate(rt)
    this.loanService = loans
    this.setupReturns()
  }

  async next(){
    //console.log("NEXT")
    //console.log(this.page,this.maxPage)
    if(this.page<this.maxPage-1){
      
    this.page +=1
    let data = await  this.loanService.getLoans('',this.page,this.currentQuery);
    //console.log(data)
    
    this.returns= data['loans']
    this.maxPage= data['maxPages']
    
    }
  }
  async previous(){
    //console.log("PREV")
    //console.log(this.page,this.maxPage)
    if(this.page>0)
    this.page -=1
    let data = await  this.loanService.getLoans('',this.page,this.currentQuery);
    
    this.returns= data['loans']
    this.maxPage= data['maxPages']
    
  }

  async setupReturns() {
    const {loans, users,maxPages,areas} = await this.loanService.getLoans('');
    this.returns = loans
    this.rawUsers = users   
    this.maxPage = maxPages
    
    //console.log(this.maxPage)
    
    areas.forEach(element  => {
      
        this.areas.push(element['area'])
      
    });
  }

  async search(): Promise<void> {
    this.currentQuery = this.query
    this.page=0
    const {loans, users,maxPages} = await this.loanService.getLoans('',this.page,this.currentQuery)
    this.returns = loans
    this.maxPage = maxPages
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
