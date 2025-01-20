import { Card } from "fiap-financeiro-ds";
import { TableData } from "./components/table-data";
import { Transaction } from "../../@types/transaction";
import useSWR from "swr";
import { getTransactionListRequest } from "../../services/transactions";
import { withTheme } from "../../withTheme";
import { useEffect } from "react";
import { CustomEventsEnum } from "../../@types/custom-events";

function createData({ id, userId, type, value, createdAt }: Transaction) {
  return { id, userId, type, value, createdAt };
}

function TransactionsComponent() {
  const { data: transactionResponse, mutate } = useSWR(
    {
      url: `/transactions?userId=1`,
    },
    getTransactionListRequest
  );

  const rows = transactionResponse?.data
    .sort(
      (a: Transaction, b: Transaction) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .map((d: Transaction) => createData(d));

  useEffect(() => {
    document.addEventListener(CustomEventsEnum.TRANSACTION_UPDATED, () => {
      mutate();
    });

    document.addEventListener(CustomEventsEnum.TRANSACTION_REMOVED, () => {
      mutate();
    });

    return () => {
      document.removeEventListener(CustomEventsEnum.TRANSACTION_UPDATED, () => {
        mutate();
      });

      document.removeEventListener(CustomEventsEnum.TRANSACTION_REMOVED, () => {
        mutate();
      });
    };
  }, []);

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
