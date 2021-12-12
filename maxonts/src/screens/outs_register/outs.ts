import {inject} from "aurelia-framework"
import { InventoryService } from "services/inventory"
import {Router, Redirect} from "aurelia-router"
import * as moment from "moment";
import { ReportService } from "services/reportService";
const xslx = require('xlsx')

@inject(InventoryService, Router,ReportService)
export class outs_register{
    private moment =moment
    private actualPagetools:number=0
    private actualPageConsumibles:number=0
    private maxPagetools:number
    private maxPageConsumibles:number
    query:{}
    typer= 0
    currentQuery:{}
    types ={
        0:'Salidas',
        1:'Entradas'
    }
    
    titulo = `Registro de ${this.types[this.typer]}`
    rawTools =[]
    rawConsumibles =[]
    tools =[]
    consumibles =[]
    service:InventoryService
    router:Router
    report:ReportService
    constructor(service:InventoryService, rt:Router,rp:ReportService){
        this.service = service
        this.router = rt
        this.report = rp
        this.setUp()
    }

    async search(){
        this.currentQuery = this.query
        let data =await this.service.getOutItems(this.actualPageConsumibles,undefined,10,this.currentQuery)
        this.tools = data['tools']
        this.maxPageConsumibles=data['pageTools']
        this.consumibles = data['consumibles']
        this.maxPageConsumibles=data['pageConsumibles']
    }
    
    async updatePage(type){
       let data
        if(type==1 ){
            console.log("EXECUTED")
            console.log(this.actualPageConsumibles)
            
            if(this.typer==0){
                data =await this.service.getOutItems(this.actualPageConsumibles,undefined,10,this.currentQuery);
            }
            else{
                data =await this.service.getInItems(this.actualPageConsumibles,undefined,10);
            }
            this.consumibles = data['consumibles']
            this.maxPageConsumibles=data['pageConsumibles']
        }
        else{
            console.log("EXECUTED")
        
            if(this.titulo=='Registro de Salidas'){
                
            data =await this.service.getOutItems(undefined,this.actualPagetools,10);
            }
            else{
                data =await this.service.getInItems(undefined,this.actualPagetools,10);
            }
            this.tools = data['tools']
            this.maxPagetools=data['pageTools']
        }
    }

    async pagination(type:number,movement:number){
        
        if(type==1){
            if(movement==1 && this.maxPageConsumibles-1 >this.actualPageConsumibles){
            this.actualPageConsumibles=(this.actualPageConsumibles+1)
            await this.updatePage(type)
        }
            else if(movement==0 && 0<this.actualPageConsumibles){
            this.actualPageConsumibles=(this.actualPageConsumibles-1)
            await this.updatePage(type)
        }
            
        }
        else{
            if(movement==1 && this.actualPagetools <this.maxPagetools-1){
               
            this.actualPagetools=(this.actualPagetools+1)
            await this.updatePage(type)}
            else if(movement==0 && this.actualPagetools >0) {
            this.actualPagetools=(this.actualPagetools-1)
            await this.updatePage(type)}
            
        }
        
    }
    not(i){
        if(i==1) return 0
        return 1
    }

    async changeData(){
        if (this.typer==0){
            this.titulo =`Registro de ${this.types[this.typer]}`
            this.typer=1
            
            let data =await this.service.getInItems();
            console.log("registroENTRADA")
            console.log(data)
            this.tools =data['tools']
            this.consumibles = data['consumibles']
            this.maxPagetools= data['pageTools']
            this.maxPageConsumibles = data['pageConsumibles']

        }
        else{
            
            this.titulo =`Registro de ${this.types[this.typer]}`
            this.typer = 0
            let data =await this.service.getOutItems();
            console.log("registroSALIDA")
            console.log(data)
            this.tools =data['tools']
            this.consumibles = data['consumibles']
            this.maxPagetools= data['pageTools']
            this.maxPageConsumibles = data['pageConsumibles']
        }
       
    }
    async setUp(){
        let data =await this.service.getOutItems();
        console.log(data)
        this.rawTools =data['tools']
        this.rawConsumibles = data['consumibles']
        this.tools = this.rawTools.slice(0,10)
        this.consumibles = this.rawConsumibles.slice(0,10)
        this.actualPageConsumibles =0
        this.actualPagetools=0
        this.maxPagetools =data['pageTools']
        this.maxPageConsumibles=data['pageConsumibles']
        console.log(this.maxPageConsumibles,this.maxPagetools)
        
    }
    async downloadReport(){
        let data = await this.report.getReportDowns(this.currentQuery)
        await xslx.writeFile(data, `${new Date().toDateString()} Reporte Salidas.xlsx`)
    }

    redirect(){
        new Redirect('/registerInOuts').navigate(this.router)
    }
    
}