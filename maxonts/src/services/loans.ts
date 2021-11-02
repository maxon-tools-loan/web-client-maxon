import { sleep } from "utils";

export interface Returns {
  loanNo: number;
  employeeNo: number;
  status: number;
  lentBy: number;
  date: number;
}

const returns: Returns[] = [
  {
    loanNo: 1231,
    employeeNo: 123912,
    status: 1290312,
    lentBy: 1902397,
    date: 2193012312,
  },
  {
    loanNo: 1231,
    employeeNo: 123912,
    status: 1290312,
    lentBy: 1902397,
    date: 2193012312,
  },
  {
    loanNo: 1231,
    employeeNo: 123912,
    status: 1290312,
    lentBy: 1902397,
    date: 2193012312,
  }
];

export class LoansService {
  async getLoans(search: string): Promise<Returns[]> {
    console.log(search);

    await sleep(1000)

    return returns;
  }
}
