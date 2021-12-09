import { read } from "fs";
import { BlobToUrlValueConverter } from "screens/up_downs/up_downs";

const CsvReadableStream = require('csv-reader');

export class EmployeLoader{
 data:File = null;
 

 async load(){
     console.log(this.data)
     var reader = new BlobToUrlValueConverter()
     let ls = reader.toView(this.data[0])
     let rd =  new FileReader()
     let ds
     rd.onload= (function(file){
        
            ds = rd.result;
            ds = csvToArray(ds,'|',['idEmpleado','nombre','area','supervisor'])
            console.log(ds)
            
        
     })
     rd.readAsText(this.data[0])
     
 }

 
}

export function csvToArray(str, delimiter = ",", headers = undefined) {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    if (headers==undefined){
        headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    }
  
    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
        if (header =='supervisor' && values[index]!=undefined){
          object[header] = values[index].slice(0,-1);
        }
        else{
            object[header] = values[index]
        }
          return object;
        }, {});
        return el;
      });
    
      // return the a
      return arr
  }