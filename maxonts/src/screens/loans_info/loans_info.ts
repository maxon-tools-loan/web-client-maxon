import { Console } from "console"




export class LoanInfo {
    Herramienta = [0,1,2,3]
    consumible = [1,2]
    prestamoid=null
    readonly=null
    activate(params) {
     this.prestamoid = params.id
     this.readonly =  params.readOnly
     if(this.readonly =="0"){
        this.readonly = true    
    }
    else{
        this.readonly=false
    }
    
    console.log(this.readonly)
    }
  

}
