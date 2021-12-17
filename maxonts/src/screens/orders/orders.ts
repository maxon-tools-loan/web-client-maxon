import { Router, Redirect } from 'aurelia-router';
import { SessionService } from 'services/session';
import { UNDEFINED } from './../../utils/index';
import { InventoryService} from "../../services/inventory"
import {inject} from "aurelia-framework"
import { SearchService } from "services/search";
import { FormatService } from "services/format";
import { ReportService } from 'services/reportService';
const XLSX = require('xlsx')

const searchTemplate = {
  idParte: {
    evaluator: (expected) => (current: string) => current.includes(expected)
  },
  Familia: {
    evaluator: (expected) => (current: string) => current.toLowerCase() == expected
  },
  estado: {
    evaluator: (expected) => (current: number) => current === parseInt(expected)
  }
}

@inject(InventoryService, SearchService, FormatService, SessionService, Router,ReportService) 
export class Inventory {
  private UNDEFINED=UNDEFINED

  private inventoryService: InventoryService;
  private searchService: SearchService;
  private formatService: FormatService
  private familias: []
  currentQuery ={}
  private items = []
  private rawItems = []
  
  private query: {}

  private page :number = 0
  private maxPage=null
  private report:ReportService

  constructor(inventory: InventoryService, search: SearchService, format: FormatService, session: SessionService,rt:Router,rs:ReportService){
    if (!session.hasPermission('dashboard.read.orders'))
      new Redirect('/auth/login').navigate(rt)
    this.inventoryService = inventory;
    this.searchService = search;
    this.formatService = format;
    this.report = rs;

    const rawFilter = this.searchService.createFilter(searchTemplate)
   

    this.setup()
  }
  async setup() {
    let data  = await this.inventoryService.getOrderInfo();
    this.rawItems =  data['value']
    this.maxPage = data['pages']
    this.familias = this.searchService.getUniqueProperties(this.rawItems, (v) => v.Familia.toLowerCase())
    //console.log(this.familias)
    this.items = this.rawItems
  }
  async next(){
    if(this.page<this.maxPage-1){
      //console.log()
    this.page +=1
    let data = await  this.inventoryService.getOrderInfo(this.currentQuery,this.page);
    this.items= data['value']
    this.maxPage= data['pages']
    
    }
  }

  async getReport(){
    
    let data = await this.report.getReportInventory(this.currentQuery)
    //console.log(data)
     XLSX.writeFileSync(data, `${new Date().toDateString()} Report-Low Inventory.xlsx`)


  }
  async previous(){
    if(this.page>0)
    this.page -=1
    let data = await  this.inventoryService.getOrderInfo(this.currentQuery,this.page);
    
    this.items= data['value']
    this.maxPage= data['pages']
   
  }
  async update(item):Promise<void>{
    //console.log(item)
    item.estado ==1? item.estado=0:item.estado=1
    await this.inventoryService.updateStatus(item);
  }

  async search(){
    this.page =0
    this.currentQuery = this.query
    let data = await  this.inventoryService.getOrderInfo(this.currentQuery,this.page);
    
    this.items= data['value']
    this.maxPage= data['pages']
  }

}

