
import {inject} from "aurelia-framework"
import {createConnection} from "typeorm";




export class test {
  async run(){
    const connection = await createConnection({
     type: "mssql",
     host: "192.168.56.1",
     port: 0,
     username: "test",
     password: "test123",
     database: "maxon"
 });
  const queryRunner = await connection.createQueryRunner();
  queryRunner.connect();
  const val = await queryRunner.query("SELECT * FROM maxon.item");
  console.log(val);
  }
  



}
