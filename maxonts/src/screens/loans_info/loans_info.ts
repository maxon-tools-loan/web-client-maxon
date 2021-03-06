import { Console } from "console"
import { LoansInfoService } from "../../services/loan_info"
import { inject  } from "aurelia-framework"
import {Router, Redirect} from "aurelia-router"
import Swal from "sweetalert2"
import { SWAL_LOANUPDATE_CONFIRM, SWAL_SUCCESS } from "swals/question"
import { SWAL_ERROR } from "swals/error"
import { SessionService } from "services/session"
import * as moment from "moment";


@inject(LoansInfoService,Router,SessionService)
export class LoanInfo {
    private moment = moment
    private options =[{"name":"Devuelto","value":1},{"name":"No Devuelto", "value":0}]
    private posibles = [{"name":"Buen Estado","value":0},{"name":"Dañado", "value":1}, {"name":"Irreparable/Extraviado", "value":2}]
    public herramienta =[]
    private consumible = []
    private prestamoid = null
    private readonly = null
    private loan: LoansInfoService
    private meta = {}
    router:Router
    ///Verificacion de permisos y cargar los servicos necesarios
    constructor(loans: LoansInfoService,rt:Router,session:SessionService) {
        if (!session.hasPermission('dashboard.read.loans'))
            new Redirect('/returns').navigate(rt)
        this.meta['user']=session.getFullSession().user.username
        this.loan = loans
        this.router = rt
    }
    
    //Obtener los valores que se pasan como parametro en la url y relizar la carga de datos correspondiente
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

    ///Valores defectos de los items a la hora de marcarlos como devueltos
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

    // Obntener la informacion del prestamo correspondiente    
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
        //console.log(this.consumible,this.herramienta)
        
      }
    ///Guardar los cambios hechos si se regitra alguna devolucion de material
     async commitChanges() {
        let result  = await Swal.fire(SWAL_LOANUPDATE_CONFIRM)
        if (result){
        const res  = await this.loan.updateLoanInfo(this.herramienta,this.consumible,this.meta)
        if (res['code']=="api.error"){
            await Swal.fire(SWAL_ERROR)
        
        }
        else{
            await Swal.fire(SWAL_SUCCESS)
            new Redirect('/returns').navigate(this.router)
        }
        }
         
    }
}
