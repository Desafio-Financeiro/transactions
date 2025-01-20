import { ptBR } from "date-fns/locale";
import { Card, Button, formatCurrency } from "fiap-financeiro-ds";
import { format } from "date-fns";
import { Box, Stack, Typography } from "@mui/material";

import useSWR from "swr";
import { getTransactionListRequest } from "../../services/transactions";
import { GroupedTransaction, Transaction } from "../../@types/transaction";
import { groupTransactionsByMonth } from "./helpers/groupTransactionsByMonth";
import { withTheme } from "../../withTheme";
import { ComponentFallBack } from "./components/fallback";
import { useEffect, useState } from "react";
import { CustomEventsEnum } from "../../@types/custom-events";
import { operationTypeMapper } from "../constants";

const LIST_SIZE = 8;

function ExtractComponent() {
  const [groupedByMonth, setGroupedByMonth] = useState<GroupedTransaction[]>(
    []
  );
  const {
    data: transactionResponse,
    isLoading,
    error,
    mutate,
  } = useSWR(
    {
      url: `/transactions?userId=1`,
    },
    getTransactionListRequest
  );

  useEffect(() => {
    document.addEventListener(CustomEventsEnum.TRANSACTION_CREATED, () => {
      mutate();
    });

    return () => {
      document.removeEventListener(CustomEventsEnum.TRANSACTION_CREATED, () => {
        mutate();
      });
    };
  }, []);

  function toTransactionPage() {
    window.location.href = "/transactions";
  }

  useEffect(() => {
    if (!isLoading && transactionResponse) {
      setGroupedByMonth(
        groupTransactionsByMonth(
          transactionResponse?.data
            .sort(
              (a: Transaction, b: Transaction) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, LIST_SIZE)
        ).reverse()
      );
    }
  }, [transactionResponse, isLoading]);

  if (isLoading) return <ComponentFallBack message="Carregando..." />;

  if (error) return <ComponentFallBack message="Erro ao carregar" />;

  return (
    <Card type="default" sx={{ width: "282px" }}>
      <Typography variant="h5" sx={{ marginBottom: "16px" }}>
        Extrato
      </Typography>

      {(!groupedByMonth || groupedByMonth.length === 0) && (
        <span>Não foram encontradas transações para essa conta</span>
      )}

      {groupedByMonth.map((group: any, i: number) => (
        <Box
          key={group.monthNumber + group.year + i}
          sx={{
            marginBottom: "16px",
          }}
        >
          <Typography
            color="primary.dark"
            fontWeight={600}
            textTransform="capitalize"
          >
            {ptBR.localize.month(group.monthNumber)}
          </Typography>
          <>
            {group.transactions.map((transaction: Transaction) => {
              const isTransfer = transaction.type === "saque";

              return (
                <Stack
                  sx={{
                    marginBottom: "10px",
                    borderBottom: "1px solid",
                    borderColor: "primary.dark",
                    paddingY: "8px",
                  }}
                  key={transaction.id}
                >
                  <Stack
                    direction="row"
                    sx={{
                      marginBottom: "8px",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography fontSize={13} textTransform="capitalize">
                      {operationTypeMapper[transaction.type]}
                    </Typography>
                    <Typography fontSize={13}>
                      {format(new Date(transaction.createdAt), "dd/MM/yyyy")}
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      fontWeight: 400,
                      fontSize: "13px",
                      color: isTransfer ? "error.main" : "success.main",
                    }}
                  >
                    R$ {formatCurrency(transaction.value.toString())}
                  </Typography>
                </Stack>
              );
            })}
          </>
        </Box>
      ))}

      {transactionResponse && transactionResponse.data.length > LIST_SIZE && (
        <Button
          label="Ver mais"
          variant="outlined"
          color="tertiary"
          onClick={toTransactionPage}
        />
      )}
    </Card>
  );
}

const Extract = withTheme(ExtractComponent);

export default Extract;
