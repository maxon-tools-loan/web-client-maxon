import { InventoryService } from "services/inventory"
import { inject } from "aurelia-framework"
import Swal from "sweetalert2";
import { SWAL_EMP_CONFIRM, SWAL_IMG_CONFIRM, SWAL_SUCCESS } from "swals/question";
import { SWAL_ERROR } from "swals/error";
import * as JsBarcode from "jsbarcode";
import { sleep } from "utils";
 


@inject(InventoryService)

export class itemInfo {
    private inventoryService: InventoryService
    constructor(inventory: InventoryService) {
        this.inventoryService = inventory;
    }
    private Empleado = ""
    private data = {}
    items = []
    Images
    log(data){
        let reader = new FileReader();
        //console.log(this.Images)
        reader.onload = () =>{
            this.data[0].imagen = reader.result
            //console.log(data.Image)
        }
        reader.readAsDataURL(this.Images[0])
        
    }
    private activate(params) {
        this.Empleado = params.partNo
        //console.log(params.partNo)
        this.get(params.partNo);
    }
    
    async changeImage(){
        let con = await Swal.fire(SWAL_IMG_CONFIRM)
        let res;
        if(con.isConfirmed){
        res = await this.inventoryService.updateImage({'imagen':this.data[0].imagen, idParte:this.data[0].idParte})
        }
        //console.log(res)
        if (res.data =='api.success'){
            Swal.fire(SWAL_SUCCESS)
        }else{
            Swal.fire(SWAL_ERROR)
        }

    
    }

    async get(param): Promise<void> {
        let data  = await this.inventoryService.getItemInfo(param);
        //console.log(data)
        this.data = data['value']
        this.items = data['items']
        JsBarcode("#barcode",this.data[0]['idParte'])
        //console.log(this.items)
    }

    loadItems(item){
        item['generated']=0
        const element = item
            if(element.idHerramienta!=undefined)
            JsBarcode("#a"+element.idHerramienta,element.idHerramienta)
            else
            JsBarcode("#a"+element.idConsumible,element.idConsumible)

        
    }

    mapToStatus(val){
        return val ==1 ? "Activo" : "Inactivo"
    }
    

}

