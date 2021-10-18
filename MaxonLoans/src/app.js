export class App {
  constructor(){
    this.heading ="SIstema de Prestamos de Maxon";
    this.Elementos=[];
    this.Description="Prueba de Aurelia"
  };

  addTodo(){
    if(this.Description){
      this.Elementos.push({
        description:this.Description,
        done:false
      });
      this.Description="";
    }
  }

  removeTodo(todo){
    let index = this.Elementos.indexOf(todo)
    if (index !==-1){
      this.Elementos.splice(index,1)
    }
  }
}
