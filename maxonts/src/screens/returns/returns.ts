import {LoansService, Returns as IReturns} from "../../services/loans"
import {inject} from "aurelia-framework"

@inject(LoansService)
export class Returns {


  param: string;
  returns: IReturns[] = [];

  loanService: LoansService;

  constructor(loans: LoansService) {
    this.loanService = loans

  }

  async search(): Promise<void> {
    this.returns = await this.loanService.getLoans(this.param);
  }


}
