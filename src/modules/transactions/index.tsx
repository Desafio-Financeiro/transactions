import { Card } from "fiap-financeiro-ds";
import { TableData } from "./components/table-data";
import { Transaction } from "../../@types/transaction";
import useSWR from "swr";
import { getTransactionListRequest } from "../../services/transactions";
import { withTheme } from "../../withTheme";

function createData({ id, accountId, type, value, date }: Transaction) {
  return { id, accountId, type, value, date };
}

function TransactionsComponent() {
  const { data: transactionResponse } = useSWR(
    {
      url: `/transactions`,
      headers: {},
    },
    getTransactionListRequest
  );

  const rows = transactionResponse?.data.map((d: Transaction) => createData(d));

  return (
    <Card
      type="default"
      sx={{
        flex: 1,
        overflow: "auto",
        minHeight: "calc(100vh - 144px)",
      }}
    >
      {rows?.length > 0 ? (
        <TableData data={rows} />
      ) : (
        <span>Não foram encontradas transações para essa conta</span>
      )}
    </Card>
  );
}

const Transactions = withTheme(TransactionsComponent);

export default Transactions;
