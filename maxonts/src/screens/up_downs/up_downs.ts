
export class Up_Downs {
    public up = true
    
    public ups = []
    public down = []

    addUp(){
        this.ups.push(Item())
    }
    addDown(){
        this.down.push(Item())
    }
    removeUp(i){
        if (i > -1) {
            this.ups.splice(i, 1);
          }
    }
    removeDown(i){
        if (i > -1) {
            this.down.splice(i, 1);
          }
    }
    commit(){
        console.log("TBD")
    }
    commitDown(){
        console.log("TBD")
    }
    
}

function Item(){
    return{
        "idParte":"",
        "Familia":"",
        "Descripcion":"",
        "Seccion":"",
        "Minimo":"",
        "Maximo":""
    }
}




