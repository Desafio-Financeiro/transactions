import { ToastProps } from "fiap-financeiro-ds/dist/toast";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import type {
  Transaction,
  TransactionTypes,
} from "../../../@types/transaction";
import { updateTransaction } from "../../../services/transactions";

export const useEditTransaction = () => {
  const { trigger: updateTransactionMutation, isMutating } = useSWRMutation(
    "/transactions",
    updateTransaction
  );

  const [toastProps, setToastProps] = useState<Omit<ToastProps, "handleClose">>(
    {
      type: "info",
      content: "",
      isOpen: false,
    }
  );

  const editTransaction = async (
    value: number | string,
    transactionType: TransactionTypes,
    transaction: Transaction,
    handleClose: VoidFunction
  ) => {
    try {
      await updateTransactionMutation({
        ...transaction,
        value: Number(value),
        type: transactionType,
      });

      setToastProps({
        isOpen: true,
        type: "success",
        content: "Transação editada com sucesso!",
      });

      handleClose();
    } catch (error) {
      console.error(error);
      setToastProps({
        isOpen: true,
        type: "error",
        content: "Erro ao editar transação.",
      });
    }
  };

  return { editTransaction, isLoading: isMutating, toastProps, setToastProps };
};
