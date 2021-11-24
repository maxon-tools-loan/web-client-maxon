export class InOut {
    public type=0;
    public consumibles =[]
    public tools = []
    private opt = 1
    private name = "Entrada"
    private options=[
        {"name":"Entrada",
        "valor":0},
        {"name":"Salida",
        "valor":1}
    ]

    private getName(){
        this.name= this.options[this.type].name
    }
    private addConsumible(){
        this.consumibles.push(consu(this.consumibles.length))
    }
    private addTool(){
        this.tools.push(tool(this.tools.length))
    }
    private removeTool(index){
        console.log(index)
        if (index > -1) {
            this.tools.splice(index, 1);
          }
    }
    private removeConsu(index){
        console.log(index)
        if (index > -1) {
            this.consumibles.splice(index, 1);
          }
    }
    private addElement(){
        if(this.opt==1){
            this.addConsumible();
            console.log(this.consumibles)
        }
        else{
            this.addTool();
            console.log(this.tools);
        }
    }

    private commit(){
        const type = (this.type) ? "Entrada" : "Salida"
        
        if(this.type){
            console.log("Salida")
        }
        else{
            console.log("Entrada")
        }
    }
   
}

function consu(index){
    const information ={
        'idConsumible':'',
        'idParte':'',
        'cantidad':1,
        'comentario':'',
        'area':'',
        'index':index,
    }
    return information
}

function tool(index){
    const information ={
        'idHerramienta':'',
        'idParte':'',
        'comentario':'',
        'area':'',
        'index':index,
    }
    return information
}
