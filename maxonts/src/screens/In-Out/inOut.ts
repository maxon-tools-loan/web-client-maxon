import { SessionService } from 'services/session';
import { inject } from "aurelia-framework"
import { InventoryService } from "services/inventory";
import { LoansService } from "services/loans";
import { SWAL_ERROR } from "swals/error";
import { SWAL_INS_CONFIRM, SWAL_OUTS_CONFIRM, SWAL_SUCCESS, SWAL_UPS_CONFIRM } from "swals/question";
import Swal from "sweetalert2";
import {Redirect, Router} from 'aurelia-router';


@inject(LoansService, InventoryService, SessionService, Router) 
export class InOut {
  public type = 0;
  public consumibles = []
  public tools = []
  private opt = 1
  private name = "Entrada"
  private options = [
    {
      "name": "Entrada",
      "valor": 0
    },
    {
      "name": "Salida",
      "valor": 1
    }
  ]

  meta = {
    'user': ''
  }
  service: LoansService
  inventory: InventoryService
  constructor(serv: LoansService, invent: InventoryService, session: SessionService,rt:Router){
    if (!session.hasPermission('dashboard.read.in_out'))
      new Redirect('/auth/login').navigate(rt)
  
    this.service = serv
    this.inventory = invent
    this.router=rt
    this.meta.user = session.getFullSession().user.username
    this.setUp()
  }

  dictHerramientas = {}
  dictConsumibles = {}
  ConsumibleSelected = null
  IDConsumibleSelected = null

  HerramientaSelected = null
  IDHerramientaSelected = null

  NombresDeConsumibles = []
  matchesConsumibles = []
  matchesIdConsumibles = []

  NombresDeHerramientas = []
  matchesHerramientas = []
  matchesIdHerramientas = []

  fullDataConsumibles = []
  fullDataHerramientas = []

  // Redireccionar a la pantalla de registros para material no registrado
  async redirect(){
    new Redirect('/newIn').navigate(this.router)
  }
  router:Router

  //Se obtienen las variables locales y se guardan en memoria
  async setUp() {
    let data = await this.service.getConsumiblesAndTools()
    data['tools'].forEach(element => {
      this.NombresDeHerramientas.push(element['Descripcion'])
    });
    data['consumibles'].forEach(element => {
      this.NombresDeConsumibles.push(element['Descripcion'])
    });
    this.fullDataConsumibles = data['consumibles']
    this.fullDataHerramientas = data['tools']
    data = await this.service.getBasicData()
    data['tools'].forEach(element => {

      this.dictHerramientas[element['idHerramienta']] = element['idParte']
    });
    data['consumibles'].forEach(element => {
      this.dictConsumibles[element['idConsumible']] = element['idParte']
    })
  }

  //Agregar un elemento a la lista de entradas y salidas
  AddCustom(i) {
    if (i) {
      this.consumibles.push(
        {
          "idParte": this.ConsumibleSelected,
          "idConsumible": this.IDConsumibleSelected,
          "cantidad": 1,

        }
      )
    }
    else {
      //console.log(this.HerramientaSelected, this.IDHerramientaSelected)
      this.tools.push({
        "idHerramienta": this.IDHerramientaSelected,
        "idParte": this.HerramientaSelected
      })

    }
  }

  ///Hacer un match entre el numero de herramienta y el numero de parte relacionado con un elemento
  private updateData(i, type) {
    //console.log(i, type)
    if (type == 0) {
      this.tools[i]['idParte'] = this.dictHerramientas[this.tools[i]['idHerramienta']]
    }
    else {
      this.consumibles[i]['idParte'] = this.dictConsumibles[this.consumibles[i]['idConsumible']]
    }


  }

  //Hacer un match del nombre y y los numeros de parte asociuados a esos nombres 
  matchParte(i, name) {
    if (i == 1) {
      this.matchesConsumibles = []
      this.fullDataConsumibles.forEach(element => {
        if (element['Descripcion'] == name) {
          this.matchesConsumibles.push(element['idParte'])
        }

      });
    }
    else {
      this.matchesHerramientas = []
      this.fullDataHerramientas.forEach(element => {
        if (element['Descripcion'] == name) {
          this.matchesHerramientas.push(element['idParte'])
        }

      });
    }
  }
  /// Se hace un match entre el nombre y el idParte
  matchId(i, name) {
    //console.log(i, name)
    if (i == 1) {
      this.matchesIdConsumibles = []
      for (const [key, value] of Object.entries(this.dictConsumibles)) {
        if (value == name) {
          this.matchesIdConsumibles.push(key.toString())
        }
      }
    }
    else {
      this.matchesIdHerramientas = []
      for (const [key, value] of Object.entries(this.dictHerramientas)) {
        if (value == name) {
          this.matchesIdHerramientas.push(key.toString())
        }
      }
    }
  }
 
  // Se obtiene el nombre de la pantalla
  private getName() {
    this.name = this.options[this.type].name
  }

  //Agregar un consumible a la lista de consumibles
  private addConsumible() {
    this.consumibles.push(consu(this.consumibles.length))
  }
  //Agregar una herramienta a la lista de herrramientas
  private addTool() {
    this.tools.push(tool(this.tools.length))
  }

  //Eliminar una herramienta de la lista
  private removeTool(index) {
    //console.log(index)
    if (index > -1) {
      this.tools.splice(index, 1);
    }
  }
  //Remover un consumible de la lista
  private removeConsu(index) {
    //console.log(index)
    if (index > -1) {
      this.consumibles.splice(index, 1);
    }
  }
  //Agrear un consumible o un numero de herramienta
  private addElement() {
    if (this.opt == 1) {
      this.addConsumible();
      //console.log(this.consumibles)
    }
    else {
      this.addTool();
      //console.log(this.tools);
    }
  }
   
  //Comprobar que los datos sean correctos
  private verifyData() {
     ///Verificar que el idParte no sea nulo
    for (const element of this.tools) {
      if (element['idParte'] == null || element['idParte'] == '') {
        return false;
      }

      ///Verificar que el elemento exista en ;as herramientas registradas
      if (!Object.values(this.dictHerramientas).includes(element.idParte)) {
        //console.log("AAAAAAAAAAA")
        return false;
      }
      
      //Verificar que el numero de herramienta exista 
      if(Object.keys(this.dictHerramientas).includes(element.idHerramienta) ||Object.keys(this.dictConsumibles).includes(element.idHerramienta)){
        return false
      }

    };

    ///Verificar que el idParte no sea nulo
    for (const element of this.consumibles) {
      if (element['idParte'] == null || element['idParte'] == '') {
        return false
      }
      ///Verificar que el elemento exista en los consumibles registrados
      if (!Object.values(this.dictConsumibles).includes(element.idParte)) {
        return false
      }
    };
    return true
  }

  ///Veirficacion de los datos para cuando se realiza un baja
  async verifyDownData(): Promise<Boolean> {
    //Verificar que el idParte exista
    for (const element of this.tools) {
      if (!Object.values(this.dictHerramientas).includes(element.idParte)) {
        return false
      }
    }
      //Verificar que el idParte exista
    for (const element of this.consumibles) {
      if (!Object.values(this.dictConsumibles).includes(element.idParte)) {
        return false
      }
    }


    return true
  }

  ///Guardar los cambios y enviarlos a el servidor
  private async commit() {
    const type = (this.type) ? "Entrada" : "Salida"

    if (this.type) {
      if (await this.verifyDownData()) {
        let res = await Swal.fire(SWAL_OUTS_CONFIRM)
        if (res.isConfirmed) {
          let response = await this.service.commitDown(this.tools, this.consumibles, this.meta)
          //console.log(response)
          if (response.data == 'api.success') {
            await Swal.fire(SWAL_SUCCESS)
            this.consumibles = []
            this.tools = []
            this.setUp()
          }
          else {
            await Swal.fire(SWAL_ERROR)
          }

        } else {

          Swal.fire(SWAL_ERROR)
        }

      }
      else {
        //console.log("ERROR ON VETIFY")
        Swal.fire(SWAL_ERROR)
      }


    }
    else {
      //console.log("Entrada")
      if (await this.verifyData() == true) {
        let res = await Swal.fire(SWAL_INS_CONFIRM)
        if (res.isConfirmed) {
          let res = await this.inventory.entryItem(this.tools, this.consumibles, this.meta)
          if (res.data == 'api.success') {
            Swal.fire(SWAL_SUCCESS)
          }
          else {
            Swal.fire(SWAL_ERROR)
          }
          this.consumibles = []
          this.tools = []
          this.setUp()
        }

      }
      else {
        await Swal.fire(SWAL_ERROR)
      }
    }
  }

}

function consu(index) {
  const information = {
    'idConsumible': '',
    'idParte': '',
    'cantidad': 1,
    'index': index,
  }
  return information
}

function tool(index) {
  const information = {
    'idHerramienta': '',
    'idParte': '',
    'marca': '',
    'index': index,
  }
  return information
}
