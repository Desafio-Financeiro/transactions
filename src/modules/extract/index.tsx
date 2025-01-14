import { Card } from "fiap-financeiro-ds";

interface ExtractProps {
  list: any;
}

export default function Extract({ list }: ExtractProps) {
  console.log("Dados", list);

  return (
    <Card
      type="default"
      sx={{
        flex: 1,
        overflow: "auto",
        minHeight: "calc(100vh - 144px)",
      }}
    >
      EXTRATO
      {list.length > 0 ? (
        <div>
          {list.map((t: any) => (
            <p key={t.id}>
              {t.type} - {t.value}
            </p>
          ))}
        </div>
      ) : (
        <span>Não foram encontradas transações para essa conta</span>
      )}
    </Card>
  );
}
