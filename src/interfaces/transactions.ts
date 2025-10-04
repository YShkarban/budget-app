import { Budget } from "./budget";
import { Payment } from "./payment";
import { Savings } from "./savings";

export interface Transaction {
  id?: string;
  payment: Payment[];
  budget: Budget[];
  month: Date;
  date: Date;
  user: string;
}

