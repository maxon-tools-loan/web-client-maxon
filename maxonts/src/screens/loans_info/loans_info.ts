import { Console } from "console"
import { LoansInfoService } from "../../services/loan_info"
import { inject  } from "aurelia-framework"
import {Router, Redirect} from "aurelia-router"


@inject(LoansInfoService,Router)
export class LoanInfo {
    private options =[{"name":"Devuelto","value":1},{"name":"No Devuelto", "value":0}]
    private posibles = [{"name":"Buen Estado","value":0},{"name":"Dañado", "value":1}, {"name":"Irreparable/Extraviado", "value":2}]
    public herramienta =[]
    private consumible = []
    private prestamoid = null
    private readonly = null
    private loan: LoansInfoService
    private meta = {}
    router:Router
    constructor(loans: LoansInfoService,rt:Router) {
        this.loan = loans
        this.router = rt
    }

     async activate(params) {
        this.prestamoid = params.id
        this.readonly = params.readOnly
        if (this.readonly == "0") {
            this.readonly = true
        }
        else {
            this.readonly = false
        }
        await this.update(params.id);
    

    }
    integrityCheck(type,item){
        if(item['devuelto']==0){
            if(type==1){
                item['condicionDevolucion']==null
            }
            else{
                item['cantidadDevuelta']==0
            }
        }
    }
    async update(id): Promise<void> {
        let info = await this.loan.getLoanInfo(id)
    
        this.herramienta = info['tools'];
         this.herramienta.forEach(element => {
            element['enabled']=element.devuelto
         });
        this.consumible = info['consumible'];
        this.meta = info['meta'][0];
        this.consumible.forEach(element => {
             element['enabled']=element.devuelto
        });
        console.log(this.consumible,this.herramienta)
        
      }
    
     async commitChanges() {
        const res  = await this.loan.updateLoanInfo(this.herramienta,this.consumible,this.meta)
        if (res['code']=="api.error") alert("Parece que Ocurrio un error intentelo mas tarde")
         new Redirect('/returns').navigate(this.router)
    }
}
