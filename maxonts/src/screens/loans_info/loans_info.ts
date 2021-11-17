import { Console } from "console"
import { LoansInfoService } from "../../services/loan_info"
import { inject } from "aurelia-framework"


@inject(LoansInfoService)
export class LoanInfo {
    options =[{"name":"Devuelto","value":1},{"name":"No Devuelto", "value":0}]
    public herramienta =[]
    consumible = []
    prestamoid = null
    readonly = null
    loan: LoansInfoService
    meta = {}
    constructor(loans: LoansInfoService) {
        this.loan = loans
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

    async update(id): Promise<void> {
        let info = await this.loan.getLoanInfo(id)
    
        this.herramienta = info['tools'];
        // info['tools'].forEach(element => {
        //     this.Herramienta.push(element);
        // });
        console.log(this.herramienta)
        this.consumible = info['consumible'];
        this.meta = info['meta'][0];
        console.log(this.consumible)
        
      }
    
     async commitChanges() {
        const res  = await this.loan.updateLoanInfo(this.herramienta,this.consumible,this.meta)
        if (res['code']=="api.error") alert("Parece que Ocurrio un error intentelo de nuevo")
    }
}
