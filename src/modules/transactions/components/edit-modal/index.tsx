import { Modal, Toast } from "fiap-financeiro-ds";
import { useEffect, useState } from "react";
import { useEditTransaction } from "../../hooks/useEditTransaction.hook";
import { TransactionForm } from "../transaction-form";
import type {
  Transaction,
  TransactionTypes,
} from "../../../../@types/transaction";

interface EditModalProps {
  open: boolean;
  handleClose: () => void;
  transaction: Transaction | null;
}

export function EditModal({ open, handleClose, transaction }: EditModalProps) {
  const [value, setValue] = useState<string>("");
  const [transactionType, setTransactionType] = useState<TransactionTypes>();

  const { toastProps, isLoading, editTransaction, setToastProps } =
    useEditTransaction();

  useEffect(() => {
    setValue((transaction?.value ?? "").toString());
    setTransactionType(transaction?.type || undefined);
  }, [transaction]);

  function handleEditTransaction() {
    if (!transactionType || !transaction?.id) return;

    editTransaction(value, transactionType, transaction, handleClose);
  }

  return (
    <>
      <Toast
        {...toastProps}
        handleClose={() => setToastProps({ ...toastProps, isOpen: false })}
      />
      <Modal
        open={open}
        content={
          <TransactionForm
            transactionType={transactionType}
            setTransactionType={setTransactionType}
            value={value}
            setValue={setValue}
            isMutating={isLoading}
            onSubmit={handleEditTransaction}
          />
        }
        title="Editar"
        handleClose={handleClose}
        handleConfirm={handleEditTransaction}
      />
    </>
  );
}
