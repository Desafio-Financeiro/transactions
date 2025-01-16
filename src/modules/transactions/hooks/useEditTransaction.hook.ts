import { ToastProps } from "fiap-financeiro-ds/dist/toast";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import type { TransactionTypes } from "../../../@types/transaction";
import { updateTransaction } from "../../../services/transactions";

export const useEditTransaction = () => {
  const { trigger: updateTransactionMutation, isMutating } = useSWRMutation(
    "/api/transacao",
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
    transactionId: string,
    value: number | string,
    transactionType: TransactionTypes,
    handleClose: VoidFunction
  ) => {
    try {
      await updateTransactionMutation({
        id: transactionId,
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
