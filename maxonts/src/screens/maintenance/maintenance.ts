export class Maintenance {
    public consumibles =[]
    public tools = []
    opt = 1
    
    constructor(){

    }
    addConsumible(){
        this.consumibles.push(consu(this.consumibles.length))
    }
    addTool(){
        this.tools.push(tool(this.tools.length))
    }
    removeTool(index){
        console.log(index)
        if (index > -1) {
            this.tools.splice(index, 1);
          }
    }
    removeConsu(index){
        console.log(index)
        if (index > -1) {
            this.consumibles.splice(index, 1);
          }
    }
    addElement(){
        if(this.opt==1){
            this.addConsumible();
            console.log(this.consumibles)
        }
        else{
            this.addTool();
            console.log(this.tools);
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