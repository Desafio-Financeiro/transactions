import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { deleteTransaction as deleteTransactionService } from "../../../services/transactions";
import { ToastProps } from "fiap-financeiro-ds/dist/toast";
import { CustomEventsEnum } from "../../../@types/custom-events";

export const useDeleteTransaction = () => {
  const { trigger: deleteTransactionMutation, isMutating } = useSWRMutation(
    "/transactions",
    deleteTransactionService
  );

  const [toastProps, setToastProps] = useState<Omit<ToastProps, "handleClose">>(
    {
      type: "info",
      content: "",
      isOpen: false,
    }
  );

  const deleteTransaction = async (id: string, handleClose: VoidFunction) => {
    try {
      await deleteTransactionMutation({
        id,
      });

      const transactionRemoved = new CustomEvent(
        CustomEventsEnum.TRANSACTION_REMOVED
      );
      document.dispatchEvent(transactionRemoved);

      setToastProps({
        type: "success",
        content: "Transação apagada com sucesso!",
        isOpen: true,
      });
    } catch (error) {
      console.error(error);
      setToastProps({
        type: "error",
        content: "Erro ao apagar transação.",
        isOpen: true,
      });
    } finally {
      handleClose();
    }
  };

  return {
    deleteTransaction,
    isLoading: isMutating,
    toastProps,
    setToastProps,
  };
};
