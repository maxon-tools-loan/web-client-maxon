import { Console } from "console"
import { LoansInfoService } from "../../services/loan_info"
import { inject } from "aurelia-framework"


@inject(LoansInfoService)
export class LoanInfo {
    options =[{"name":"Devuelto","value":0},{"name":"No Devuelto", "value":1}]
    Herramienta = []
    consumible = []
    prestamoid = null
    readonly = null
    loan: LoansInfoService
    meta = {}
    constructor(loans: LoansInfoService) {
        this.loan = loans
    }

    activate(params) {
        this.prestamoid = params.id
        this.readonly = params.readOnly
        if (this.readonly == "0") {
            this.readonly = true
        }
        else {
            this.readonly = false
        }
        this.update(params.id);


    }

    async update(id): Promise<void> {
        let info = await this.loan.getLoanInfo(id)
        console.log(info)
        this.Herramienta = info["tools"];
        this.consumible = info['consumible'];
        this.meta = info['meta'][0];
      }
}
