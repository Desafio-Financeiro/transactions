import { ToastProps } from "fiap-financeiro-ds/dist/toast";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import type {
  Transaction,
  TransactionTypes,
} from "../../../@types/transaction";
import { updateTransaction } from "../../../services/transactions";
import { CustomEventsEnum } from "../../../@types/custom-events";

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
        data: {
          userId: transaction.userId,
          id: transaction.id,
          value: Number(value),
          type: transactionType,
          createdAt: transaction.createdAt,
        },
      });

      setToastProps({
        isOpen: true,
        type: "success",
        content: "Transação editada com sucesso!",
      });

      const transactionUpdated = new CustomEvent(
        CustomEventsEnum.TRANSACTION_UPDATED
      );
      document.dispatchEvent(transactionUpdated);

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
