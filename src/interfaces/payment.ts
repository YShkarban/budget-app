export interface Payment {
  id?: string;
  amount: number;
  type: string;
  description: string;
  month: Date;
  date: Date;
  user: string;
}
