export type TransactionTypes = "saque" | "deposito";

export interface Transaction {
  createdAt: string;
  id: string;
  type: TransactionTypes;
  userId: string;
  value: number;
}

export type TransactionState = {
  data: Transaction[];
  isLoading: boolean;
  error: boolean;
};

export type GroupedTransaction = {
  monthNumber: number;
  year: number;
  transactions: Transaction[];
};
