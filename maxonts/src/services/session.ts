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

  getFullSession() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SESSION))
  }

  async login(username: string, password: string): Promise<string> {
    const response = await sendToApi('login', {
      username,
      password
    }).then(v=>v.json())
    if (response.code === "api.user.login.success") {
      this.userData = response.data as LoginData
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(this.userData))
    }
    return response.code
  }

  async createUser(registerInput: RegisterInput): Promise<boolean> {
    const response = await sendToApi('create', registerInput)
    console.log(await response.json())
    return true;
  }

}
