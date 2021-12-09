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

  getFullSession(): LoginData {
    return localStorage.getItem(STORAGE_KEYS.USER_SESSION) as unknown as LoginData
  }

  async login(username: string, password: string): Promise<boolean> {
    const response = await sendToApi('login', {
      username,
      password
    })
    const jsonData = response.json()
    this.userData = (await jsonData).data as LoginData
    // nose ontas ector, voy a tomar malas decisiones
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(this.userData))
    return  (await jsonData).code
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

  hasPermission(permission:string) {
    const session = this.getFullSession()
    const permissions = session.permissionTree

    let permissionParts = permission.split('.')
    let currentPermission = permissions
    for (const part of permissionParts) {
      if (!currentPermission[part])
        return false
      if (currentPermission[part] === true)
        return true 
      currentPermission = currentPermission[part]
    }
    // if the permission dashboard.modify is asked
    // and the permission dashboard.modify.{any}.{any} is defined
    // we assume that the full parent permission is granted, because
    // easier to hack 8)
    return true
  }

  async createUser(registerInput: RegisterInput): Promise<{}> {
    const response = await sendToApi('create', registerInput)
    let r =await response.json()
    console.log(r)
    return r ;
  }

}
