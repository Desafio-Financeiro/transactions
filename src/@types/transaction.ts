export type TransactionTypes = "Debit" | "Credit";

export type Transaction = {
  id: string;
  accountId: string;
  type: TransactionTypes;
  value: number;
  date: Date;
};

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
