import {sleep} from "../utils"

export class LoginService {

  async login(username: string, password: string): Promise<boolean> {
    await sleep(1000);

    return true;

  }

}
