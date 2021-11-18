import fetch from "node-fetch";
import { API } from "../../../config"

const endpoint = (endpoint: string) => (`${API.SESSION}/api/user/${endpoint}`) 

interface RegisterInput {
  name: string
  username: string
  password: string
  email: string
}

const sendToApi = async (endpointName: string, data: unknown) => { 
  return await fetch(endpoint(endpointName), {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}  
  });
}


export class SessionService {

  async login(username: string, password: string): Promise<boolean> {
    const response = await sendToApi('login', {
      username,
      password
    })
    
    console.log(await response.json())
    return true;
  }

  async createUser(registerInput: RegisterInput): Promise<boolean> {
    const response = await sendToApi('create', registerInput)
    console.log(await response.json())
    return true;
  }

}
