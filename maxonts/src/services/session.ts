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
  private watchList: Array<any>

  getFullSession(): LoginData {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SESSION) ?? "{}") as unknown as LoginData
  }

  watch(fun) {
    if (!this.watchList)
      this.watchList = []
    this.watchList.push(fun)
  }

  async refresh() {
    this.watchList.map(v => v())
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
      this.refresh()
      return  response.code
    } catch (e) {
      console.log(e);
    }
  }

  async logout() {

    if (!this.userData) return true;
    const ata = this.getFullSession()
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION)

    const res = await sendToApi('logout', {
      sessionKey: this.userData.session.key
    })

    console.log(await res.json());
    this.userData = undefined
    this.refresh()
    return true;
  }

  hasPermission(permission:string) {
    const session = new SessionService().getFullSession()
    if (!session)
      return false
    console.log(session)
    const permissions = session.permissionTree

    if (!permission || !permissions)
      return false

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

  async refreshSession() {
    const session = new SessionService().getFullSession()
    if (!session?.session?.key)
      return
    const data = await (await sendToApi('refresh', {
      sessionKey: session.session.key
    })).json()
    if (data.code != "api.sessoinRefreshed")
      this.logout()
    this.userData = data.data  
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(this.userData))
  }

  async createUser(registerInput: RegisterInput): Promise<{}> {
    const response = await sendToApi('create', registerInput)
    let r =await response.json()
    console.log(r)
    this.refresh()
    return r 
  }

}
