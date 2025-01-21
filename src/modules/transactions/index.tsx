import { Button, Card } from "fiap-financeiro-ds";
import { TableData } from "./components/table-data";
import { Transaction } from "../../@types/transaction";
import useSWR from "swr";

import { getTransactionListRequest } from "../../services/transactions";
import { withTheme } from "../../withTheme";
import { useEffect, useState } from "react";
import { CustomEventsEnum } from "../../@types/custom-events";
import { Box } from "@mui/material";
function createData({ id, userId, type, value, createdAt }: Transaction) {
  return { id, userId, type, value, createdAt };
}

function TransactionsComponent() {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    isLast: true,
  });
  const [lastPage, setLastPage] = useState(1);
  const {
    data: transactionResponse,
    mutate,
    isLoading,
  } = useSWR(
    {
      url: `/transactions?userId=1&_sort=createdDate&_order=desc&_page=${pageInfo.page}&_limit=2`,
    },
    getTransactionListRequest,
    {
      onSuccess(data) {
        const last = Number(parseLinkHeader(data.headers["link"]).lastPage);
        setLastPage(last);
        setPageInfo((oldState) => ({
          ...oldState,
          isLast: oldState.page === Number(last),
        }));
      },
    }
  );

  function parseLinkHeader(linkHeader: string) {
    const lastValue = linkHeader
      ?.split(",")
      .filter((i) => i.includes("last"))[0];

    const match = lastValue?.match(/<([^>]+)>/);

    const matchValue = match?.length ? match[0] : "";

    const pageMatch = matchValue.match(/_page=([0-9]+)/);

    const lastPage = pageMatch?.length ? pageMatch[1] : 1;

    return {
      lastPage,
    };
  }

  function handleNextPage(pageType: "next" | "prev") {
    setPageInfo((oldState) => {
      let page = oldState.page;
      if (pageType === "next") {
        page += 1;
      }

      if (pageType === "prev") {
        page -= 1;
      }

      const isLast = Number(lastPage) === page;

      return {
        isLast,
        page,
      };
    });
  }

  const rows = transactionResponse?.data.map((d: Transaction) => createData(d));

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
      {isLoading ? (
        <span>Carregando...</span>
      ) : rows?.length > 0 ? (
        <>
          <TableData data={rows} />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: " center",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            {pageInfo.page > 1 && (
              <Button
                onClick={() => handleNextPage("prev")}
                label="Anterior"
                variant="outlined"
                color="tertiary"
              />
            )}

            {!pageInfo.isLast && (
              <Button
                onClick={() => handleNextPage("next")}
                label="Proximo"
                variant="outlined"
                color="tertiary"
              />
            )}
          </Box>
        </>
      ) : (
        <span>Não foram encontradas transações para essa conta</span>
      )}
    </Card>
  );
}

const Transactions = withTheme(TransactionsComponent);

export default Transactions;
