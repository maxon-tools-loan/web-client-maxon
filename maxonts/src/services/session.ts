import fetch from "node-fetch";

import { API, STORAGE_KEYS } from "../../../config"

const endpoint = (endpoint: string) => (`${API.SESSION}/api/user/${endpoint}`) 

interface RegisterInput {
  name: string
  username: string
  password: string
  email: string
}

type PermissionTree = any;

interface UserData {
  id: number;
  username: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  disabled: boolean
}

interface SessionData {
  key: string
  expires: string
  userId: string 
  updatedAt: string
  createdAt: string
}

interface LoginData {
  session: SessionData
  user: UserData
  permissionTree: PermissionTree

}

const sendToApi = async (endpointName: string, data: unknown) => { 
  return await fetch(endpoint(endpointName), {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}  
  });
}


export class SessionService {

  public userData?: LoginData

  async getFullSession() {
    return localStorage.getItem(STORAGE_KEYS.USER_SESSION)
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await (await sendToApi('login', {
        username,
        password
      })).json()

      if(!response.code.includes('success')) {
        console.log('algo fallo')
        return response.code;
      }

      this.userData = response.data as LoginData
      // nose ontas ector, voy a tomar malas decisiones
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(this.userData))
      return  response.code
    } catch (e) {
      console.log(e);
    }
  }

  async logout() {

    if (!this.userData) return true;

    const res = await sendToApi('logout', {
      sessionKey: this.userData.session.key
    })

    console.log(await res.json());
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION)
    this.userData = undefined
    return true;
  }

  async createUser(registerInput: RegisterInput): Promise<boolean> {
    const response = await sendToApi('create', registerInput)
    console.log(await response.json())
    return true;
  }

}
